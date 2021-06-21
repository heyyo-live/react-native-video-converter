import AVFoundation
import MediaPlayer
import MobileCoreServices
import AssetsLibrary

@objc(VideoConverter)
class VideoConverter: RCTEventEmitter {

    @objc(convert:withOutputURL:resolver:rejecter:)
    func convert(filePath: String, outputPath: String, resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) -> Void {
        let docDir = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).map(\.path)[0]

        let ouputURL = URL(fileURLWithPath: URL(fileURLWithPath: docDir).appendingPathComponent(outputPath).path)
        let newFile = ouputURL.absoluteString
        let urlFile = URL(fileURLWithPath: filePath)
        let avAsset = AVURLAsset(url: urlFile, options: nil)

        let exportSession = AVAssetExportSession(asset: avAsset, presetName: AVAssetExportPresetHighestQuality)
        //AVAssetExportPresetMediumQuality
        let domain = "videoConverter"
        
        exportSession?.outputURL = ouputURL
        exportSession?.outputFileType = AVFileType.mp4
        exportSession?.shouldOptimizeForNetworkUse = true
        
        exportSession?.exportAsynchronously {
            if(exportSession?.status == .failed) {
                let error = exportSession?.error
                reject("", error.debugDescription, error)
            } else if(exportSession?.status == .cancelled) {
                let error = NSError(domain: domain, code: -91, userInfo: nil)
                reject("Cancelled", "Export canceled", error)
            } else if(exportSession?.status == .completed) {
                resolve(newFile)
            } else {
                let error = NSError(domain: domain, code: -91, userInfo: nil)
                reject("Unknown", "Unknown status", error);
            }
        }
    }
    
    override func supportedEvents() -> [String]! {
        return ["onVideoCodecProgress"]
    }
    
    override class func requiresMainQueueSetup() -> Bool {
        return false
    }
}
