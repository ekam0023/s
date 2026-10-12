# Android notes

The buildable starter Android project is in the repository's `app/` directory. The older `MainActivity.kt` here is an illustrative Kotlin consent-flow reference only; it is not compiled by the current Gradle project.

The current app requests Android's official screen-capture permission but does not transmit or record the screen. For a complete implementation, follow `CLAUDE_PROMPT.md` and Android's MediaProjection documentation:
https://developer.android.com/media/grow/media-projection
