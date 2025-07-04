package com.proseview;

import android.os.Build;
import android.text.BoringLayout;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.SpannableStringBuilder;
import android.text.Spanned;
import android.text.StaticLayout;
import android.text.TextPaint;
import android.text.Layout;
import android.view.Gravity;

import com.facebook.infer.annotation.Assertions;
import com.facebook.react.uimanager.NativeViewHierarchyOptimizer;
import com.facebook.react.uimanager.PixelUtil;
import com.facebook.react.uimanager.ReactShadowNode;
import com.facebook.react.uimanager.UIViewOperationQueue;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.text.internal.span.TextInlineViewPlaceholderSpan;
import com.facebook.yoga.YogaBaselineFunction;
import com.facebook.yoga.YogaConstants;
import com.facebook.yoga.YogaDirection;
import com.facebook.yoga.YogaMeasureFunction;
import com.facebook.yoga.YogaMeasureMode;
import com.facebook.yoga.YogaMeasureOutput;
import com.facebook.yoga.YogaNode;

import java.util.ArrayList;

import javax.annotation.Nullable;

public class RNProseViewShadowNode extends RNProseBaseTextShadowNode {

  // It's important to pass the ANTI_ALIAS_FLAG flag to the constructor rather than setting it
  // later by calling setFlags. This is because the latter approach triggers a bug on Android 4.4.2.
  // The bug is that unicode emoticons aren't measured properly which causes text to be clipped.
  private static final TextPaint sTextPaintInstance = new TextPaint(TextPaint.ANTI_ALIAS_FLAG);

  private @Nullable Spannable mPreparedSpannableText;

  private int mParagraphSpacing = 0;

  @ReactProp(name = "paragraphSpacing", defaultFloat = 0f)
  public void setParagraphSpacing(float spacingDip) {
    mParagraphSpacing = Math.round(PixelUtil.toPixelFromDIP(spacingDip));
    markUpdated();
    dirty();
  }
  public RNProseViewShadowNode() {
    super();
    initMeasureFunction();
  }

  private void initMeasureFunction() {
    setMeasureFunction(mTextMeasureFunction);
    setBaselineFunction(mTextBaselineFunction);
  }


  @Override
  public boolean isYogaLeafNode() {
    return true;
  }

  private final YogaMeasureFunction mTextMeasureFunction =
    new YogaMeasureFunction() {
      @Override
      public long measure(
        YogaNode node,
        float width,
        YogaMeasureMode widthMode,
        float height,
        YogaMeasureMode heightMode
      ) {
        Spannable text =  Assertions.assertNotNull(
          mPreparedSpannableText,
          "Spannable element has not been prepared in onBeforeLayout");
        Layout layout = measureSpannedText(text, width, widthMode);

        final int lineCount = layout.getLineCount();

        float layoutWidth = 0;
        if (widthMode == YogaMeasureMode.EXACTLY) {
          layoutWidth = width;
        } else {
          for (int lineIndex = 0; lineIndex < lineCount; lineIndex++) {
            boolean endsWithNewLine =
              text.length() > 0 && text.charAt(layout.getLineEnd(lineIndex) - 1) == '\n';
            float lineWidth =
              endsWithNewLine ? layout.getLineMax(lineIndex) : layout.getLineWidth(lineIndex);
            if (lineWidth > layoutWidth) {
              layoutWidth = lineWidth;
            }
          }
          if (widthMode == YogaMeasureMode.AT_MOST && layoutWidth > width) {
            layoutWidth = width;
          }
        }

        if (android.os.Build.VERSION.SDK_INT > android.os.Build.VERSION_CODES.Q) {
          layoutWidth = (float) Math.ceil(layoutWidth);
        }

        float layoutHeight = layout.getLineBottom(lineCount - 1);

        return YogaMeasureOutput.make(layoutWidth, layoutHeight);
      }
    };

  private final YogaBaselineFunction mTextBaselineFunction =
    new YogaBaselineFunction() {
      @Override
      public float baseline(YogaNode node, float width, float height) {
        Spannable text =
          Assertions.assertNotNull(
            mPreparedSpannableText,
            "Spannable element has not been prepared in onBeforeLayout");

        Layout layout = measureSpannedText(text, width, YogaMeasureMode.EXACTLY);
        return layout.getLineBaseline(layout.getLineCount() - 1);
      }
    };

