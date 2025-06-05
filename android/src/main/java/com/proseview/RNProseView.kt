package com.proseview

import android.content.Context
import android.widget.TextView
import android.widget.FrameLayout
import android.text.method.LinkMovementMethod
import android.text.Spannable

class RNProseView(context: Context) : FrameLayout(context) {

  private val textView: TextView = TextView(context)

  init {
    textView.isClickable = true
    textView.isLongClickable = true
    textView.setTextIsSelectable(true)
    textView.movementMethod = LinkMovementMethod.getInstance()
    textView.setIncludeFontPadding(false)

    val layoutParams = LayoutParams(LayoutParams.MATCH_PARENT, LayoutParams.WRAP_CONTENT)
    addView(textView, layoutParams)

    setPadding(0, 0, 0, 0)
  }

  override fun onMeasure(widthMeasureSpec: Int, heightMeasureSpec: Int) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec)

    val width = measuredWidth
    val height = measuredHeight

    setMeasuredDimension(width, height)
  }

  override fun onLayout(changed: Boolean, left: Int, top: Int, right: Int, bottom: Int) {
    super.onLayout(changed, left, top, right, bottom)
  }


  var text: CharSequence?
    get() = textView.text

    set(value) {
      if (value is Spannable) {
        textView.setText(value, TextView.BufferType.SPANNABLE)
      } else {
        textView.text = value
      }

      requestLayout()
    }
}
