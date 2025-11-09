import { defaultConfig } from '@tamagui/config/v4'
import { TamaguiProvider, createTamagui } from '@tamagui/core'
import { H1, Paragraph, YStack } from 'tamagui'

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig)

type Conf = typeof config

// make imports typed
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export function HeroBanner() {
  return (
    <YStack
      flex={1}
      align="center"
      padding="$4"
      space="$3"
      backgroundColor="$background"
    >
      <H1 color="$color">
        Welcome to Your App
      </H1>
      <Paragraph size="$5" color="$color10">
        This is a hero banner built with Tamagui. Start building your amazing application.
      </Paragraph>
    </YStack>
  )
}

export default () => {
  return (
    <TamaguiProvider config={config}>
      <HeroBanner />
    </TamaguiProvider>
  )
}
