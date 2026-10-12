# ClearView Consent Screen Share — Rebuilt Starter

This repository now includes a GitHub Actions workflow and a minimal Android Studio Gradle project so the Android **debug APK can build**.

## What is included
- `app/` — minimal Android app that asks the device owner to approve Android's official screen-capture prompt.
- `server/` — Node.js + Socket.IO signaling-server starter.
- `web/` — browser viewer interface.
- `.github/workflows/build.yml` — validates JavaScript and builds the Android debug APK on pushes, pull requests, or manual workflow runs.
- `CLAUDE_PROMPT.md` — implementation brief for continuing the project.

## Important limitations
This is **not yet a complete live screen-sharing app**. The Android screen is not streamed to the browser; WebRTC sender/receiver integration, a compliant foreground service, production session authorization, HTTPS/WSS, and TURN configuration still need implementation and testing. The app never bypasses Android's system consent prompt.

## Get the APK from GitHub Actions
1. Upload the contents of this ZIP to a GitHub repository (the `ConsentScreenShare` folder should be the repository root, so `.github`, `app`, `server`, `web`, and the Gradle files are at the top level).
2. Open the repository's **Actions** tab.
3. Select **Build and validate ClearView**.
4. Open the newest successful run.
5. Under **Artifacts**, download `ClearView-debug-apk`.
6. Extract the downloaded artifact to find `app-debug.apk`.

If a run fails, open the run, click the failed job, and expand the first red step. The exact error text above the `Process completed with exit code 1` line is what identifies the cause.

## Build locally
Install JDK 17 and Gradle 8.9, then from this folder run:

```bash
gradle assembleDebug
```

The APK is written to `app/build/outputs/apk/debug/app-debug.apk`.

## Run the signaling server locally
Install Node.js 20+, then:

```bash
cd server
npm install
npm start
```

The local server uses port 3000 by default. Do not expose it publicly without HTTPS/WSS, a strict origin allow-list, authentication, rate limiting, and security testing.

## Browser viewer
Serve the `web` folder over HTTP and open `index.html`. The starter viewer connects to `http://localhost:3000`, so this default is only suitable for local testing on the same computer. It currently does not receive video.

## Security
Only share a device with the owner's informed permission. Keep Android's system consent prompt, show clear sharing status, and provide a reliable stop control in any completed implementation.
