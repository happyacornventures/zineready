import { defaultConfig } from '@tamagui/config/v4'
import { TamaguiProvider, createTamagui } from '@tamagui/core'

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig)

type Conf = typeof config

// make imports typed
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

import { Button } from 'tamagui'

export function Demo() {
  return <Button theme="blue">Hello world</Button>
}

export default () => {
  return (
    <TamaguiProvider config={config}>{/* your app here */}
      <Demo />
    </TamaguiProvider>
  )
}
