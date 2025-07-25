import * as React from 'react'

import {
  StyleSheet,
  View,
  Text as RNText,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform
} from 'react-native'
import {UITextView as Text, Prose, ProseText} from 'react-native-prose'

export default function App() {
  const [baseNumLines, setBaseNumLines] = React.useState(1)
  const [baseLayoutNumLines, setBaseLayoutNumLines] = React.useState(0)

  const [uiNumLines, setUiNumLines] = React.useState(1)
  const [uiLayoutNumLines, setUiLayoutNumLines] = React.useState(0)

  const onPress = React.useCallback((text?: string) => {
    Alert.alert('Pressed', `You pressed the text! ${text}`)
  }, [])

  const onLongPress = React.useCallback((text?: string) => {
    Alert.alert('Long Pressed', `You long pressed the text! text: ${text}`)
  }, [])

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1, paddingHorizontal: 10}}>
        <View style={{gap: 20, paddingBottom: 200}}>
          <RNText style={styles.header}>React Native Prose Example</RNText>

          <View>
            <RNText style={styles.subheader}>
              Base RN-Text, not selectable:{' '}
            </RNText>
            <Text style={styles.text}>Hello world!</Text>
          </View>

          <View>
            <RNText style={styles.subheader}>Base RN-Text, selectable:</RNText>
            <RNText selectable style={styles.text}>
              Hello world!
            </RNText>
          </View>

          <View>
            <RNText style={styles.subheader}>RN-UITextView, selectable:</RNText>
            <Text selectable style={styles.text}>
              Hello world!
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>
              RN-UITextView, highlightable
            </RNText>
            <Text selectable uiTextView style={styles.text}>
              Hello world!
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>RN-Prose, selectable:</RNText>
            <Prose>
              <ProseText style={styles.text}>Hello world!</ProseText>
            </Prose>
          </View>

          <RNText style={styles.header}>Prose</RNText>

          <View>
            <RNText style={styles.subheader}>RN-Prose, lorem ipsum:</RNText>
            <Prose paragraphSpacing={16} lineHeight={35}>
              <ProseText style={[styles.fontSize20, styles.coloredBlack]}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut{' '}
                <ProseText
                  style={[
                    styles.fontBold,
                    {
                      fontFamily: Platform.select({
                        ios: 'Times New Roman',
                        android: 'serif',
                        default: 'serif'
                      })
                    }
                  ]}>
                  aliquip ex ea commodo consequat 📚
                </ProseText>
                . Duis aute irure dolor in reprehenderit in voluptate velit esse
                cillum dolore eu{' '}
                <ProseText style={styles.fontItalic}>
                  fugiat nulla pariatur
                </ProseText>
                . Excepteur sint occaecat cupidatat non proident, sunt in culpa
                qui officia deserunt mollit anim id est{' '}
                <ProseText
                  onPress={() => onPress('laborum.')}
                  style={[styles.coloredHex, styles.underlined]}>
                  laborum.
                </ProseText>
              </ProseText>
              <ProseText style={[styles.fontSize20, styles.coloredBlack]}>
                Sed ut perspiciatis, unde omnis iste natus error sit voluptatem
                accusantium doloremque{' '}
                <ProseText style={styles.backgroundColor}>
                  laudantium, totam rem aperiam
                </ProseText>{' '}
                eaque ipsa, quae ab illo inventore veritatis et quasi architecto
                beatae vitae dicta sunt, explicabo.
              </ProseText>
              <ProseText style={[styles.fontSize20, styles.coloredBlack]}>
                Nemo enim ipsam voluptatem, quia voluptas sit, aspernatur aut
                odit aut fugit, sed{' '}
                <ProseText
                  onPress={() => onLongPress('quia consequuntur')}
                  style={[styles.coloredHex, styles.underlined]}>
                  quia consequuntur
                </ProseText>{' '}
                magni dolores eos, qui ratione voluptatem sequi nesciunt, neque
                porro quisquam est, qui dolorem ipsum, quia dolor sit{' '}
                <ProseText
                  onPress={() => onPress('amet consectetur')}
                  style={[styles.coloredHex, styles.underlined]}>
                  amet consectetur
                </ProseText>{' '}
                adipiscing velit , sed quia non numquam do eius modi tempora
                incididunt, ut labore et dolore magnam aliquam quaerat
                voluptatem.
              </ProseText>
            </Prose>
          </View>

          <View>
            <RNText style={styles.subheader}>RN-Prose, fontSize:</RNText>
            <Prose paragraphSpacing={16}>
              <ProseText style={{fontSize: 20, ...styles.fontItalic}}>
                One
                <ProseText style={{fontSize: 30, ...styles.fontItalic}}>
                  Two
                  <ProseText style={{fontSize: 40, ...styles.fontItalic}}>
                    Three
                  </ProseText>
                  Four
                </ProseText>
              </ProseText>
            </Prose>
          </View>

          <RNText style={styles.header}>Styles</RNText>

          <View>
            <RNText style={styles.subheader}>Base, colored</RNText>
            <RNText style={[styles.text, styles.coloredBlue]}>'blue'</RNText>
            <RNText style={[styles.text, styles.coloredHex]}>'#804102'</RNText>
            <RNText style={[styles.text, styles.coloredHexShort]}>
              '#804'
            </RNText>
            <RNText style={[styles.text, styles.coloredHsl]}>
              '#hsl(0, 100%, 50%)'
            </RNText>
          </View>

          <View>
            <RNText style={styles.subheader}>UITextView, colored</RNText>
            <Text
              selectable
              uiTextView
              style={[styles.text, styles.coloredBlue]}>
              'blue'
            </Text>

            <Text
              selectable
              uiTextView
              style={[styles.text, styles.coloredHex]}>
              '#804102'
            </Text>
            <Text
              selectable
              uiTextView
              style={[styles.text, styles.coloredHexShort]}>
              '#804'
            </Text>
            <Text
              selectable
              uiTextView
              style={[styles.text, styles.coloredHsl]}>
              'hsl(0, 100%, 50%)'
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>Base, nested styles</RNText>
            <RNText style={styles.text}>
              Root <RNText style={styles.coloredHex}>Child </RNText>
              <RNText style={styles.coloredBlue}>
                Child <RNText style={styles.coloredHsl}>Subchild</RNText>
              </RNText>
            </RNText>
          </View>

          <View>
            <RNText style={styles.subheader}>UITextView, nested styles</RNText>
            <Text selectable uiTextView style={styles.text}>
              Root{' '}
              <Text selectable uiTextView style={styles.coloredHex}>
                Child{' '}
              </Text>
              <Text selectable uiTextView style={styles.coloredBlue}>
                Child{' '}
                <Text selectable uiTextView style={styles.coloredHsl}>
                  Subchild
                </Text>
              </Text>
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>Base, backgroundColor</RNText>
            <RNText style={[styles.text, styles.backgroundColor]}>
              Hello world!
            </RNText>
            <RNText style={[styles.text]}>
              Hello world!{' '}
              <RNText style={[styles.text, styles.backgroundColor]}>
                And more!
              </RNText>
            </RNText>
          </View>
          <View>
            <Text style={styles.subheader}>UITextView, backgroundColor</Text>
            <Text
              selectable
              uiTextView
              style={[styles.text, styles.backgroundColor]}>
              Hello world!
            </Text>
            <Text selectable uiTextView style={[styles.text]}>
              Hello world!{' '}
              <Text
                selectable
                uiTextView
                style={[styles.text, styles.backgroundColor]}>
                And more!
              </Text>
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>Base, textDecorationLine</RNText>
            <RNText style={[styles.text, styles.underlined]}>
              Hello world!
            </RNText>
            <RNText style={[styles.text, styles.strikethrough]}>
              Hello world!
            </RNText>
            <RNText style={[styles.text, styles.underlinedStrikethrough]}>
              Hello world!
            </RNText>
            <RNText
              style={[
                styles.text,
                styles.underlinedStrikethrough,
                styles.decorationDashed
              ]}>
              Hello world!
            </RNText>
            <RNText
              style={[
                styles.text,
                styles.underlinedStrikethrough,
                styles.decorationDotted
              ]}>
              Hello world!
            </RNText>
            <RNText
              style={[
                styles.text,
                styles.underlinedStrikethrough,
                styles.decorationDouble
              ]}>
              Hello world!
            </RNText>
            <RNText
              style={[
                styles.text,
                styles.underlinedStrikethrough,
                styles.decorationColored
              ]}>
              Hello world!
            </RNText>
          </View>

          <View>
            <RNText style={styles.subheader}>
              UITextView, textDecorationLine
            </RNText>
            <Text
              selectable
              uiTextView
              style={[styles.text, styles.underlined]}>
              Hello world!
            </Text>
            <Text
              selectable
              uiTextView
              style={[styles.text, styles.strikethrough]}>
              Hello world!
            </Text>
            <Text selectable uiTextView>
              <Text
                selectable
                uiTextView
                style={[styles.text, styles.underlinedStrikethrough]}>
                Hello world!
              </Text>
            </Text>
            <Text selectable uiTextView>
              <Text
                selectable
                uiTextView
                style={[
                  styles.text,
                  styles.underlinedStrikethrough,
                  styles.decorationDashed
                ]}>
                Hello world!
              </Text>
            </Text>
            <Text selectable uiTextView>
              <Text
                selectable
                uiTextView
                style={[
                  styles.text,
                  styles.underlinedStrikethrough,
                  styles.decorationDotted
                ]}>
                Hello world!
              </Text>
            </Text>
            <Text selectable uiTextView>
              <Text
                selectable
                uiTextView
                style={[
                  styles.text,
                  styles.underlinedStrikethrough,
                  styles.decorationDouble
                ]}>
                Hello world!
              </Text>
            </Text>
            <Text selectable uiTextView>
              <Text
                selectable
                uiTextView
                style={[
                  styles.text,
                  styles.underlinedStrikethrough,
                  styles.decorationColored
                ]}>
                Hello world!
              </Text>
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>Base, fontSize</RNText>
            <RNText style={styles.fontSize20}>Twenty</RNText>
            <RNText style={styles.fontSize30}>Twenty</RNText>
          </View>

          <View>
            <Text style={styles.subheader}>UITextView, fontSize</Text>
            <Text selectable uiTextView style={styles.fontSize20}>
              Twenty
            </Text>
            <Text selectable uiTextView style={styles.fontSize30}>
              Twenty
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>Base, bold</RNText>
            <RNText style={[styles.text, styles.fontBold]}>Bold</RNText>
          </View>

          <View>
            <Text style={styles.subheader}>UITextView, bold</Text>
            <Text selectable uiTextView style={[styles.text, styles.fontBold]}>
              Bold
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>Base, italic</RNText>
            <RNText style={[styles.text, styles.fontItalic]}>Bold</RNText>
          </View>

          <View>
            <Text style={styles.subheader}>UITextView, italic</Text>
            <Text
              selectable
              uiTextView
              style={[styles.text, styles.fontItalic]}>
              Bold
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>Base, lineHeight</RNText>
            <RNText style={[styles.text, styles.lineHeight10]}>
              A really long string so that it takes up the width of the screen
              for us to test with.
            </RNText>
            <RNText style={[styles.text, styles.lineHeight30]}>
              A really long string so that it takes up the width of the screen
              for us to test with.
            </RNText>
          </View>

          <View>
            <Text style={styles.subheader}>UITextView, lineHeight</Text>
            <Text
              selectable
              uiTextView
              style={[styles.text, styles.lineHeight10]}>
              A really long string so that it takes up the width of the screen
              for us to test with.
            </Text>
            <Text
              selectable
              uiTextView
              style={[styles.text, styles.lineHeight30]}>
              A really long string so that it takes up the width of the screen
              for us to test with.
            </Text>
          </View>

          <View>
            <RNText style={styles.subheader}>Base, inherits</RNText>
            <RNText style={[styles.text, styles.underlined]}>
              A really long string so that{' '}
              <RNText style={[styles.coloredHex, styles.fontSize30]}>
                it takes{' '}
                <RNText style={styles.coloredHsl}>
                  up the width of the screen
                </RNText>{' '}
              </RNText>
              for us to test with.
            </RNText>
          </View>

          <View>
            <Text style={styles.subheader}>UITextView, inherits</Text>
            <Text
              style={[styles.text, styles.underlined]}
              selectable
              uiTextView>
              A really long string so that{' '}
              <Text style={[styles.coloredHex, styles.fontSize30]}>
                it takes{' '}
                <Text style={styles.coloredHsl}>
                  up the width of the screen
                </Text>{' '}
              </Text>
              for us to test with.
            </Text>
          </View>

          <RNText style={styles.header}>numberOfLines, ellipsizeMode</RNText>

          <View>
            <RNText style={styles.subheader}>Base, numberOfLines</RNText>
            <RNText
              style={[styles.text]}
              ellipsizeMode="tail"
              numberOfLines={2}>
              Tail: A really long string so that it takes up the width of the
              screen for us to test with. This should eventually cut off
            </RNText>
            <View style={styles.spacer} />
            <RNText
              style={[styles.text]}
              numberOfLines={2}
              ellipsizeMode="head">
              Head: A really long string so that it takes up the width of the
              screen for us to test with. This should eventually cut off
            </RNText>
            <View style={styles.spacer} />
            <RNText
              style={[styles.text]}
              numberOfLines={2}
              ellipsizeMode="middle">
              Middle: A really long string so that it takes up the width of the
              screen for us to test with. This should eventually cut off
            </RNText>
            <View style={styles.spacer} />
            <RNText
              style={[styles.text]}
              numberOfLines={2}
              ellipsizeMode="clip">
              Clip: A really long string so that it takes up the width of the
              screen for us to test with. This should eventually cut off
            </RNText>
          </View>

          <View>
            <Text style={styles.subheader}>UITextView, numberOfLines</Text>
            <Text
              selectable
              uiTextView
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[styles.text]}>
              Tail: A really long string so that it takes up the width of the
              screen for us to test with. This should eventually cut off
            </Text>
            <View style={styles.spacer} />
            <Text
              style={[styles.text]}
              numberOfLines={2}
              ellipsizeMode="head"
              selectable
              uiTextView>
              Head: A really long string so that it takes up the width of the
              screen for us to test with. This should eventually cut off
            </Text>
            <View style={styles.spacer} />
            <Text
              style={[styles.text]}
              numberOfLines={2}
              ellipsizeMode="middle"
              selectable
              uiTextView>
              Middle: A really long string so that it takes up the width of the
              screen for us to test with. This should eventually cut off
            </Text>
            <View style={styles.spacer} />
            <Text
              style={[styles.text]}
              numberOfLines={2}
              ellipsizeMode="clip"
              selectable
              uiTextView>
              Clip: A really long string so that it takes up the width of the
              screen for us to test with. This should eventually cut off
            </Text>
          </View>

          <RNText style={styles.header}>Pressable</RNText>

          <View>
            <RNText style={styles.subheader}>Base</RNText>
            <RNText onPress={() => onPress('1')} style={styles.text}>
              Press Me
            </RNText>
            <RNText style={styles.text}>
              Portions of base text:{' '}
              <RNText
                style={[styles.text, styles.coloredBlue, styles.underlined]}
                onPress={() => onPress('1')}
                onLongPress={() => onLongPress('1')}>
                Part One
              </RNText>{' '}
              <RNText
                style={[styles.text, styles.coloredHsl, styles.underlined]}
                onPress={() => onPress('2')}
                onLongPress={() => onLongPress('2')}>
                Part Two
              </RNText>{' '}
              <RNText style={[styles.text]}>Emoji 😅😅😅😅</RNText>P
              <RNText
                style={[styles.text, styles.coloredHex, styles.underlined]}
                onPress={() => onPress('3')}
                onLongPress={() => onLongPress('3')}>
                Part Three{' '}
              </RNText>
            </RNText>
          </View>
          <View>
            <RNText style={styles.subheader}>UITextView</RNText>
            <Text
              style={styles.text}
              selectable
              uiTextView
              onPress={() => onPress('1')}
              onLongPress={() => onLongPress('1')}>
              Press Me
            </Text>
            <Text style={styles.text} selectable uiTextView>
              Portions of UITextView text:{' '}
              <Text
                style={[styles.text, styles.coloredBlue, styles.underlined]}
                onPress={() => onPress('1')}>
                Part One
              </Text>{' '}
              <Text
                style={[styles.text, styles.coloredHsl, styles.underlined]}
                onPress={() => onPress('2')}>
                Part Two
              </Text>{' '}
              <Text style={[styles.text]}>Emoji 😅😅😅😅</Text>P
              <Text
                style={[styles.text, styles.coloredHex, styles.underlined]}
                onPress={() => onPress('3')}>
                Part Three{' '}
              </Text>
            </Text>
          </View>

          <RNText style={styles.header}>onTextLayout</RNText>
          <View>
            <RNText style={styles.subheader}>Base. Press to change</RNText>
            <RNText
              style={styles.text}
              numberOfLines={baseNumLines}
              onTextLayout={e => {
                setBaseLayoutNumLines(e.nativeEvent.lines.length)
              }}
              onPress={() => {
                setBaseNumLines(p => {
                  if (p === 1) return 2
                  return 1
                })
              }}>
              onTextLayout lines.length: {baseLayoutNumLines} Press me Press me
              Press me Press me Press me Press me Press me Press me Press me
            </RNText>
          </View>
          <View>
            <RNText style={styles.subheader}>
              UITextView. Press to change
            </RNText>
            <Text
              style={styles.text}
              numberOfLines={uiNumLines}
              onTextLayout={e => {
                setUiLayoutNumLines(e.nativeEvent.lines.length)
              }}
              onPress={() => {
                setUiNumLines(p => {
                  if (p === 1) return 2
                  return 1
                })
              }}
              selectable
              uiTextView>
              onTextLayout lines.length: {uiLayoutNumLines} Press me Press me
              Press me Press me Press me Press me Press me Press me Press me
            </Text>
          </View>

          <RNText style={styles.header}>Empty String</RNText>

          <View>
            <RNText style={styles.subheader}>Base</RNText>
            {/* eslint-disable-next-line react/self-closing-comp */}
            <RNText style={styles.text}></RNText>
          </View>
          <View>
            <RNText style={styles.subheader}>UITextView</RNText>
            {/* eslint-disable-next-line react/self-closing-comp */}
            <Text style={styles.text} selectable uiTextView></Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20
  },
  spacer: {
    height: 10
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  subheader: {
    fontSize: 22,
    fontWeight: 'bold'
  },
  text: {
    fontSize: 18
  },
  coloredBlack: {
    color: 'black'
  },
  coloredBlue: {
    color: 'blue'
  },
  coloredHex: {
    color: '#804102'
  },
  coloredHexShort: {
    color: '#804'
  },
  coloredHsl: {
    color: 'hsl(0, 100%, 50%)'
  },
  underlined: {
    textDecorationLine: 'underline'
  },
  strikethrough: {
    textDecorationLine: 'line-through'
  },
  underlinedStrikethrough: {
    textDecorationLine: 'underline line-through'
  },
  decorationSolid: {
    textDecorationStyle: 'solid'
  },
  decorationDashed: {
    textDecorationStyle: 'dashed'
  },
  decorationDotted: {
    textDecorationStyle: 'dotted'
  },
  decorationDouble: {
    textDecorationStyle: 'double'
  },
  decorationColored: {
    textDecorationColor: 'blue'
  },
  fontSize20: {
    fontSize: 20
  },
  fontSize30: {
    fontSize: 30
  },
  fontItalic: {
    fontStyle: 'italic'
  },
  fontBold: {
    fontWeight: 'bold'
  },
  lineHeight10: {
    lineHeight: 10
  },
  lineHeight30: {
    lineHeight: 30
  },
  backgroundColor: {
    backgroundColor: 'yellow'
  }
})
