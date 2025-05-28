@objc(RNProseViewManager)
class RNProseViewManager: RCTViewManager {
  override func view() -> (RNProseView) {
    return RNProseView(bridge: self.bridge)
  }

  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }

  override func shadowView() -> RCTShadowView {
    return RNProseViewShadow(bridge: self.bridge)
  }
}
