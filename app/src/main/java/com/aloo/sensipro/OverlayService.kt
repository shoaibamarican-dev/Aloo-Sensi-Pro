package com.aloo.sensipro

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.PendingIntent
import android.app.Service
import android.content.Context
import android.content.Intent
import android.content.pm.ServiceInfo
import android.content.res.Configuration
import android.graphics.Color
import android.graphics.PixelFormat
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper
import android.util.DisplayMetrics
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.view.ViewGroup
import android.view.WindowManager
import android.webkit.WebView
import android.widget.FrameLayout
import android.widget.ImageView
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.TextView
import org.json.JSONArray
import org.json.JSONObject

/**
 * Draws crosshair, HUD buttons and the floating menu above every other app.
 * Menu states: "full" (big panel), "min" (small logo bubble), "hidden" (nothing but the crosshair / buttons).
 */
class OverlayService : Service() {

    companion object {
        const val ACT_SHOW = "com.aloo.sensipro.SHOW_MENU"
        const val ACT_HIDE = "com.aloo.sensipro.HIDE_MENU"
        const val ACT_STOP = "com.aloo.sensipro.STOP"
        private const val CH = "aloo_overlay"
        private const val PREF = "aloo_overlay_state"

        @Volatile var instance: OverlayService? = null
        var onChange: ((String) -> Unit)? = null

        private fun strip(json: String): String = try {
            val o = JSONObject(json)
            o.optJSONObject("xh")?.apply { remove("shapes"); remove("cols") }
            o.optJSONObject("mc")?.apply { remove("defs"); remove("skins") }
            o.toString()
        } catch (e: Exception) { "" }

        fun save(ctx: Context, json: String) {
            val s = strip(json)
            if (s.isNotEmpty()) ctx.getSharedPreferences(PREF, Context.MODE_PRIVATE).edit().putString("cfg", s).apply()
        }

        fun savedState(ctx: Context): String = ctx.getSharedPreferences(PREF, Context.MODE_PRIVATE).getString("cfg", "") ?: ""
    }

    // ---------- palette ----------
    private val cPanel = Color.parseColor("#F2100C26")
    private val cLine = Color.parseColor("#5B4AA8")
    private val cField = Color.parseColor("#2A2252")
    private val cMuted = Color.parseColor("#A79FC9")
    private val cAccent = Color.parseColor("#FF3D7F")
    private val cCyan = Color.parseColor("#27E6FF")
    private val cOffTrack = Color.parseColor("#3A3260")

    private val MATCH = ViewGroup.LayoutParams.MATCH_PARENT
    private val WRAP = ViewGroup.LayoutParams.WRAP_CONTENT

    private lateinit var wm: WindowManager
    private val handler = Handler(Looper.getMainLooper())
    private var cfg = JSONObject()
    private var menuState = "full"

    private var xhView: WebView? = null
    private var lastHtml = ""
    private val btns = HashMap<String, FrameLayout>()
    private var panel: View? = null
    private var panelLp: WindowManager.LayoutParams? = null
    private var bubble: View? = null
    private var panelX = 0
    private var panelY = 0
    private var bubbleX = 0
    private var bubbleY = 0
    private val updaters = ArrayList<() -> Unit>()
    private val gamePackages = setOf("com.dts.freefireth", "com.dts.freefiremax")
    private var inGame = true
    private var lastUsageQuery = 0L
    private val gameCheck = object : Runnable {
        override fun run() {
            val now = System.currentTimeMillis()
            if (lastUsageQuery == 0L) lastUsageQuery = now - 5000L
            val usm = getSystemService(USAGE_STATS_SERVICE) as? android.app.usage.UsageStatsManager
            if (usm != null) {
                val events = usm.queryEvents(lastUsageQuery, now)
                val ev = android.app.usage.UsageEvents.Event()
                var last: String? = null
                while (events.hasNextEvent()) {
                    events.getNextEvent(ev)
                    if (ev.eventType == android.app.usage.UsageEvents.Event.MOVE_TO_FOREGROUND) last = ev.packageName
                }
                if (last != null) inGame = gamePackages.contains(last)
            }
            lastUsageQuery = now
            val show = inGame
            val views = listOfNotNull(panel, bubble, xhView) + btns.values
            views.forEach { it.visibility = if (show) View.VISIBLE else View.GONE }
            handler.postDelayed(this, 700L)
        }
    }

