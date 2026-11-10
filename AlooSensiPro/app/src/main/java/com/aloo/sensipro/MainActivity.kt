package com.aloo.sensipro

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.provider.Settings
import android.webkit.JavascriptInterface
import android.webkit.WebResourceRequest
import android.webkit.WebView
import android.webkit.WebViewClient
import android.widget.Toast
import android.widget.LinearLayout
import android.view.ViewGroup
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.OnUserEarnedRewardListener
import org.json.JSONObject
import java.security.MessageDigest
import java.security.SecureRandom
import javax.crypto.SecretKeyFactory
import javax.crypto.spec.PBEKeySpec
import android.util.Base64

/** Hosts assets/index.html and bridges it to the overlay service. */
class MainActivity : Activity() {
    companion object {
        @Volatile private var IS_DEBUG = false
        // Debug builds always use Google test ads (safe to tap while testing).
        // Release builds use the production AdMob ad units.
        private val REWARDED_AD_UNIT_ID: String
            get() = if (IS_DEBUG) "ca-app-pub-3940256099942544/5224354917"
                    else "ca-app-pub-2888936097455517/8451416563"
        private val BANNER_AD_UNIT_ID: String
            get() = if (IS_DEBUG) "ca-app-pub-3940256099942544/9214589741"
                    else "ca-app-pub-2888936097455517/8970466321"
        private const val PREF_WALLET = "aloo_wallet"
        private const val KEY_CREDITS = "credits"
        private const val PREF_ACCOUNT = "aloo_device_account"
    }
    private lateinit var web: WebView
    private var rewardedAd: RewardedAd? = null
    private var adLoading = false
    private var bannerAd: AdView? = null
    private var openFastestEmoteOnLoad = false

