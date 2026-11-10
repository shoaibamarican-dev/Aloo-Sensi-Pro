# ALOO SENSI PRO — Android Studio project

This repository preserves the supplied Kotlin + WebView application and its existing package name (`com.aloo.sensipro`).

## Build

1. Open the `AlooSensiPro` folder in Android Studio.
2. Allow Android Studio to sync Gradle dependencies.
3. Select **Build → Make Project**.
4. For a debug APK, select **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
5. The expected output is `AlooSensiPro/app/build/outputs/apk/debug/app-debug.apk`.

The repository includes `.github/workflows/build.yml`, which installs Java 17 and Gradle 8.7 and runs `assembleDebug` on pushes to `main`/`master` or manually from GitHub Actions.

## Implemented in this update

- Replaced the Train bottom-navigation item with **Fastest Emote**.
- Added a visual screen-position calibration preview with X/Y position, size and spacing controls; settings are saved locally.
- Added a Fastest Emote shortcut to the floating overlay.
- Changed overlay **Hide** to temporarily hide all overlay surfaces; the notification's Show menu action restores them. Minimize remains a compact bubble.
- Changed TikTok opening to use an external package-targeted HTTPS intent, with external-browser fallback. YouTube remains external too.
- Rewarded-ad completion now grants +5 credits in native Android code, with a one-shot reward guard. Closing before completion or an ad failure grants nothing.
- Removed the unrestricted JavaScript `addCredits()` bridge method.
- Added local credit transaction history and a low-balance dialog for game launches.
- Kept Google's official test ad IDs. No live ad IDs are included.

## Important production blockers

This archive did **not** include Firebase configuration, a Firebase project, backend endpoints, signing credentials, or production AdMob IDs. Therefore:

- **Google Sign-In is not implemented or verified.** To finish it, create/register the Firebase Android app for package `com.aloo.sensipro`, add SHA-1 and SHA-256 fingerprints from the release/debug signing certificates, enable Google as a Firebase Authentication provider, download the matching `google-services.json` into `AlooSensiPro/app/`, then add and configure the Google Services Gradle plugin and Firebase Auth flow.
- **Wallet is still device-local demo storage.** SharedPreferences can be modified on a compromised/rooted device and does not sync across reinstalls. A trusted backend/Cloud Functions implementation is required for account-linked balances, transaction validation, server-side reward verification (SSV), and premium entitlements. Do not sell credits or enable real purchases using this local wallet.
- **Premium feature prices are displayed as information only.** Secure feature purchase/unlock is not connected to a backend.
- Rewarded ads and banner ads use official Google test IDs only. Replace them with production IDs only after creating the AdMob app/ad units and completing policy setup. Never test with live ads.
- No device build/test was run in this environment because a Gradle executable and Gradle wrapper scripts were not present. JavaScript syntax and manifest XML were checked; Kotlin compilation, device behavior, Firebase, AdMob runtime, and overlay permissions remain unverified.

## Safety / gameplay scope

Fastest Emote is a visual configuration guide only. Crosshair/HUD markers are positioning aids; this app does not automate taps, repeat game inputs, provide auto-aim, or guarantee headshots.


### Device account
The username/password account screen stores a salted password hash locally in Android SharedPreferences. It is a device-local account only: it does not provide cloud sync, account recovery, or cross-device login. Passwords are not stored in plain text.


## Startup loading fix (2026-11-08)

The splash-screen hang was traced to two JavaScript event listeners referencing optional UI elements (`home0` and `clearData`) that are not present in the HTML. Both listeners now use optional chaining so initialization continues and the splash-screen dismissal timer can run. Both embedded JavaScript blocks passed `node --check`, and XML resources passed an XML parse check. A full Android Gradle build and on-device runtime test were not available in this environment; rebuild the APK with the included GitHub Actions workflow and test on the phone.

## Browser test report (v3)

Tested in headless Chromium (phone-size viewport) with a simulated Android bridge:
- Login: empty/short username and password messages, create account, duplicate handling, login with wrong password or unknown user, correct login, auto-login after restart, LOG OUT and log back in. All pass.
- Every visible button and tab in the app was clicked. No JavaScript errors. Hidden tabs were skipped on purpose.
- Wallet: watch ad (+5), game launch (-5), low-balance popup, transaction history. Pass.
- No horizontal scroll on a 390px-wide phone.

Not tested here: Kotlin compile, real ads, real game launch, overlay on top of Free Fire. These run only on a real device and in GitHub Actions.
