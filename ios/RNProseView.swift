class RNProseView: UIView, UIGestureRecognizerDelegate {
  let bridge: RCTBridge
  let textView: UITextView

  @objc var selectable: Bool = true {
    didSet {
      textView.isSelectable = selectable
    }
  }

  @objc var onTextLayout: RCTDirectEventBlock?

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

    let longPress = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress(_:)))
    longPress.delegate = self
    textView.addGestureRecognizer(longPress)

    let tap = UITapGestureRecognizer(target: self, action: #selector(handleTap(_:)))
    tap.require(toFail: longPress)
    tap.delegate = self
    textView.addGestureRecognizer(tap)
  }

  required init?(coder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override func reactSetFrame(_ frame: CGRect) {
    UIView.performWithoutAnimation {
      super.reactSetFrame(frame)
    }
  }

  func setText(string: NSAttributedString, size: CGSize) {
    self.textView.frame.size = size
    // self.textView.attributedText = string
    if self.textView.attributedText.string != string.string {
      self.textView.attributedText = string
    }
    // self.textView.selectedTextRange = nil
    print("📣 RNProseView.setText called. First responder: \(textView.isFirstResponder), selectedRange: \(String(describing: textView.selectedTextRange))")

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

  @objc func handleTap(_ sender: UITapGestureRecognizer) {
    // Optionally delegate touch logic to child-aware handler
  }

  @objc func handleLongPress(_ sender: UILongPressGestureRecognizer) {
    if sender.state == .ended {
      // Optionally delegate long press logic to child-aware handler
    }
  }

  func gestureRecognizer(_ gestureRecognizer: UIGestureRecognizer, shouldRecognizeSimultaneouslyWith otherGestureRecognizer: UIGestureRecognizer) -> Bool {
    return true
  }
}

