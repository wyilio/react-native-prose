@objc(RNProseViewManager)
class RNProseViewManager: RCTViewManager {
  override func view() -> (RNProseView) {
    return RNProseView(bridge: self.bridge)
  }
  
  // unsure what this means
  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  override func shadowView() -> RCTShadowView {
    return RNProseViewShadow(bridge: self.bridge)
  }
}
