package com.example.consentscreenshare

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.media.projection.MediaProjectionManager
import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

/**
 * Consent-flow example only. It does not transmit, record, or save the screen.
 * A real implementation must start a compliant foreground service and connect
 * the MediaProjection result to a WebRTC video source.
 */
class MainActivity : AppCompatActivity() {
    private lateinit var status: TextView
    private val screenCaptureLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            if (result.resultCode == Activity.RESULT_OK && result.data != null) {
                status.text = "Permission approved. WebRTC streaming is not implemented yet."
                // TODO: Pass resultCode and data to a MediaProjection foreground service.
                // Do not store the permission result or attempt to reuse it indefinitely.
            } else {
                status.text = "Screen sharing was not approved."
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        status = TextView(this).apply {
            text = "Screen sharing is off. The device owner must approve the Android prompt."
            textSize = 16f
            setPadding(0, 0, 0, 24)
        }
        val startButton = Button(this).apply {
            text = "Start screen sharing"
            setOnClickListener { requestScreenCaptureConsent() }
        }
        val stopButton = Button(this).apply {
            text = "Stop sharing"
            setOnClickListener {
                // TODO: Stop the foreground service and release WebRTC/MediaProjection resources.
                status.text = "Sharing stopped (service integration still required)."
            }
        }

        setContentView(LinearLayout(this).apply {
            orientation = LinearLayout.VERTICAL
            setPadding(32, 48, 32, 32)
            addView(status)
            addView(startButton)
            addView(stopButton)
        })
    }

    private fun requestScreenCaptureConsent() {
        val manager = getSystemService(Context.MEDIA_PROJECTION_SERVICE) as MediaProjectionManager
        screenCaptureLauncher.launch(manager.createScreenCaptureIntent())
    }
}
