class RNProseViewShadow: RCTShadowView {
  var bridge: RCTBridge
  var attributedText: NSAttributedString = NSAttributedString()
  var frameSize: CGSize = .zero

  @objc var fontSize: CGFloat = 16.0

  @objc var allowsFontScaling: Bool = true

  @objc var paragraphSpacing: CGFloat = 0 {
    didSet {
      self.dirtyLayout()
    }
  }

  @objc var lineHeight: CGFloat = 0 {
    didSet {
      self.dirtyLayout()
    }
  }

  @objc var lineSpacing: CGFloat = 0 {
    didSet {
      self.dirtyLayout()
    }
  }

  init(bridge: RCTBridge) {
    self.bridge = bridge
    super.init()

    YGNodeSetMeasureFunc(self.yogaNode) { node, width, widthMode, height, heightMode in
      let shadowView = Unmanaged<RNProseViewShadow>.fromOpaque(YGNodeGetContext(node)).takeUnretainedValue()
      return shadowView.getNeededSize(maxWidth: width)
    }

    NotificationCenter.default.addObserver(
      self,
      selector: #selector(preferredContentSizeChanged(_:)),
      name: UIContentSizeCategory.didChangeNotification,
      object: nil
    )
  }

  @objc func preferredContentSizeChanged(_ notification: Notification) {
    self.setAttributedText()
  }

  override func isYogaLeafNode() -> Bool {
    return true
  }

  override func insertReactSubview(_ subview: RCTShadowView!, at atIndex: Int) {
    if subview is RNUITextViewShadow {
      super.insertReactSubview(subview, at: atIndex)
    }
  }

  override func didUpdateReactSubviews() {
    print("🧩 didUpdateReactSubviews — rebuilding attributed text")

    self.setAttributedText()
  }

  override func dirtyLayout() {
    super.dirtyLayout()
    YGNodeMarkDirty(self.yogaNode)
  }

  func setAttributedText() {
    let finalAttributedString = NSMutableAttributedString()

    self.reactSubviews().forEach { child in
      guard let child = child as? RNUITextViewShadow else {
        return
      }

      child.setAttributedText()

      let string = NSMutableAttributedString(attributedString: child.attributedText)

      let paragraphStyle = NSMutableParagraphStyle()

//      if child.lineHeight != 0.0 {
//        // Whenever we change the line height for the text, we are also removing the DynamicType
//        // adjustment for line height. We need to get the multiplier and apply that to the
//        // line height.
//        let scaleMultiplier = scaledFontSize / child.fontSize
//        paragraphStyle.minimumLineHeight = child.lineHeight * scaleMultiplier
//        paragraphStyle.maximumLineHeight = child.lineHeight * scaleMultiplier
//
//        // To calcualte the size of the text without creating a new UILabel or UITextView, we have
//        // to store this line height for later.
//        self.lineHeight = child.lineHeight
//      } else {
//        self.lineHeight = font.lineHeight
//      }

      let paragraphSpacing = self.paragraphSpacing

      paragraphStyle.paragraphSpacing = paragraphSpacing

      if self.lineHeight != 0.0 {
        paragraphStyle.minimumLineHeight = self.lineHeight
        paragraphStyle.maximumLineHeight = self.lineHeight
      }
      if self.lineSpacing != 0.0 {
        paragraphStyle.lineSpacing = self.lineSpacing
      }

      string.addAttribute(
        NSAttributedString.Key.paragraphStyle,
        value: paragraphStyle,
        range: NSMakeRange(0, string.length)
      )

      finalAttributedString.append(string)

      let spacingOnlyStyle = NSMutableParagraphStyle()
      spacingOnlyStyle.paragraphSpacing = self.paragraphSpacing

      let newline = NSMutableAttributedString(string: "\n")
      newline.addAttribute(
        .paragraphStyle,
        value: spacingOnlyStyle,
        range: NSRange(location: 0, length: newline.length)
      )

      finalAttributedString.append(newline)
    }
    self.attributedText = finalAttributedString
    self.dirtyLayout()
  }

  func getNeededSize(maxWidth: Float) -> YGSize {
    let textStorage = NSTextStorage(attributedString: self.attributedText)
    let textContainer = NSTextContainer(size: CGSize(width: CGFloat(maxWidth), height: .greatestFiniteMagnitude))
    textContainer.lineFragmentPadding = 0

    let layoutManager = NSLayoutManager()
    layoutManager.addTextContainer(textContainer)
    textStorage.addLayoutManager(layoutManager)
    layoutManager.ensureLayout(for: textContainer)

    var totalHeight: CGFloat = 0
    layoutManager.enumerateLineFragments(forGlyphRange: layoutManager.glyphRange(for: textContainer)) { _, usedRect, _, _, _ in
      totalHeight += usedRect.height
    }

    self.frameSize = CGSize(width: CGFloat(maxWidth), height: totalHeight)
    return YGSize(width: Float(frameSize.width), height: Float(frameSize.height))
  }

  override func layoutSubviews(with layoutContext: RCTLayoutContext) {
    if YGNodeIsDirty(self.yogaNode) {
      return
    }

    print("📦 layoutSubviews called for RNProseViewShadow. Frame: \(self.frameSize)")

    self.setAttributedText()

    self.bridge.uiManager.addUIBlock { uiManager, viewRegistry in
      guard let proseView = viewRegistry?[self.reactTag] as? RNProseView else {
        return
      }
      proseView.setText(string: self.attributedText, size: self.frameSize)
    }
  }
}