    override fun onCreate(b: Bundle?) {
        super.onCreate(b)
        IS_DEBUG = (applicationInfo.flags and android.content.pm.ApplicationInfo.FLAG_DEBUGGABLE) != 0
        // Debug/test APK starts with 9999 local testing credits; production starts at 0.
        // Never overwrite an existing wallet balance.
        val walletPrefs = getSharedPreferences(PREF_WALLET, MODE_PRIVATE)
        if (!walletPrefs.contains(KEY_CREDITS)) {
            walletPrefs.edit().putInt(KEY_CREDITS, if (IS_DEBUG) 9999 else 0).apply()
        }
        openFastestEmoteOnLoad = intent?.getBooleanExtra("open_fastest_emote", false) == true
        MobileAds.initialize(this) {}
        if (Build.VERSION.SDK_INT >= 33) requestPermissions(arrayOf("android.permission.POST_NOTIFICATIONS"), 1)
        web = WebView(this)
        web.setBackgroundColor(Color.parseColor("#0A0C14"))
        web.overScrollMode = WebView.OVER_SCROLL_NEVER
        val layout = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setBackgroundColor(Color.parseColor("#0A0C14")) }
        layout.addView(web, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, 0, 1f))
        val banner = AdView(this).apply {
            adUnitId = BANNER_AD_UNIT_ID
            setAdSize(AdSize.BANNER)
            loadAd(AdRequest.Builder().build())
        }
        bannerAd = banner
        layout.addView(banner, LinearLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.WRAP_CONTENT))
        setContentView(layout)
        web.settings.javaScriptEnabled = true
        web.settings.domStorageEnabled = true
        web.settings.setSupportZoom(false)
        web.webViewClient = object : WebViewClient() {
            override fun onPageFinished(view: WebView, url: String) {
                super.onPageFinished(view, url)
                if (openFastestEmoteOnLoad) {
                    view.evaluateJavascript("window.alooRequestedPage=3", null)
                    openFastestEmoteOnLoad = false
                }
            }
            override fun shouldOverrideUrlLoading(v: WebView, r: WebResourceRequest): Boolean {
                val u = r.url
                if (u.scheme == "file") return false
                try {
                    if (u.scheme == "intent") {
                        val i = Intent.parseUri(u.toString(), Intent.URI_INTENT_SCHEME)
                        i.addCategory(Intent.CATEGORY_BROWSABLE)
                        i.component = null
                        i.selector = null
                        try { startActivity(i) } catch (e: Exception) {
                            i.getStringExtra("browser_fallback_url")?.let { startActivity(Intent(Intent.ACTION_VIEW, Uri.parse(it))) }
                        }
                    } else startActivity(Intent(Intent.ACTION_VIEW, u))
                } catch (e: Exception) { }
                return true
            }
        }
        web.addJavascriptInterface(Bridge(), "AlooNative")
        OverlayService.onChange = { json ->
            runOnUiThread { web.evaluateJavascript("window.alooUpdate&&window.alooUpdate($json)", null) }
        }
        web.loadUrl("file:///android_asset/index.html")
    }

    private fun sendRewardResult(earned: Boolean) {
        if (::web.isInitialized) runOnUiThread {
            web.evaluateJavascript("window.alooRewardResult&&window.alooRewardResult($earned)", null)
        }
    }

    private fun requestRewardedAd() {
        if (isFinishing || isDestroyed || adLoading) return
        rewardedAd?.let { ad ->
            rewardedAd = null
            var rewardGranted = false
            ad.fullScreenContentCallback = object : FullScreenContentCallback() {
                override fun onAdDismissedFullScreenContent() {
                    rewardedAd = null
                    if (!rewardGranted) sendRewardResult(false)
                }
                override fun onAdFailedToShowFullScreenContent(error: AdError) {
                    rewardedAd = null
                    sendRewardResult(false)
                }
            }
            ad.show(this, OnUserEarnedRewardListener {
                if (!rewardGranted) {
                    rewardGranted = true
                    changeCredits(5, "Rewarded ad completed")
                    sendRewardResult(true)
                }
            })
            return
        }
        loadRewardedAd()
    }

    private fun loadRewardedAd() {
        if (isFinishing || isDestroyed || adLoading || rewardedAd != null) return
        adLoading = true
        RewardedAd.load(this, REWARDED_AD_UNIT_ID, AdRequest.Builder().build(),
            object : RewardedAdLoadCallback() {
                override fun onAdLoaded(ad: RewardedAd) { adLoading = false; rewardedAd = ad; requestRewardedAd() }
                override fun onAdFailedToLoad(error: LoadAdError) {
                    adLoading = false
                    rewardedAd = null
                    sendRewardResult(false)
                    Toast.makeText(this@MainActivity, "Test ad abhi available nahi hai", Toast.LENGTH_SHORT).show()
                }
            })
    }

    private fun changeCredits(delta: Int, reason: String): Int {
        val p = getSharedPreferences(PREF_WALLET, MODE_PRIVATE)
        val current = p.getInt(KEY_CREDITS, 0)
        val next = (current + delta).coerceIn(0, 100000)
        val history = try { org.json.JSONArray(p.getString("history", "[]")) } catch (e: Exception) { org.json.JSONArray() }
        history.put(JSONObject().put("delta", delta).put("balance", next).put("reason", reason).put("time", System.currentTimeMillis()))
        while (history.length() > 100) history.remove(0)
        p.edit().putInt(KEY_CREDITS, next).putString("history", history.toString()).apply()
        return next
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        setIntent(intent)
        if (intent?.getBooleanExtra("open_fastest_emote", false) == true && ::web.isInitialized) {
            web.evaluateJavascript("window.alooRequestedPage=3;window.alooShowPage&&window.alooShowPage(3)", null)
        }
    }

    override fun onPause() { bannerAd?.pause(); super.onPause() }
    override fun onResume() { super.onResume(); bannerAd?.resume() }
    override fun onDestroy() {
        OverlayService.onChange = null
        bannerAd?.destroy(); bannerAd = null
        super.onDestroy()
    }

    @Deprecated("Deprecated in Java")
    override fun onBackPressed() {
        if (web.canGoBack()) web.goBack() else super.onBackPressed()
    }

    /** Opens social links outside the app WebView. TikTok uses package-targeted HTTPS first. */
    private fun openSocial(kind: String) {
        val url = if (kind == "tiktok") "https://www.tiktok.com/@aloo.pc" else "https://www.youtube.com/@nexo4444-1"
        val packages = if (kind == "tiktok")
            listOf("com.zhiliaoapp.musically", "com.ss.android.ugc.trill", "com.zhiliaoapp.musically.go")
        else listOf("com.google.android.youtube")

        for (pkg in packages) {
            try {
                val appIntent = Intent(Intent.ACTION_VIEW, Uri.parse(url)).apply {
                    setPackage(pkg)
                    addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                }
                if (appIntent.resolveActivity(packageManager) != null) {
                    startActivity(appIntent)
                    return
                }
            } catch (e: ActivityNotFoundException) {
            } catch (e: Exception) {
            }
        }
        try {
            val browser = Intent(Intent.ACTION_VIEW, Uri.parse(url)).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            startActivity(browser)
        } catch (e: Exception) {
            Toast.makeText(this, "Link open nahi hua. Browser ya app install check karein.", Toast.LENGTH_LONG).show()
        }
    }

    private fun accountPrefs() = getSharedPreferences(PREF_ACCOUNT, MODE_PRIVATE)

    private fun passwordDigest(password: String, salt: ByteArray): String {
        val spec = PBEKeySpec(password.toCharArray(), salt, 120_000, 256)
        return try {
            val bytes = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).encoded
            Base64.encodeToString(bytes, Base64.NO_WRAP)
        } finally { spec.clearPassword() }
    }

    inner class Bridge {
        @JavascriptInterface fun createAccount(username: String, password: String): String {
            val clean = username.trim()
            if (!clean.matches(Regex("[A-Za-z0-9_.-]{3,24}")) || password.length < 6) return "invalid"
            val p = accountPrefs()
            if (p.contains("username")) return "exists"
            val salt = ByteArray(16).also { SecureRandom().nextBytes(it) }
            val saved = p.edit()
                .putString("username", clean)
                .putString("salt", Base64.encodeToString(salt, Base64.NO_WRAP))
                .putString("password_hash", passwordDigest(password, salt))
                .putBoolean("logged_in", true)
                .commit()
            return if (saved) "ok" else "error"
        }

        @JavascriptInterface fun loginAccount(username: String, password: String): String {
            val p = accountPrefs()
            val savedName = p.getString("username", null) ?: return "no_account"
            val saltText = p.getString("salt", null) ?: return "no_account"
            val savedHash = p.getString("password_hash", null) ?: return "no_account"
            if (!savedName.equals(username.trim(), ignoreCase = true)) return "wrong_password"
            return try {
                val salt = Base64.decode(saltText, Base64.NO_WRAP)
                val valid = MessageDigest.isEqual(savedHash.toByteArray(), passwordDigest(password, salt).toByteArray())
                if (valid) { p.edit().putBoolean("logged_in", true).apply(); "ok" } else "wrong_password"
            } catch (e: Exception) { "error" }
        }

        @JavascriptInterface fun isAccountLoggedIn(): Boolean = accountPrefs().getBoolean("logged_in", false)
        @JavascriptInterface fun getAccountUsername(): String = accountPrefs().getString("username", "") ?: ""
        @JavascriptInterface fun logoutAccount() { accountPrefs().edit().putBoolean("logged_in", false).apply() }

        @JavascriptInterface fun showRewardedAd() { runOnUiThread { requestRewardedAd() } }
        @JavascriptInterface fun getCredits(): Int = getSharedPreferences(PREF_WALLET, MODE_PRIVATE).getInt(KEY_CREDITS, 0)
        @JavascriptInterface fun getCreditHistory(): String =
            getSharedPreferences(PREF_WALLET, MODE_PRIVATE).getString("history", "[]") ?: "[]"
        @JavascriptInterface fun launchGame(game: String): String {
            val pkg = if (game == "max") "com.dts.freefiremax" else "com.dts.freefireth"
            val launch = packageManager.getLaunchIntentForPackage(pkg) ?: return "not_installed"
            val prefs = getSharedPreferences(PREF_WALLET, MODE_PRIVATE)
            val credits = prefs.getInt(KEY_CREDITS, 0)
            if (credits < 5) return "no_credits"
            return try {
                launch.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
                startActivity(launch)
                changeCredits(-5, "Game launch")
                "ok"
            } catch (e: Exception) { "launch_failed" }
        }
        @JavascriptInterface fun hasPermission(): Boolean = Settings.canDrawOverlays(this@MainActivity)

        @JavascriptInterface fun requestPermission() {
            startActivity(Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:$packageName")))
        }

        @JavascriptInterface fun openLink(kind: String) {
            runOnUiThread { openSocial(kind) }
        }

        @JavascriptInterface fun openUsageAccess() { runOnUiThread { startActivity(Intent(Settings.ACTION_USAGE_ACCESS_SETTINGS).addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)) } }
        @JavascriptInterface fun openFastestEmote() {
            runOnUiThread {
                startActivity(Intent(this@MainActivity, MainActivity::class.java)
                    .putExtra("open_fastest_emote", true)
                    .addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP or Intent.FLAG_ACTIVITY_SINGLE_TOP))
            }
        }

        /** Last config the overlay knew (it may have been edited from the floating menu while the app was closed). */
        @JavascriptInterface fun getState(): String = OverlayService.savedState(this@MainActivity)

        @JavascriptInterface fun menu(state: String) {
            runOnUiThread { OverlayService.instance?.setMenu(state) }
        }

        @JavascriptInterface fun sync(json: String) {
            runOnUiThread {
                OverlayService.save(this@MainActivity, json)
                if (!Settings.canDrawOverlays(this@MainActivity)) return@runOnUiThread
                val running = OverlayService.instance
                val any = try {
                    val o = JSONObject(json)
                    (o.optJSONObject("xh")?.optBoolean("on") ?: false) || (o.optJSONObject("mc")?.optBoolean("on") ?: false)
                } catch (e: Exception) { false }
                try {
                    if (running != null) running.applyConfig(json)
                    else if (any) {
                        val i = Intent(this@MainActivity, OverlayService::class.java).putExtra("cfg", json)
                        startForegroundService(i)
                    }
                } catch (e: Exception) { }
            }
        }
    }
}
