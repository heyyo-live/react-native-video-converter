import { NativeModules, NativeEventEmitter } from 'react-native';

type VideoConverterType = {
  convert(filePath: string, outputFileName: string): Promise<string>;
};

const { VideoConverter } = NativeModules as {
  VideoConverter: VideoConverterType;
};
const eventEmitter = new NativeEventEmitter(NativeModules.VideoConverter);

async function convert(
  filePath: string,
  onProgress: (progress: number) => void
) {
  const newFileName = filePath
    .split('/')
    .slice(-1)[0]
    .replace('.mov', '.mp4')
    .replace('.mp4', '-cnvtd.mp4');

  eventEmitter.addListener('onVideoCodecProgress', onProgress);

  try {
    const convertedFilePath = await VideoConverter.convert(
      filePath,
      newFileName
    );
    eventEmitter.removeListener('onVideoCodecProgress', onProgress);
    return convertedFilePath;
  } catch (error) {
    eventEmitter.removeListener('onVideoCodecProgress', onProgress);
    throw error;
  }
}

export default {
  convert,
};
