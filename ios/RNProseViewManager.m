#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(RNProseViewManager, RCTViewManager)
RCT_REMAP_SHADOW_PROPERTY(allowsFontScaling, allowsFontScaling, BOOL)
RCT_REMAP_SHADOW_PROPERTY(paragraphSpacing, paragraphSpacing, CGFloat)
RCT_REMAP_SHADOW_PROPERTY(lineHeight, lineHeight, CGFloat)
RCT_REMAP_SHADOW_PROPERTY(fontSize, fontSize, CGFloat)

RCT_EXPORT_VIEW_PROPERTY(onTextLayout, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(selectable, BOOL)

@end
