package com.proseview;

import android.graphics.Paint;
import android.text.Spanned;
import android.text.style.LineHeightSpan;

  public class FixedLineHeightSpan implements LineHeightSpan {
    private final int topSpacingPx;
    private final int bottomSpacingPx;

    public FixedLineHeightSpan(int topSpacingPx, int bottomSpacingPx) {
      this.topSpacingPx = topSpacingPx;
      this.bottomSpacingPx = bottomSpacingPx;
    }

    @Override
    public void chooseHeight(CharSequence text, int start, int end,
                             int spanstartv, int v, Paint.FontMetricsInt fm) {

      if (!(text instanceof Spanned spanned)) return;

      int spanStart = spanned.getSpanStart(this);
      int spanEnd = spanned.getSpanEnd(this);

      if (start == spanStart) {
        fm.ascent -= topSpacingPx;
        fm.top -= topSpacingPx;
      }

      if (end == spanEnd) {
        fm.descent += bottomSpacingPx;
        fm.bottom += bottomSpacingPx;
      }
    }
  }
