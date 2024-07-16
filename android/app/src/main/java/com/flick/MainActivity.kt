package com.flick

import com.facebook.react.ReactActivity
import android.os.Bundle

class MainActivity : ReactActivity() {

    override fun getMainComponentName(): String {
        return "Flick"
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(null)
    }
}
