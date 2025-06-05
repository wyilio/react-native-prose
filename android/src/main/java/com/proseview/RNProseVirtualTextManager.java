package com.proseview;

import android.view.View;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.facebook.react.common.MapBuilder;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.ThemedReactContext;

import java.util.Map;

public class RNProseVirtualTextManager extends BaseViewManager<View, RNProseVirtualTextShadowNode> {
  @NonNull
  @Override
  public String getName() {
    return "RNProseVirtualText";
  }

  @Override
  public View createViewInstance(ThemedReactContext context) {
    throw new IllegalStateException("Attempt to create a native view for RNVirtualProseText");
  }

  @Override
  public RNProseVirtualTextShadowNode createShadowNodeInstance() {
    return new RNProseVirtualTextShadowNode();
  }

  @Override
  public Class<RNProseVirtualTextShadowNode> getShadowNodeClass() {
    return RNProseVirtualTextShadowNode.class;
  }

  @Override
  public void updateExtraData(View view, Object extraData) {}

  @Override
  public @Nullable Map<String, Object> getExportedCustomBubblingEventTypeConstants() {
    return MapBuilder.<String, Object>builder()
      .put("onPress", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onPress")))
      .put("onLongPress", MapBuilder.of("phasedRegistrationNames", MapBuilder.of("bubbled", "onLongPress")))
      .build();
  }
}
