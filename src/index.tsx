import { NativeModules } from 'react-native';

type VideoConverterType = {
  multiply(a: number, b: number): Promise<number>;
};

const { VideoConverter } = NativeModules;

export default VideoConverter as VideoConverterType;
