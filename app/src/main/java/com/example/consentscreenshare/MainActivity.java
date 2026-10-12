package com.example.consentscreenshare;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.media.projection.MediaProjectionManager;
import android.os.Bundle;
import android.view.Gravity;
import android.widget.Button;
import android.widget.LinearLayout;
import android.widget.TextView;

public class MainActivity extends Activity {
    private static final int REQUEST_CAPTURE = 4102;
    private TextView status;

    @Override public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        LinearLayout layout = new LinearLayout(this);
        layout.setOrientation(LinearLayout.VERTICAL);
        layout.setGravity(Gravity.CENTER_VERTICAL);
        int pad = (int)(24 * getResources().getDisplayMetrics().density);
        layout.setPadding(pad, pad, pad, pad);

        TextView title = new TextView(this);
        title.setText("ClearView Screen Share");
        title.setTextSize(24);
        status = new TextView(this);
        status.setText("Screen sharing is off. Tap below and approve Android's system prompt.");
        status.setTextSize(16);
        status.setPadding(0, pad, 0, pad);

        Button start = new Button(this);
        start.setText("Start screen sharing");
        start.setOnClickListener(v -> {
            MediaProjectionManager manager = (MediaProjectionManager)
                getSystemService(Context.MEDIA_PROJECTION_SERVICE);
            startActivityForResult(manager.createScreenCaptureIntent(), REQUEST_CAPTURE);
        });
        Button stop = new Button(this);
        stop.setText("Stop / reset");
        stop.setOnClickListener(v -> status.setText("Sharing is off. No screen is being transmitted by this starter."));

        layout.addView(title);
        layout.addView(status);
        layout.addView(start);
        layout.addView(stop);
        setContentView(layout);
    }

    @Override protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQUEST_CAPTURE) {
            if (resultCode == RESULT_OK && data != null) {
                status.setText("Permission approved. Streaming is not implemented in this starter.");
            } else {
                status.setText("Permission declined. Screen sharing remains off.");
            }
        }
    }
}
