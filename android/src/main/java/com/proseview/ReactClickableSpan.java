package com.proseview;

import android.text.TextPaint;
import android.text.style.ClickableSpan;
import android.util.Log;
import android.view.View;
import androidx.annotation.NonNull;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.uimanager.UIManagerHelper;
import com.facebook.react.uimanager.events.Event;
import com.facebook.react.uimanager.events.EventDispatcher;
import com.facebook.react.uimanager.events.RCTEventEmitter;
import com.facebook.react.views.text.ReactSpan;

/**
 * Custom event for text press actions
 */
class TextPressEvent extends Event<TextPressEvent> {
  private final WritableMap mEventData;

  public TextPressEvent(int surfaceId, int viewTag, WritableMap eventData) {
    super(surfaceId, viewTag);
    mEventData = eventData;
  }

  @Override
  public String getEventName() {
    return "onPress";
  }

  @Override
  public void dispatch(RCTEventEmitter rctEventEmitter) {
    rctEventEmitter.receiveEvent(getViewTag(), getEventName(), mEventData);
  }
}

// /**
//  * This class is used in {@link TextLayoutManager} to linkify and style a span of text with
//  * accessibilityRole="link". This is needed to make nested Text components accessible.
//  *
//  * <p>For example, if your React component looks like this:
//  *
//  * <pre>{@code
//  * <Text>
//  *   Some text with
//  *   <Text onPress={onPress} accessible={true} accessibilityRole="link">a link</Text>
//  *   in the middle.
//  * </Text>
//  * }</pre>
//  *
//  * then only one {@link ReactTextView} will be created, for the parent. The child Text component
//  * does not exist as a native view, and therefore has no accessibility properties. Instead, we have
//  * to use spans on the parent's {@link ReactTextView} to properly style the child, and to make it
//  * accessible (TalkBack announces that the text has links available, and the links are exposed in
//  * the context menu).
//  */
class ReactClickableSpan extends ClickableSpan implements ReactSpan {

  private final int mReactTag;

  ReactClickableSpan(int reactTag) {
    mReactTag = reactTag;
  }

  @Override
  public void onClick(@NonNull View view) {
    try {
      ReactContext context = (ReactContext) view.getContext();

      // Try the newer event system first
      EventDispatcher eventDispatcher = UIManagerHelper.getEventDispatcherForReactTag(context, mReactTag);
      if (eventDispatcher != null) {
        WritableMap event = Arguments.createMap();
        event.putInt("target", mReactTag);

        // Create a text press event
        TextPressEvent textPressEvent = new TextPressEvent(
          UIManagerHelper.getSurfaceId(context),
          mReactTag,
          event
        );

        eventDispatcher.dispatchEvent(textPressEvent);
      } else {
        // Fallback to direct JS event emission
        WritableMap event = Arguments.createMap();
        event.putInt("target", mReactTag);

        RCTEventEmitter eventEmitter = context.getJSModule(RCTEventEmitter.class);
        eventEmitter.receiveEvent(mReactTag, "onPress", event);
      }
    } catch (Exception e) {
      Log.e("ReactClickableSpan", "Error in onClick: " + e.getMessage(), e);
    }
  }

  @Override
  public void updateDrawState(@NonNull TextPaint ds) {
    // no-op to make sure we don't change the link color or add an underline by default, as the
    // superclass does.
  }

  public int getReactTag() {
    return mReactTag;
  }
}