    override fun onBind(i: Intent?): IBinder? = null

    override fun onCreate() {
        super.onCreate()
        instance = this
        wm = getSystemService(WINDOW_SERVICE) as WindowManager
        panelX = dp(12); panelY = dp(36)
        bubbleX = dp(12); bubbleY = dp(90)
        handler.post(gameCheck)
    }

    override fun onStartCommand(i: Intent?, f: Int, id: Int): Int {
        instance = this
        startFg()
        when (i?.action) {
            ACT_SHOW -> setMenu("full")
            ACT_HIDE -> setMenu("hidden")
            ACT_STOP -> stopAll()
            else -> {
                val j = i?.getStringExtra("cfg")
                if (j != null) applyConfig(j) else if (cfg.length() == 0) stopSelf()
            }
        }
        return START_NOT_STICKY
    }

    override fun onConfigurationChanged(newConfig: Configuration) {
        super.onConfigurationChanged(newConfig)
        render()
        if (panel != null) { removePanel(); syncMenuViews() }
    }

    override fun onDestroy() {
        handler.removeCallbacks(gameCheck)
        teardown()
        instance = null
        super.onDestroy()
    }

    // ---------- foreground notification ----------
    private fun startFg() {
        (getSystemService(NOTIFICATION_SERVICE) as NotificationManager)
            .createNotificationChannel(NotificationChannel(CH, "Overlay", NotificationManager.IMPORTANCE_LOW))
        val n = buildNotification()
        if (Build.VERSION.SDK_INT >= 34) startForeground(1, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE)
        else startForeground(1, n)
    }

    @Suppress("DEPRECATION")
    private fun buildNotification(): Notification {
        fun act(a: String, code: Int): PendingIntent = PendingIntent.getService(
            this, code, Intent(this, OverlayService::class.java).setAction(a),
            PendingIntent.FLAG_IMMUTABLE or PendingIntent.FLAG_UPDATE_CURRENT)
        val open = PendingIntent.getActivity(this, 9, Intent(this, MainActivity::class.java), PendingIntent.FLAG_IMMUTABLE)
        val hidden = menuState == "hidden"
        val b = Notification.Builder(this, CH)
            .setContentTitle("ALOO SENSI PRO")
            .setContentText(if (hidden) "Menu hidden - tap Show menu" else "Overlay is running")
            .setSmallIcon(R.drawable.ic_stat_aloo)
            .setContentIntent(open)
            .setOngoing(true)
        if (hidden) b.addAction(0, "Show menu", act(ACT_SHOW, 1)) else b.addAction(0, "Hide menu", act(ACT_HIDE, 2))
        b.addAction(0, "Stop", act(ACT_STOP, 3))
        return b.build()
    }

    private fun updateNotification() {
        (getSystemService(NOTIFICATION_SERVICE) as NotificationManager).notify(1, buildNotification())
    }

    // ---------- helpers ----------
    private fun dp(v: Number) = (v.toFloat() * resources.displayMetrics.density).toInt()

    @Suppress("DEPRECATION")
    private fun real(): DisplayMetrics {
        val d = DisplayMetrics()
        wm.defaultDisplay.getRealMetrics(d)
        return d
    }

    private fun lp(w: Int, h: Int, touch: Boolean): WindowManager.LayoutParams {
        var fl = WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE or WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
        if (!touch) fl = fl or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
        return WindowManager.LayoutParams(w, h, WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY, fl, PixelFormat.TRANSLUCENT)
            .apply { gravity = Gravity.TOP or Gravity.START }
    }

    private fun safeRemove(v: View?) { if (v != null) try { wm.removeView(v) } catch (e: Exception) { } }
    private fun truthy(o: Any?): Boolean = when (o) { is Boolean -> o; is Number -> o.toInt() != 0; else -> false }
    private fun sub(key: String): JSONObject = cfg.optJSONObject(key) ?: JSONObject().also { cfg.put(key, it) }
    private fun xh() = sub("xh")
    private fun mc() = sub("mc")
    private fun mcObj(key: String): JSONObject = mc().optJSONObject(key) ?: JSONObject().also { mc().put(key, it) }

