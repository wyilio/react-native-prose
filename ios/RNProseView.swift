class RNProseView: UIView, UIGestureRecognizerDelegate {
  let bridge: RCTBridge
  let textView: UITextView

  @objc var selectable: Bool = true {
    didSet {
      textView.isSelectable = selectable
    }
  }

  @objc var onTextLayout: RCTDirectEventBlock?

  @objc var children: [RNUITextViewChild] = []

  init(bridge: RCTBridge) {
    self.bridge = bridge

    if #available(iOS 16.0, *) {
      textView = UITextView(usingTextLayoutManager: false)
    } else {
      textView = UITextView()
    }

    textView.isScrollEnabled = false
    textView.isEditable = false
    textView.isSelectable = true
    textView.backgroundColor = .clear
    textView.textContainerInset = .zero
    textView.textContainer.lineFragmentPadding = 0

    super.init(frame: .zero)
    self.clipsToBounds = true

    addSubview(textView)

    let longPressGestureRecognizer = UILongPressGestureRecognizer(
      target: self,
      action: #selector(callOnLongPress(_:))
    )
    longPressGestureRecognizer.delegate = self
    textView.addGestureRecognizer(longPressGestureRecognizer)

    let pressGestureRecognzier = UITapGestureRecognizer(
      target: self,
      action: #selector(callOnPress(_:))
    )
    pressGestureRecognzier.require(toFail: longPressGestureRecognizer)
    pressGestureRecognzier.delegate = self
    textView.addGestureRecognizer(pressGestureRecognzier)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func reactSetFrame(_ frame: CGRect) {
    UIView.performWithoutAnimation {
      super.reactSetFrame(frame)
    }
  }

  func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
    return true
  }

  @IBAction func callOnPress(_ sender: UITapGestureRecognizer) -> Void {
    self.handlePressIfNecessary(sender)
  }

  @IBAction func callOnLongPress(_ sender: UILongPressGestureRecognizer) -> Void {
    if sender.state == .ended {
      self.handleLongPressIfNecessary(sender)
    }
  }

  func setText(string: NSAttributedString, size: CGSize) {
    self.textView.frame.size = size
    self.textView.attributedText = string

    if let onTextLayout = self.onTextLayout {
      var lines: [String] = []
      textView.layoutManager.enumerateLineFragments(forGlyphRange: NSRange(location: 0, length: string.length)) {
        _, usedRect, _, glyphRange, _ in
        let characterRange = self.textView.layoutManager.characterRange(forGlyphRange: glyphRange, actualGlyphRange: nil)
        let line = (string.string as NSString).substring(with: characterRange)
        lines.append(line)
      }
      onTextLayout(["lines": lines])
    }
  }

  func getLocationOfPress(_ sender: UIGestureRecognizer) -> CGPoint {
    return sender.location(in: self.textView)
  }

  func getTouchChild(_ location: CGPoint) -> RNUITextViewChild? {
    let textContainer = textView.textContainer

    let glyphIndex = self.textView.layoutManager.glyphIndex(
      for: location,
      in: textContainer,
      fractionOfDistanceThroughGlyph: nil
    )

    let lineRect = self.textView.layoutManager.lineFragmentUsedRect(
      forGlyphAt: glyphIndex,
      effectiveRange: nil
    )

    // ignore the touching of paragraph spacing
    if !lineRect.contains(location) {
      return nil
    }

    let charIndex = self.textView.layoutManager.characterIndex(
      for: location,
      in: textView.textContainer,
      fractionOfDistanceBetweenInsertionPoints: nil
    )

    var currIndex = -1
    for uiTextView in self.reactSubviews() {
      guard let uiTextView = uiTextView as? RNUITextView
      else {
        continue
      }

      for child in uiTextView.reactSubviews() {
        guard let child = child as? RNUITextViewChild,
              let childText = child.text
        else {
          continue
        }

        currIndex += childText.utf16.count

        if charIndex <= currIndex {
          return child
        }
      }
    }

    return nil
  }

  func handlePressIfNecessary(_ sender: UITapGestureRecognizer) -> Void {
    let location = getLocationOfPress(sender)
    guard let child = getTouchChild(location),
          let onPress = child.onPress
    else {
      return
    }
    onPress([:])
  }

  func handleLongPressIfNecessary(_ sender: UILongPressGestureRecognizer) -> Void {
    let location = getLocationOfPress(sender)
    guard let child = getTouchChild(location),
          let onLongPress = child.onLongPress
    else {
      return
    }
    onLongPress([:])
  }
}

