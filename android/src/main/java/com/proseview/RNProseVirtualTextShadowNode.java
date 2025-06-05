package com.proseview;

import android.text.Spannable;

public class RNProseVirtualTextShadowNode extends RNProseBaseTextShadowNode {
  @Override
  public boolean isVirtual() {
    return true;
  }

  public RNProseVirtualTextShadowNode() {
    super();
  }

  @Override
  public void onAfterUpdateTransaction() {
    super.onAfterUpdateTransaction();
    markUpdated();
  }

  @Override
  public void markUpdated() {
    super.markUpdated();
    super.dirty();
  }

  public Spannable buildSpannable() {
    return spannedFromShadowNode(
      this,
      null,
      false,
      null
    );
  }
}