    private fun shade(c: Int, f: Float): Int {
        val hsv = FloatArray(3)
        Color.colorToHSV(c, hsv)
        hsv[2] = (hsv[2] * f).coerceIn(0f, 1f)
        if (f > 1f) hsv[1] = (hsv[1] * 0.8f).coerceIn(0f, 1f)
        return Color.HSVToColor(hsv)
    }

    // ---------- config in / out ----------
    fun applyConfig(json: String) {
        try { cfg = JSONObject(json) } catch (e: Exception) { return }
        val any = xh().optBoolean("on") || mc().optBoolean("on")
        if (!any) { teardown(); stopSelf(); return }
        render(); refreshPanel()
    }

    private fun afterChange(delta: JSONObject) {
        render(); refreshPanel()
        val s = strip(cfg.toString())
        if (s.isNotEmpty()) getSharedPreferences(PREF, MODE_PRIVATE).edit().putString("cfg", s).apply()
        onChange?.invoke(delta.toString())
    }

    private fun commitXh(vararg kv: Pair<String, Any>) {
        val d = JSONObject()
        kv.forEach { xh().put(it.first, it.second); d.put(it.first, it.second) }
        afterChange(JSONObject().put("xh", d))
    }

    private fun commitMc(vararg kv: Pair<String, Any>) {
        val d = JSONObject()
        kv.forEach { mc().put(it.first, it.second); d.put(it.first, it.second) }
        afterChange(JSONObject().put("mc", d))
    }

    private fun stopAll() {
        xh().put("on", false); mc().put("on", false)
        val s = strip(cfg.toString())
        if (s.isNotEmpty()) getSharedPreferences(PREF, MODE_PRIVATE).edit().putString("cfg", s).apply()
        onChange?.invoke("{\"xh\":{\"on\":false},\"mc\":{\"on\":false}}")
        teardown()
        stopSelf()
    }

    private fun teardown() {
        safeRemove(xhView); xhView = null; lastHtml = ""
        btns.values.forEach { safeRemove(it) }; btns.clear()
        removePanel(); removeBubble()
    }

    // ---------- rendering ----------
    private fun render() {
        if (menuState == "hidden") {
            safeRemove(xhView); xhView = null; lastHtml = ""
            btns.values.forEach { safeRemove(it) }; btns.clear()
            syncMenuViews()
            return
        }
        renderCrosshair()
        renderMacros()
        syncMenuViews()
    }

    private fun renderCrosshair() {
        val x = xh()
        if (!x.optBoolean("on")) { safeRemove(xhView); xhView = null; lastHtml = ""; return }
        val size = dp(x.optInt("size", 60))
        val svg = x.optJSONArray("shapes")?.optJSONObject(x.optInt("k", 0))?.optString("svg") ?: ""
        val html = "<html><body style='margin:0;background:transparent;overflow:hidden'><svg viewBox='0 0 100 100' " +
            "style='width:100%;height:100%;color:${x.optString("c", "#35f2a0")};opacity:${x.optInt("o", 100) / 100.0}'>" +
            "$svg</svg></body></html>"
        if (xhView == null) {
            val w = WebView(this)
            w.setBackgroundColor(Color.TRANSPARENT)
            xhView = w
            wm.addView(w, lp(size, size, false).apply { gravity = Gravity.CENTER })
        }
        val v = xhView!!
        val p = v.layoutParams as WindowManager.LayoutParams
        p.width = size; p.height = size; p.x = dp(x.optInt("x", 0)); p.y = dp(x.optInt("y", 0))
        wm.updateViewLayout(v, p)
        if (html != lastHtml) { v.loadDataWithBaseURL(null, html, "text/html", "utf-8", null); lastHtml = html }
    }

    private fun iconRes(d: JSONObject, skin: String): Int {
        val key = if (d.optBoolean("fire")) "fire_$skin" else d.optString("id")
        return resources.getIdentifier("mc_$key", "drawable", packageName)
    }

