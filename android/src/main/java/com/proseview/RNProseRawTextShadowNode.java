package com.proseview;

import androidx.annotation.Nullable;

import com.facebook.react.uimanager.ReactShadowNodeImpl;
import com.facebook.react.uimanager.annotations.ReactProp;

public class RNProseRawTextShadowNode extends ReactShadowNodeImpl {
  private @Nullable String mText = null;

  @ReactProp(name = "text")
  public void setText(@Nullable String text) {
    mText = text;
    markUpdated();
  }

  public String getText() {
    return mText;
  }

  @Override
  public void markUpdated() {
    super.markUpdated();
    super.dirty();
  }

  @Override
  public boolean isVirtual() {
    return true;
  }

  @Override
  public String toString() {
    return getViewClass() + " [text: " + mText + "]";
  }
}
