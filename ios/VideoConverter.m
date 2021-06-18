#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(VideoConverter, RCTEventEmitter)

RCT_EXTERN_METHOD(convert: (NSString*)filename
                  withOutputURL: (NSString*)outputPath
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
@end