    private fun renderMacros() {
        val m = mc()
        val keep = HashSet<String>()
        if (m.optBoolean("on")) {
            val defs = m.optJSONArray("defs") ?: JSONArray()
            val e = mcObj("e"); val sz = mcObj("sz"); val pos = mcObj("p")
            val locked = m.optBoolean("lock")
            val alpha = m.optInt("o", 85) / 100f
            val skin = m.optString("skin", "ring")
            val dm = real()
            for (i in 0 until defs.length()) {
                val d = defs.getJSONObject(i)
                val id = d.optString("id")
                if (!truthy(e.opt(id))) continue
                keep.add(id)
                val size = dp(sz.optInt(id, m.optInt("size", 64)))
                val pa = pos.optJSONArray(id)
                val fx = pa?.optDouble(0, d.optDouble("x", 0.5)) ?: d.optDouble("x", 0.5)
                val fy = pa?.optDouble(1, d.optDouble("y", 0.5)) ?: d.optDouble("y", 0.5)
                var v = btns[id]
                if (v == null) {
                    v = FrameLayout(this)
                    btns[id] = v
                    v.addView(ImageView(this), FrameLayout.LayoutParams(MATCH, MATCH))
                    wm.addView(v, lp(size, size, !locked))
                    attachDrag(v, id)
                }
                val col = try { Color.parseColor(d.optString("col", "#ff2e4d")) } catch (ex: Exception) { Color.RED }
                val bg = GradientDrawable(GradientDrawable.Orientation.TOP_BOTTOM, intArrayOf(shade(col, 1.25f), col, shade(col, 0.7f)))
                bg.shape = GradientDrawable.OVAL
                if (locked) bg.setStroke(dp(2), Color.parseColor("#CCFFFFFF"), dp(4).toFloat(), dp(3).toFloat())
                else bg.setStroke(dp(2), Color.parseColor("#F2FFFFFF"))
                v.background = bg
                v.alpha = alpha
                val img = v.getChildAt(0) as ImageView
                val pad = (size * 0.2f).toInt()
                img.setPadding(pad, pad, pad, pad)
                val r = iconRes(d, skin)
                if (r != 0) img.setImageResource(r)
                val p = v.layoutParams as WindowManager.LayoutParams
                p.width = size; p.height = size
                p.x = (fx * dm.widthPixels - size / 2.0).toInt()
                p.y = (fy * dm.heightPixels - size / 2.0).toInt()
                p.flags = if (locked) p.flags or WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE
                          else p.flags and WindowManager.LayoutParams.FLAG_NOT_TOUCHABLE.inv()
                wm.updateViewLayout(v, p)
            }
        }
        btns.keys.toList().filter { it !in keep }.forEach { safeRemove(btns.remove(it)) }
    }

    private fun attachDrag(v: View, id: String) {
        var sx = 0f; var sy = 0f; var ox = 0; var oy = 0
        v.setOnTouchListener { _, ev ->
            val p = v.layoutParams as WindowManager.LayoutParams
            when (ev.action) {
                MotionEvent.ACTION_DOWN -> { sx = ev.rawX; sy = ev.rawY; ox = p.x; oy = p.y }
                MotionEvent.ACTION_MOVE -> {
                    p.x = ox + (ev.rawX - sx).toInt(); p.y = oy + (ev.rawY - sy).toInt()
                    wm.updateViewLayout(v, p)
                }
                MotionEvent.ACTION_UP -> {
                    val d = real()
                    val fx = ((p.x + p.width / 2f) / d.widthPixels).toDouble().coerceIn(0.02, 0.98)
                    val fy = ((p.y + p.height / 2f) / d.heightPixels).toDouble().coerceIn(0.02, 0.98)
                    val pos = mcObj("p")
                    pos.put(id, JSONArray().put(fx).put(fy))
                    val s = strip(cfg.toString())
                    if (s.isNotEmpty()) getSharedPreferences(PREF, MODE_PRIVATE).edit().putString("cfg", s).apply()
                    onChange?.invoke(JSONObject().put("mc", JSONObject().put("p", pos)).toString())
                }
            }
            true
        }
    }

    // ---------- menu state ----------
    fun setMenu(state: String) {
        menuState = if (state == "min" || state == "hidden") state else "full"
        render()
        updateNotification()
    }