  private Layout measureSpannedText(Spannable text, float width, YogaMeasureMode widthMode) {
    // TODO(5578671): Handle text direction (see View#getTextDirectionHeuristic)
    TextPaint textPaint = sTextPaintInstance;
    textPaint.setTextSize(mTextAttributes.getEffectiveFontSize());
    Layout layout;
    BoringLayout.Metrics boring = BoringLayout.isBoring(text, textPaint);
    float desiredWidth = boring == null ? Layout.getDesiredWidth(text, textPaint) : Float.NaN;

    boolean unconstrainedWidth = widthMode == YogaMeasureMode.UNDEFINED || width < 0;

    Layout.Alignment alignment = Layout.Alignment.ALIGN_NORMAL;
    switch (getTextAlign()) {
      case Gravity.LEFT:
        alignment = Layout.Alignment.ALIGN_NORMAL;
        break;
      case Gravity.RIGHT:
        alignment = Layout.Alignment.ALIGN_OPPOSITE;
        break;
      case Gravity.CENTER_HORIZONTAL:
        alignment = Layout.Alignment.ALIGN_CENTER;
        break;
    }

    if (boring == null
      && (unconstrainedWidth
      || (!YogaConstants.isUndefined(desiredWidth) && desiredWidth <= width))) {
      // Is used when the width is not known and the text is not boring, ie. if it contains
      // unicode characters.

      int hintWidth = (int) Math.ceil(desiredWidth);
      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
        layout =
          new StaticLayout(text, textPaint, hintWidth, alignment, 1.f, 0.f, mIncludeFontPadding);
      } else {
        StaticLayout.Builder builder =
          StaticLayout.Builder.obtain(text, 0, text.length(), textPaint, hintWidth)
            .setAlignment(alignment)
            .setLineSpacing(0.f, 1.f)
            .setIncludePad(mIncludeFontPadding)
            .setBreakStrategy(mTextBreakStrategy)
            .setHyphenationFrequency(mHyphenationFrequency);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
          builder.setJustificationMode(mJustificationMode);
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
          builder.setUseLineSpacingFromFallbacks(true);
        }
        layout = builder.build();
      }

    } else if (boring != null && (unconstrainedWidth || boring.width <= width)) {
      // Is used for single-line, boring text when the width is either unknown or bigger
      // than the width of the text.
      layout =
        BoringLayout.make(
          text,
          textPaint,
          Math.max(boring.width, 0),
          alignment,
          1.f,
          0.f,
          boring,
          mIncludeFontPadding);
    } else {
      // Is used for multiline, boring text and the width is known.

      if (Build.VERSION.SDK_INT < Build.VERSION_CODES.M) {
        layout =
          new StaticLayout(
            text, textPaint, (int) width, alignment, 1.f, 0.f, mIncludeFontPadding);
      } else {
        // Android 11+ introduces changes in text width calculation which leads to cases
        // where the container is measured smaller than text. Math.ceil prevents it
        // See T136756103 for investigation
        if (android.os.Build.VERSION.SDK_INT > android.os.Build.VERSION_CODES.Q) {
          width = (float) Math.ceil(width);
        }

        StaticLayout.Builder builder =
          StaticLayout.Builder.obtain(text, 0, text.length(), textPaint, (int) width)
            .setAlignment(alignment)
            .setLineSpacing(0.f, 1.f)
            .setIncludePad(mIncludeFontPadding)
            .setBreakStrategy(mTextBreakStrategy)
            .setHyphenationFrequency(mHyphenationFrequency);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.P) {
          builder.setUseLineSpacingFromFallbacks(true);
        }
        layout = builder.build();
      }
    }
    return layout;
  }

  private int getTextAlign() {
    int textAlign = mTextAlign;
    if (getLayoutDirection() == YogaDirection.RTL) {
      if (textAlign == Gravity.RIGHT) {
        textAlign = Gravity.LEFT;
      } else if (textAlign == Gravity.LEFT) {
        textAlign = Gravity.RIGHT;
      }
    }
    return textAlign;
  }

  @Override
  public boolean isVirtualAnchor() {
    return false;
  }

  @Override
  public boolean hoistNativeChildren() {
    return true;
  }

  @Override
  public void markUpdated() {
    super.markUpdated();
    super.dirty();
  }

  @Override
  public void onCollectExtraUpdates(UIViewOperationQueue uiViewOperationQueue) {
    Spannable spannable = buildSpannableFromVirtualNodes();

    uiViewOperationQueue.enqueueUpdateExtraData(getReactTag(), spannable);
  }

  @Override
  public void onBeforeLayout(NativeViewHierarchyOptimizer nativeViewHierarchyOptimizer) {
    mPreparedSpannableText = buildSpannableFromVirtualNodes();

    markUpdated();
  }

  private Spannable buildSpannableFromVirtualNodes() {
    SpannableStringBuilder builder = new SpannableStringBuilder();

    for (int i = 0; i < getChildCount(); i++) {
      if (!(getChildAt(i) instanceof RNProseVirtualTextShadowNode proseText)) continue;
      Spannable spannable = proseText.buildSpannable();
      if (spannable != null) {
        int start = builder.length();
        builder.append(spannable);
        int end = builder.length();

        Object[] leakingSpans = builder.getSpans(start, end, Object.class);
        for (Object span : leakingSpans) {
          int spanStart = builder.getSpanStart(span);
          int spanEnd = builder.getSpanEnd(span);

          if (spanEnd == end) {
            int originalSpanFlags = builder.getSpanFlags(span);
            builder.removeSpan(span);
            int priority = originalSpanFlags & Spanned.SPAN_PRIORITY;
            builder.setSpan(span, spanStart, spanEnd, priority | Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);
          }
        }

        if (i < getChildCount() - 1) {
          SpannableString newline = new SpannableString("\n");

          newline.setSpan(new FixedLineHeightSpan(0, mParagraphSpacing), 0, newline.length(), Spanned.SPAN_EXCLUSIVE_EXCLUSIVE);

          builder.append(newline);
        }
      }
    }

    return builder;
  }

  @Override
  public Iterable<? extends ReactShadowNode> calculateLayoutOnChildren() {
    if (mInlineViews == null || mInlineViews.isEmpty()) {
      return null;
    }

    Spanned text =
      Assertions.assertNotNull(
        this.mPreparedSpannableText,
        "Spannable element has not been prepared in onBeforeLayout");
    TextInlineViewPlaceholderSpan[] placeholders =
      text.getSpans(0, text.length(), TextInlineViewPlaceholderSpan.class);
    ArrayList<ReactShadowNode> shadowNodes = new ArrayList<>(placeholders.length);

    for (TextInlineViewPlaceholderSpan placeholder : placeholders) {
      ReactShadowNode child = mInlineViews.get(placeholder.getReactTag());
      child.calculateLayout();
      shadowNodes.add(child);
    }

    return shadowNodes;
  }
}
