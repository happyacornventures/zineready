import { defaultConfig } from '@tamagui/config/v4';
import { TamaguiProvider, createTamagui } from '@tamagui/core';
import * as DocumentPicker from 'expo-document-picker';
import { H1, Paragraph, Text, YStack } from 'tamagui';

// you usually export this from a tamagui.config.ts file
const config = createTamagui(defaultConfig)

type Conf = typeof config

// make imports typed
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export function HeroBanner() {
  const handlePickDocument = async () => {
    const pickerResult = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' }).then(console.log);
  };

  return (
    <YStack
      flex={1}
      align="center"
      padding="$4"
      space="$3"
      backgroundColor="$background"
    >
      <H1 color="$color">
        Zine Ready
      </H1>
      <Paragraph size="$5" color="$color10">
        This is a hero banner built with Tamagui. Start building your amazing application.
      </Paragraph>
      <YStack
        borderWidth={2}
        borderStyle="dashed"
        borderColor="$borderColor"
        borderRadius="$4"
        padding="$6"
        alignItems="center"
        marginTop="$4"
        onPress={handlePickDocument}
      >
        <Text>Drop PDF here or click to upload</Text>
      </YStack>
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
