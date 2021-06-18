import * as React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import VideoConverter from 'react-native-video-converter';
import { RNCamera } from "react-native-camera"

export default function App() {
  const [result, setResult] = React.useState<string | undefined>()
  const [percent, setPercent] = React.useState<number>(0)
  const [isRecording, setIsRecording] = React.useState(false)

  const camera = React.useRef<RNCamera>()

  return (
    <View style={styles.container}>
      <RNCamera 
        ref={camera}
        style={{
          top: 0, left: 0, right: 0, bottom: 0,
          position: "absolute"
        }}
      />

      <View>
        <Text>{percent}</Text>
        <Text>{result}</Text>
      </View>

      {!isRecording &&
      <TouchableOpacity
        onPress={async ()=>{
          setIsRecording(true)
          const result = await camera.current?.recordAsync({
            
          })
          if(result?.uri) {
            const convertedFilePath = await VideoConverter.convert(result?.uri, (p)=> setPercent(Math.ceil(p*100)/100));
            setResult(convertedFilePath)
          }
          setIsRecording(false)
        }}
        style={{
          padding: 10,
          backgroundColor: "red"
        }}
      >
        <Text>Record</Text>
      </TouchableOpacity>
      }

      {!!isRecording &&
      <TouchableOpacity
        onPress={async ()=>{
          camera.current?.stopRecording()
        }}
        style={{
          padding: 10,
          backgroundColor: "red"
        }}
      >
        <Text>Stop</Text>
      </TouchableOpacity>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
