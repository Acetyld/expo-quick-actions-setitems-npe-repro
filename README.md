# expo-quick-actions: setItems NPE without a current Activity (Android)

Minimal repro for `QuickActions.setItems` rejecting with a `NullPointerException` when the Activity is gone.
Blank Expo SDK 58 app with `expo-quick-actions@6.0.2`; all repro code is in `App.tsx`.

## Steps

1. Turn on **Developer options > Don't keep activities** on the device or emulator (from the Settings app; `adb shell settings put global always_finish_activities 1` only takes effect after a reboot).
2. `npx expo run:android --variant release`
3. Open the app, then press Home.
4. `adb logcat -s ReactNativeJS`

## Result

```
[repro] background, calling setItems
[repro] setItems call 88 rejected: Error: Call to function 'ExpoQuickActions.setItems' has been rejected.
→ Caused by: java.lang.NullPointerException: Attempt to invoke virtual method 'java.lang.Class java.lang.Object.getClass()' on a null object reference
```

The rejection comes right after the Activity's `onDestroy` (`wm_on_destroy_called` in `adb logcat -b events`).
