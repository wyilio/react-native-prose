package com.reactnativeprose

import android.widget.TextView
import android.text.SpannableString
import android.text.style.AbsoluteSizeSpan
import android.text.Spanned
import android.graphics.Typeface
import android.view.Gravity
import android.util.TypedValue
import com.facebook.react.uimanager.SimpleViewManager
import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import androidx.core.graphics.toColorInt

class ReactNativeProseViewManager : SimpleViewManager<TextView>() {
  override fun getName() = "ProseView"

  override fun createViewInstance(reactContext: ThemedReactContext): TextView {
    val textView = TextView(reactContext)
    textView.text = "ProseView"
    textView.textSize = 16f
    textView.gravity = Gravity.CENTER
    textView.setPadding(16, 16, 16, 16)
    return textView
  }

  @ReactProp(name = "text")
  fun setText(view: TextView, text: String?) {
    if (text.isNullOrEmpty()) {
      view.text = "ProseView"
      return
    }
    view.text = text
  }

  @ReactProp(name = "textColor")
  fun setTextColor(view: TextView, textColor: String?) {
    if (textColor == null) return
    view.setTextColor(textColor.toColorInt())
  }

  @ReactProp(name = "fontSize")
  fun setFontSize(view: TextView, fontSize: Float) {
    view.setTextSize(TypedValue.COMPLEX_UNIT_SP, fontSize)
  }

  @ReactProp(name = "textAlign")
  fun setTextAlign(view: TextView, textAlign: String?) {
    when (textAlign) {
      "center" -> view.gravity = Gravity.CENTER
      "left" -> view.gravity = Gravity.START
      "right" -> view.gravity = Gravity.END
      else -> view.gravity = Gravity.START
    }
  }

  @ReactProp(name = "fontWeight")
  fun setFontWeight(view: TextView, fontWeight: String?) {
    when (fontWeight) {
      "bold" -> view.setTypeface(view.typeface, Typeface.BOLD)
      "normal" -> view.setTypeface(view.typeface, Typeface.NORMAL)
      else -> view.setTypeface(view.typeface, Typeface.NORMAL)
    }
  }

  @ReactProp(name = "paragraphSpacing")
  fun setParagraphSpacing(view: TextView, spacing: Int) {
    if (view.text.isNullOrEmpty()) return

    val text = view.text.toString()
    val spannableString = SpannableString(text)

    // Find double newlines and add paragraph spacing
    val regex = "\\n\\n".toRegex()
    val matches = regex.findAll(text)

    for (match in matches) {
      val start = match.range.first
      val end = match.range.last + 1
      val span = AbsoluteSizeSpan(spacing, true)
      spannableString.setSpan(span, start, end, Spanned.SPAN_EXCLUSIVE_EXCLUSIVE)
    }

    view.text = spannableString
  }
}
