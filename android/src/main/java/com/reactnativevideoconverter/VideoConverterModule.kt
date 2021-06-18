package com.reactnativevideoconverter

import android.media.MediaMetadataRetriever
import android.net.Uri
import android.util.Log
import com.arthenica.ffmpegkit.FFmpegKit
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter

class VideoConverterModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "VideoConverter"
    }

    private fun getVideoLength(filePath: String): Long {

      val retriever = MediaMetadataRetriever()
      retriever.setDataSource(this.reactApplicationContext, Uri.parse(filePath))
      val time = retriever.extractMetadata(MediaMetadataRetriever.METADATA_KEY_DURATION)

      return time.toLong()
    }

    @ReactMethod
    fun convert(filePath: String, outputFileName: String, promise: Promise) {
      val duration = getVideoLength(filePath)

      var outputPath = "${this.reactApplicationContext.cacheDir.absolutePath}/$outputFileName"

      FFmpegKit.cancel()

      FFmpegKit.executeAsync("-i $filePath -c:v libx264 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart -vf scale=-2:720,format=yuv420p $outputPath", { session ->
        val state = session.state
        val returnCode = session.returnCode

        if(returnCode.isSuccess) {
          promise.resolve(outputPath)
        } else {
          promise.reject("error", state.toString())
        }
      }, {
        Log.d("log: --->", it.toString())
      }) {
        reactApplicationContext
          .getJSModule(RCTDeviceEventEmitter::class.java)
          .emit("onVideoCodecProgress", it.time.toFloat() / duration.toFloat())
      }
    }

}
