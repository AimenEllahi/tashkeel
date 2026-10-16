import Foundation
import Vision
import ImageIO
import CoreImage
import UniformTypeIdentifiers

guard CommandLine.arguments.count == 3 else {
  fputs("Usage: segment-foreground.swift input.png output.png\n", stderr)
  exit(2)
}

let inputURL = URL(fileURLWithPath: CommandLine.arguments[1])
let outputURL = URL(fileURLWithPath: CommandLine.arguments[2])
guard
  let source = CGImageSourceCreateWithURL(inputURL as CFURL, nil),
  let image = CGImageSourceCreateImageAtIndex(source, 0, nil)
else {
  fputs("Unable to read input image\n", stderr)
  exit(1)
}

do {
  let request = VNGenerateForegroundInstanceMaskRequest()
  let handler = VNImageRequestHandler(cgImage: image, options: [:])
  try handler.perform([request])
  guard let observation = request.results?.first, !observation.allInstances.isEmpty else {
    fputs("Vision found no foreground subject\n", stderr)
    exit(1)
  }

  let masked = try observation.generateMaskedImage(
    ofInstances: observation.allInstances,
    from: handler,
    croppedToInstancesExtent: false
  )
  let ciImage = CIImage(cvPixelBuffer: masked)
  let context = CIContext()
  guard
    let cutout = context.createCGImage(ciImage, from: ciImage.extent),
    let destination = CGImageDestinationCreateWithURL(outputURL as CFURL, UTType.png.identifier as CFString, 1, nil)
  else {
    fputs("Unable to create output image\n", stderr)
    exit(1)
  }
  CGImageDestinationAddImage(destination, cutout, nil)
  guard CGImageDestinationFinalize(destination) else {
    fputs("Unable to write PNG\n", stderr)
    exit(1)
  }
  print("Saved \(cutout.width)x\(cutout.height) foreground cutout to \(outputURL.path)")
} catch {
  fputs("Foreground segmentation failed: \(error)\n", stderr)
  exit(1)
}
