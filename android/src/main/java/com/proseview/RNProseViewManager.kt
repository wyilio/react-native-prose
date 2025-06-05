package com.proseview

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.ViewGroupManager

class RNProseViewManager : ViewGroupManager<RNProseView>() {
  override fun getName() = "RNProseView"

  override fun createViewInstance(reactContext: ThemedReactContext): RNProseView {
    return RNProseView(reactContext)
  }

  override fun createShadowNodeInstance(): RNProseViewShadowNode {
    return RNProseViewShadowNode()
  }

  override fun getShadowNodeClass(): Class<RNProseViewShadowNode> {
    return RNProseViewShadowNode::class.java
  }

  override fun updateExtraData(view: RNProseView, extraData: Any?) {
    if (extraData is CharSequence) {
      view.text = extraData
    }
  }
}
