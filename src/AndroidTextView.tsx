import React from 'react'
import {
  Platform,
  requireNativeComponent,
  ViewStyle,
  TextProps,
  Text as RNText,
  StyleSheet
} from 'react-native'
import {useProseContext} from './Prose'

type ProseRawTextProps = TextProps & {
  text: string
}

const RNProseVirtualText =
  Platform.OS === 'android'
    ? requireNativeComponent<TextProps>('RNProseVirtualText')
    : () => {
        throw new Error('RNProseVirtualText not linked')
      }

const RNProseRawText =
  Platform.OS === 'android'
    ? requireNativeComponent<ProseRawTextProps>('RNProseRawText')
    : () => {
        throw new Error('RNProseRawText not linked')
      }

const TextAncestorContext = React.createContext<[boolean, ViewStyle]>([
  false,
  StyleSheet.create({})
])

const useTextAncestorContext = () => React.useContext(TextAncestorContext)

function ProseVirtualText({children, ...rest}: TextProps) {
  return <RNProseVirtualText {...rest}>{children}</RNProseVirtualText>
}

function ProseRawText({text, ...rest}: ProseRawTextProps) {
  return <RNProseRawText {...rest} text={text} />
}

function AndroidTextViewChild({style, children, ...rest}: TextProps) {
  const [isAncestor, rootStyle] = useTextAncestorContext()

  const flattenedStyle = React.useMemo(
    () => StyleSheet.flatten([rootStyle, style]),
    [rootStyle, style]
  )
  if (!isAncestor) {
    return (
      <TextAncestorContext.Provider value={[true, flattenedStyle]}>
        <ProseVirtualText style={flattenedStyle} {...rest}>
          {React.Children.toArray(children).map((c, index) => {
            if (React.isValidElement(c)) {
              return c
            } else if (typeof c === 'string' || typeof c === 'number') {
              return (
                <ProseRawText
                  key={index}
                  style={flattenedStyle}
                  text={c.toString()}
                  {...rest}
                />
              )
            }

            return null
          })}
        </ProseVirtualText>
      </TextAncestorContext.Provider>
    )
  } else {
    return (
      <ProseVirtualText style={flattenedStyle} {...rest}>
        {React.Children.toArray(children).map((c, index) => {
          if (React.isValidElement(c)) {
            return c
          } else if (typeof c === 'string' || typeof c === 'number') {
            return (
              <ProseRawText
                key={index}
                style={flattenedStyle}
                text={c.toString()}
                {...rest}
              />
            )
          }

          return null
        })}
      </ProseVirtualText>
    )
  }
}

export function AndroidTextView(props: TextProps) {
  const isProse = useProseContext()

  if (Platform.OS !== 'android' || !isProse) {
    return <RNText {...props} />
  }

  return <AndroidTextViewChild {...props} />
}
