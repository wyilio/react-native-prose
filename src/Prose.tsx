import React from 'react'
import {
  View,
  ViewStyle,
  TextProps,
  UIManager,
  requireNativeComponent,
  Platform,
  StyleSheet
} from 'react-native'

const LINKING_ERROR = `The view 'RNProseView' from 'react-native-prose' doesn't seem to be linked.`

export interface ProseProps extends TextProps {
  paragraphSpacing?: number
}

export interface RNProseViewProps extends TextProps {
  children: React.ReactNode
  style: ViewStyle[]
}

export const RNProseView =
  UIManager.getViewManagerConfig?.('RNProseView') != null
    ? requireNativeComponent<RNProseViewProps>('RNProseView')
    : () => {
        if (Platform.OS !== 'ios') return null
        throw new Error(LINKING_ERROR)
      }

export function Prose({style, children, ...rest}: ProseProps) {
  const flattenedStyle = React.useMemo(
    () => StyleSheet.flatten([style]),
    [style]
  )

  if (Platform.OS === 'ios') {
    return (
      <RNProseView {...rest} style={[flattenedStyle]}>
        {children}
      </RNProseView>
    )
  } else {
    return <View />
  }
}
