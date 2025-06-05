package com.proseview;

import android.view.View;

import androidx.annotation.NonNull;

import com.facebook.react.uimanager.ViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

public class RNProseRawTextManager extends ViewManager<View, RNProseRawTextShadowNode> {
  @NonNull
  @Override
  public String getName() {
    return "RNProseRawText";
  }

  @NonNull
  @Override
  public View createViewInstance(@NonNull ThemedReactContext context) {
    return new View(context); // dummy
  }

  @Override
  public RNProseRawTextShadowNode createShadowNodeInstance() {
    return new RNProseRawTextShadowNode();
  }

  @Override
  public Class<RNProseRawTextShadowNode> getShadowNodeClass() {
    return RNProseRawTextShadowNode.class;
  }

  @Override
  public void updateExtraData(@NonNull View root, Object extraData) {}
}
