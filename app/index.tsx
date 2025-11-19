import { Inter_300Light, Inter_400Regular, Inter_900Black, useFonts } from '@expo-google-fonts/inter';
import { Rubik_400Regular, Rubik_500Medium, Rubik_900Black } from '@expo-google-fonts/rubik';
import { AntDesign } from '@expo/vector-icons';
import { defaultConfig } from '@tamagui/config/v4';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { Platform } from 'react-native';
import { Button, H1, H2, ScrollView, TamaguiProvider, Text, YStack, createTamagui } from 'tamagui';

const config = createTamagui(defaultConfig)

type Conf = typeof config

// make imports typed
declare module '@tamagui/core' {
  interface TamaguiCustomConfig extends Conf {}
}

export function HeroBanner() {
  const [loaded, error] = useFonts({
    Inter_900Black,
    Inter_400Regular,
    Inter_300Light,
    Rubik_900Black,
    Rubik_400Regular,
    Rubik_500Medium,
  });

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

  if (!loaded) return null;

  return (
    <ScrollView>
      <YStack
        flex={1}
        align="center"
        padding="$4"
        space="$3"
        backgroundColor="#F3E6C9"
        minHeight="100vh"
      >
        <YStack maxWidth="600px" justify="center" alignItems="center" margin="auto">
          <H1 color="#3A3A3A" style={{ fontFamily: 'Rubik_500Medium' }}>Zine Ready</H1>
          <H2 width="100%" textAlign="left" color="#3A3A3A" style={{ fontFamily: 'Inter_300Light' }} size="$6">
            Page Sorting and Rotation for Print Ready Zines. No more large white margins on pages!
          </H2>
          <YStack
            borderWidth={2}
            borderStyle="dashed"
            borderColor="#C4B8A3"
            borderRadius="$4"
            padding="$6"
            alignItems="center"
            marginTop="$4"
            justifyContent="center"
            width="100%"
            height="50vh"
            onPress={handlePickDocument}
          >
            <AntDesign name="star" size={36} color="#3A78F2" style={{ position: 'absolute', top: -14, right: -14, transform: [{ rotate: '45deg' }] }} />
            <Text color="#3A3A3A" style={{ fontFamily: 'Inter_300Light' }}>Click to upload your zine</Text>
          </YStack>
          <Button width="100%" marginTop="$4" onPress={handleDownloadDocument} backgroundColor={"#3A78F2"} color="white" hoverStyle={{ backgroundColor: '#2A68D2'}} pressStyle={{ backgroundColor: '#1A54B2' }} style={{ fontFamily: 'Inter_300Light' }}>Download</Button>
        </YStack>
      </YStack>
    </ScrollView>
  )
}

export default () => {
  return (
    <TamaguiProvider config={config}>
      <HeroBanner />
    </TamaguiProvider>
  )
}
