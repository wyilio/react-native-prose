import React from 'react'
import {
  View,
  ViewStyle,
  TextProps,
  UIManager,
  requireNativeComponent,
  Platform,
  Text as RNText,
  StyleSheet
} from 'react-native'
import {UITextView} from './UITextView'
import {AndroidTextView} from './AndroidTextView'

const LINKING_ERROR = `The view 'RNProseView' from 'react-native-prose' doesn't seem to be linked.`

export interface ProseProps extends TextProps {
  paragraphSpacing?: number
}

export interface RNProseViewProps extends TextProps {
  children: React.ReactNode
  style: ViewStyle[]
}

const RNProseView =
  UIManager.getViewManagerConfig?.('RNProseView') != null
    ? requireNativeComponent<RNProseViewProps>('RNProseView')
    : () => {
        if (Platform.OS !== 'ios') return null
        throw new Error(LINKING_ERROR)
      }

const ProseContext = React.createContext<boolean>(false)

export const useProseContext = () => React.useContext(ProseContext)

export function Prose({style, children, ...rest}: ProseProps) {
  const flattenedStyle = React.useMemo(
    () => StyleSheet.flatten([style]),
    [style]
  )

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <ProseContext.Provider value={true}>
        <RNProseView {...rest} style={[flattenedStyle]}>
          {children}
        </RNProseView>
      </ProseContext.Provider>
    )
  } else {
    return <View />
  }
}
export function ProseText(props: TextProps) {
  if (Platform.OS === 'ios') {
    return <UITextView selectable uiTextView {...props} />
  } else if (Platform.OS === 'android') {
    return <AndroidTextView {...props} />
  }
  return <RNText {...props} />
}