    private fun syncMenuViews() {
        when (menuState) {
            "full" -> { removeBubble(); if (panel == null) addPanel() }
            "min" -> { removePanel(); if (bubble == null) addBubble() }
            else -> { removePanel(); removeBubble() }
        }
    }

    private fun removePanel() { safeRemove(panel); panel = null; panelLp = null; updaters.clear() }
    private fun removeBubble() { safeRemove(bubble); bubble = null }

    private fun refreshPanel() { updaters.toList().forEach { it() } }

    // ---------- UI builders ----------
    private fun rbg(col: Int, r: Int, sw: Int = 0, sc: Int = 0): GradientDrawable = GradientDrawable().apply {
        setColor(col); cornerRadius = r.toFloat(); if (sw > 0) setStroke(sw, sc)
    }

    private fun tv(s: String, sp: Float, col: Int, bold: Boolean = false): TextView = TextView(this).apply {
        text = s; textSize = sp; setTextColor(col); includeFontPadding = false
        if (bold) typeface = Typeface.DEFAULT_BOLD
    }

    private fun holdRepeat(v: View, act: () -> Unit) {
        var rep: Runnable? = null
        v.setOnTouchListener { view, ev ->
            when (ev.action) {
                MotionEvent.ACTION_DOWN -> {
                    view.alpha = 0.6f
                    act()
                    val r = object : Runnable { override fun run() { act(); handler.postDelayed(this, 80) } }
                    rep = r
                    handler.postDelayed(r, 400)
                }
                MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
                    view.alpha = 1f
                    rep?.let { handler.removeCallbacks(it) }
                    rep = null
                }
            }
            true
        }
    }

    private fun stepBtn(label: String, act: () -> Unit): TextView {
        val t = tv(label, 17f, Color.WHITE, true)
        t.gravity = Gravity.CENTER
        t.background = rbg(cField, dp(9), dp(1), Color.parseColor("#4A3F8F"))
        holdRepeat(t, act)
        return t
    }

    private fun toggle(get: () -> Boolean, set: (Boolean) -> Unit): View {
        val track = FrameLayout(this)
        val knob = View(this)
        knob.background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(Color.WHITE) }
        track.addView(knob, FrameLayout.LayoutParams(dp(20), dp(20)).apply {
            gravity = Gravity.CENTER_VERTICAL or Gravity.START; leftMargin = dp(3); rightMargin = dp(3)
        })
        fun paint() {
            val on = get()
            track.background = rbg(if (on) cAccent else cOffTrack, dp(13))
            (knob.layoutParams as FrameLayout.LayoutParams).gravity = Gravity.CENTER_VERTICAL or (if (on) Gravity.END else Gravity.START)
            knob.requestLayout()
        }
        paint()
        updaters.add { paint() }
        track.setOnClickListener { set(!get()) }
        return track
    }

    private fun stepper(label: String, get: () -> String, minus: () -> Unit, plus: () -> Unit, valueW: Int = 46): View {
        val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL; setPadding(0, dp(3), 0, dp(3)) }
        row.addView(tv(label, 12f, Color.WHITE), LinearLayout.LayoutParams(0, WRAP, 1f))
        row.addView(stepBtn("\u2212", minus), LinearLayout.LayoutParams(dp(34), dp(30)))
        val value = tv(get(), 12f, cCyan, true).apply { gravity = Gravity.CENTER }
        row.addView(value, LinearLayout.LayoutParams(dp(valueW), WRAP))
        row.addView(stepBtn("+", plus), LinearLayout.LayoutParams(dp(34), dp(30)))
        updaters.add { value.text = get() }
        return row
    }

    private fun sectionHeader(title: String, sub: String, get: () -> Boolean, set: (Boolean) -> Unit): View {
        val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL; setPadding(0, dp(12), 0, dp(4)) }
        val col = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        col.addView(tv(title, 12f, cCyan, true))
        col.addView(tv(sub, 10f, cMuted).apply { setPadding(0, dp(2), 0, 0) })
        row.addView(col, LinearLayout.LayoutParams(0, WRAP, 1f))
        row.addView(toggle(get, set), LinearLayout.LayoutParams(dp(46), dp(26)))
        return row
    }

    private fun pillAction(label: String, icon: Int, bg: Int, act: () -> Unit): View {
        val row = LinearLayout(this).apply {
            orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER
            background = rbg(bg, dp(10), dp(1), cLine)
            setPadding(dp(4), dp(7), dp(4), dp(7))
        }
        val img = ImageView(this).apply { setImageResource(icon) }
        row.addView(img, LinearLayout.LayoutParams(dp(16), dp(16)))
        row.addView(tv(label, 11f, Color.WHITE, true).apply { setPadding(dp(5), 0, 0, 0) })
        row.setOnClickListener { act() }
        return row
    }

    // ---------- floating menu (full panel) ----------
    private fun addPanel() {
        updaters.clear()
        val dm = real()
        val w = minOf(dp(312), (dm.widthPixels * 0.92f).toInt())
        val root = LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            background = rbg(cPanel, dp(18), dp(1), cLine)
            setPadding(dp(12), dp(10), dp(12), dp(12))
        }

        // header = drag handle
        val head = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL }
        head.addView(ImageView(this).apply { setImageResource(R.drawable.aloo_logo) }, LinearLayout.LayoutParams(dp(34), dp(34)))
        val titles = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL; setPadding(dp(9), 0, 0, 0) }
        titles.addView(tv("ALOO SENSI PRO", 13f, Color.WHITE, true))
        titles.addView(tv("Floating menu  \u00B7  drag here to move", 9.5f, cMuted).apply { setPadding(0, dp(3), 0, 0) })
        head.addView(titles, LinearLayout.LayoutParams(0, WRAP, 1f))
        root.addView(head, LinearLayout.LayoutParams(MATCH, WRAP))

        // MINIMIZE / HIDE / STOP
        val acts = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; setPadding(0, dp(10), 0, dp(2)) }
        fun addAct(v: View, last: Boolean) = acts.addView(v, LinearLayout.LayoutParams(0, WRAP, 1f).apply { if (!last) rightMargin = dp(6) })
        addAct(pillAction("Minimize", R.drawable.ic_min, cField) { setMenu("min") }, false)
        addAct(pillAction("Hide", R.drawable.ic_hide, cField) { setMenu("hidden") }, false)
        addAct(pillAction("Stop", R.drawable.ic_close, Color.parseColor("#7A1F3D")) { stopAll() }, true)
        root.addView(acts, LinearLayout.LayoutParams(MATCH, WRAP))

        val body = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        buildCrosshairSection(body)
        buildMacroSection(body)
        body.addView(tv("Hide se floating menu aur tamam overlay markers temporarily hide ho jate hain. Notification mein 'Show menu' se wapas laayein.", 9.5f, cMuted)
            .apply { setPadding(0, dp(14), 0, dp(4)) })

        val sv = ScrollView(this).apply { isVerticalScrollBarEnabled = false; overScrollMode = View.OVER_SCROLL_NEVER }
        sv.addView(body, FrameLayout.LayoutParams(MATCH, WRAP))
        val sh = ((dm.heightPixels * 0.85f).toInt() - dp(130)).coerceIn(dp(120), dp(400))
        root.addView(sv, LinearLayout.LayoutParams(MATCH, sh))

        val p = lp(w, WRAP, true).apply {
            x = panelX.coerceIn(0, maxOf(0, dm.widthPixels - w)); y = panelY.coerceIn(0, maxOf(0, dm.heightPixels - dp(120)))
        }
        var sx = 0f; var sy = 0f; var ox = 0; var oy = 0
        head.setOnTouchListener { _, ev ->
            when (ev.action) {
                MotionEvent.ACTION_DOWN -> { sx = ev.rawX; sy = ev.rawY; ox = p.x; oy = p.y }
                MotionEvent.ACTION_MOVE -> {
                    val d = real()
                    p.x = (ox + (ev.rawX - sx).toInt()).coerceIn(0, maxOf(0, d.widthPixels - w))
                    p.y = (oy + (ev.rawY - sy).toInt()).coerceIn(0, maxOf(0, d.heightPixels - dp(80)))
                    panelX = p.x; panelY = p.y
                    wm.updateViewLayout(root, p)
                }
            }
            true
        }
        wm.addView(root, p)
        panel = root; panelLp = p
    }

    private fun buildCrosshairSection(body: LinearLayout) {
        body.addView(sectionHeader("CROSSHAIR", "Screen ke center mein aim dot", { xh().optBoolean("on") }) { commitXh("on" to it) })
        fun count() = xh().optJSONArray("shapes")?.length() ?: 1
        fun shapeName(): String = xh().optJSONArray("shapes")?.optJSONObject(xh().optInt("k", 0))?.optString("n") ?: "-"
        body.addView(stepper("Style", { shapeName() },
            { commitXh("k" to ((xh().optInt("k", 0) - 1 + count()) % count())) },
            { commitXh("k" to ((xh().optInt("k", 0) + 1) % count())) }, 78))
        fun nudge(field: String, d: Int, lo: Int, hi: Int, def: Int) { commitXh(field to (xh().optInt(field, def) + d).coerceIn(lo, hi)) }
        body.addView(stepper("Size", { xh().optInt("size", 60).toString() }, { nudge("size", -4, 20, 200, 60) }, { nudge("size", 4, 20, 200, 60) }))
        body.addView(stepper("Left / Right", { xh().optInt("x", 0).toString() }, { nudge("x", -1, -160, 160, 0) }, { nudge("x", 1, -160, 160, 0) }))
        body.addView(stepper("Up / Down", { xh().optInt("y", 0).toString() }, { nudge("y", -1, -160, 160, 0) }, { nudge("y", 1, -160, 160, 0) }))
        body.addView(stepper("Opacity", { xh().optInt("o", 100).toString() + "%" }, { nudge("o", -10, 20, 100, 100) }, { nudge("o", 10, 20, 100, 100) }))

    }

    private fun buildMacroSection(body: LinearLayout) {
        body.addView(sectionHeader("MACRO BUTTONS", "Game HUD ke upar round buttons", { mc().optBoolean("on") }) { commitMc("on" to it) })
        val lockRow = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL; setPadding(0, dp(4), 0, dp(4)) }
        val lt = LinearLayout(this).apply { orientation = LinearLayout.VERTICAL }
        lt.addView(tv("Lock buttons", 12f, Color.WHITE))
        lt.addView(tv("ON = tap game mein jata hai, OFF = drag karke set karo", 9.5f, cMuted).apply { setPadding(0, dp(2), dp(6), 0) })
        lockRow.addView(lt, LinearLayout.LayoutParams(0, WRAP, 1f))
        lockRow.addView(toggle({ mc().optBoolean("lock") }) { commitMc("lock" to it) }, LinearLayout.LayoutParams(dp(46), dp(26)))
        body.addView(lockRow)

        body.addView(stepper("All buttons size", { mc().optInt("size", 64).toString() },
            { allSize(-4) }, { allSize(4) }))
        body.addView(stepper("Opacity", { mc().optInt("o", 85).toString() + "%" },
            { commitMc("o" to (mc().optInt("o", 85) - 10).coerceIn(25, 100)) },
            { commitMc("o" to (mc().optInt("o", 85) + 10).coerceIn(25, 100)) }))

        val skins = mc().optJSONArray("skins")
        if (skins != null && skins.length() > 0) {
            fun idx(): Int { val cur = mc().optString("skin", "ring"); for (i in 0 until skins.length()) if (skins.optJSONObject(i)?.optString("k") == cur) return i; return 0 }
            fun go(d: Int) { val n = skins.length(); commitMc("skin" to skins.optJSONObject((idx() + d + n) % n).optString("k")) }
            body.addView(stepper("Fire style", { skins.optJSONObject(idx())?.optString("n") ?: "" }, { go(-1) }, { go(1) }, 78))
        }

        body.addView(tv("BUTTONS  \u00B7  switch = show, \u2212/+ = size", 10f, cMuted, true).apply { setPadding(0, dp(12), 0, dp(4)) })
        val defs = mc().optJSONArray("defs") ?: JSONArray()
        for (i in 0 until defs.length()) body.addView(buildMacroRow(defs.getJSONObject(i)))
    }

    private fun allSize(d: Int) {
        val v = (mc().optInt("size", 64) + d).coerceIn(40, 110)
        mc().put("sz", JSONObject())
        commitMc("size" to v, "sz" to mc().getJSONObject("sz"))
    }

    private fun buildMacroRow(d: JSONObject): View {
        val id = d.optString("id")
        val row = LinearLayout(this).apply { orientation = LinearLayout.HORIZONTAL; gravity = Gravity.CENTER_VERTICAL; setPadding(0, dp(3), 0, dp(3)) }
        val col = try { Color.parseColor(d.optString("col")) } catch (e: Exception) { Color.RED }
        val icon = ImageView(this).apply {
            setPadding(dp(5), dp(5), dp(5), dp(5))
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(col); setStroke(dp(1), Color.parseColor("#CCFFFFFF")) }
        }
        row.addView(icon, LinearLayout.LayoutParams(dp(30), dp(30)))
        row.addView(tv(d.optString("n"), 11.5f, Color.WHITE).apply { setPadding(dp(8), 0, 0, 0); maxLines = 1 }, LinearLayout.LayoutParams(0, WRAP, 1f))
        fun size() = mcObj("sz").optInt(id, mc().optInt("size", 64))
        fun bump(delta: Int) {
            val sz = mcObj("sz"); sz.put(id, (size() + delta).coerceIn(30, 130))
            commitMc("sz" to sz)
        }
        row.addView(stepBtn("\u2212") { bump(-4) }, LinearLayout.LayoutParams(dp(28), dp(28)))
        val value = tv(size().toString(), 11f, cCyan, true).apply { gravity = Gravity.CENTER }
        row.addView(value, LinearLayout.LayoutParams(dp(30), WRAP))
        row.addView(stepBtn("+") { bump(4) }, LinearLayout.LayoutParams(dp(28), dp(28)))
        row.addView(toggle({ truthy(mcObj("e").opt(id)) }) { on ->
            val e = mcObj("e"); e.put(id, if (on) 1 else 0); commitMc("e" to e)
        }, LinearLayout.LayoutParams(dp(46), dp(26)).apply { leftMargin = dp(8) })
        updaters.add {
            value.text = size().toString()
            val r = iconRes(d, mc().optString("skin", "ring"))
            if (r != 0) icon.setImageResource(r)
        }
        return row
    }

    // ---------- minimized bubble ----------
    private fun addBubble() {
        val v = ImageView(this).apply {
            setImageResource(R.drawable.aloo_logo)
            setPadding(dp(7), dp(7), dp(7), dp(7))
            background = GradientDrawable().apply { shape = GradientDrawable.OVAL; setColor(cPanel); setStroke(dp(2), cAccent) }
        }
        val s = dp(54)
        val d0 = real()
        val p = lp(s, s, true).apply {
            x = bubbleX.coerceIn(0, maxOf(0, d0.widthPixels - s)); y = bubbleY.coerceIn(0, maxOf(0, d0.heightPixels - s))
        }
        var sx = 0f; var sy = 0f; var ox = 0; var oy = 0; var moved = false
        v.setOnTouchListener { _, ev ->
            when (ev.action) {
                MotionEvent.ACTION_DOWN -> { sx = ev.rawX; sy = ev.rawY; ox = p.x; oy = p.y; moved = false }
                MotionEvent.ACTION_MOVE -> {
                    val dx = ev.rawX - sx; val dy = ev.rawY - sy
                    if (Math.abs(dx) > dp(6) || Math.abs(dy) > dp(6)) moved = true
                    if (moved) {
                        val d = real()
                        p.x = (ox + dx.toInt()).coerceIn(0, maxOf(0, d.widthPixels - s))
                        p.y = (oy + dy.toInt()).coerceIn(0, maxOf(0, d.heightPixels - s))
                        bubbleX = p.x; bubbleY = p.y
                        wm.updateViewLayout(v, p)
                    }
                }
                MotionEvent.ACTION_UP -> if (!moved) setMenu("full")
            }
            true
        }
        wm.addView(v, p)
        bubble = v
        android.animation.ObjectAnimator.ofPropertyValuesHolder(v,
            android.animation.PropertyValuesHolder.ofFloat("scaleX", 1f, 1.07f, 1f),
            android.animation.PropertyValuesHolder.ofFloat("scaleY", 1f, 1.07f, 1f)).apply {
            duration = 2400L
            repeatCount = android.animation.ObjectAnimator.INFINITE
            start()
        }
    }
}
