# Prompt for Claude AI

Continue this repository into a working **consent-based Android screen-sharing application**.

Requirements:
1. Android app written in Kotlin, built with Android Studio and Gradle.
2. Screen sharing must use Android MediaProjection and show the official system consent dialog every time capture begins.
3. Keep a persistent foreground notification while sharing, with a Stop Sharing action.
4. Use WebRTC for the live video stream and Socket.IO only for signaling.
5. Pair the Android sender and browser viewer using a short-lived session code and an explicit confirmation on the sender.
6. Make the browser viewer responsive and accessible; it should clearly show waiting, connected, and disconnected states.
7. Secure signaling with HTTPS/WSS, session expiry, authentication/authorization, input validation, rate limits, and no public session enumeration.
8. Include a TURN configuration section and explain that STUN alone does not guarantee connectivity over the internet.
9. Provide complete files, Gradle dependencies, manifest entries, and exact Android Studio build steps.
10. Include tests and a security checklist.

Do not implement hidden capture, permission bypasses, background surveillance, stealth behavior, or ways to avoid Android's system consent prompt. Clearly label any part that is not yet implemented. Keep the existing README accurate.
