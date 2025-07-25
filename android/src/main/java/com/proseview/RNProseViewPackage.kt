package com.proseview

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class RNProseViewPackage : ReactPackage {
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
    return listOf(
      RNProseViewManager(),
      RNProseVirtualTextManager(),
      RNProseRawTextManager(),
    )
  }

  override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> = emptyList()
}
