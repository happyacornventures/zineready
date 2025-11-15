import { defaultConfig } from '@tamagui/config/v4';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { Platform } from 'react-native';
import { Button, H1, H2, TamaguiProvider, Text, View, XStack, YStack, createTamagui } from 'tamagui';

const config = createTamagui(defaultConfig)

type Conf = typeof config

// make imports typed
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export function HeroBanner() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileId, setFileId] = useState<string | null>(null);

  const handlePickDocument = async () => {
    const pickerResult = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });

    if (pickerResult.canceled || !pickerResult.assets?.[0]) {
      return;
    }

    const asset = pickerResult.assets[0];
    const formData = new FormData();

    if (Platform.OS === 'web') {
      // On web, the asset contains a file object
      if (asset.file) {
        formData.append('file', asset.file);
      }
    } else {
      // On native, create the file object
      formData.append('file', {
        uri: asset.uri,
        name: asset.name,
        type: asset.mimeType,
      } as any);
    }

    try {
      const response = await fetch('http://localhost:3000/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed with status: ' + response.status);
      }

      const responseObject = await response.json();

      setFileName(asset.name);
      setFileId(responseObject.id);
    } catch (error) {
      console.error('Upload failed', error);
    }
  };

  const handleDownloadDocument = async () => {
    if (!fileId) return;

    try {
      const response = await fetch(`http://localhost:3000/documents/${fileId}`, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error('Download failed with status: ' + response.status);
      }

      const blob = await response.blob();
      const fileUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = fileName || 'download.pdf';
      link.click();
    } catch (error) {
      console.error('Download failed', error);
    }
  };

  return (
    <YStack
      flex={1}
      align="center"
      padding="$4"
      space="$3"
      backgroundColor="$background"
    >
      <H1>Zine Ready</H1>
      <XStack width="100%" justify="center" alignItems="center">
        <H2 width="40%" textAlign="left">
          Page Sorting and Rotation for Print Ready Zines. No more large white margins on pages!
        </H2>
        <YStack
          borderWidth={2}
          borderStyle="dashed"
          borderColor="$borderColor"
          borderRadius="$4"
          padding="$6"
          alignItems="center"
          marginTop="$4"
          justifyContent="center"
          width="40%"
          height="50vh"
          onPress={handlePickDocument}
        >
          <Text>Drop PDF here or click to upload</Text>
        </YStack>
      </XStack>
      <YStack>
        <XStack justify="space-between">
          {fileName && (<Text>{fileName}</Text>)}
          {fileId && (<Button onPress={handleDownloadDocument}>Download</Button>)}
        </XStack>
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
