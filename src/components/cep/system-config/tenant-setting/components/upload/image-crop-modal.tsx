/* eslint-disable simple-import-sort/imports */
import { Button, Modal, Slider } from 'antd'
import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import type { Area, Point } from 'react-easy-crop'

interface ImageCropModalProps {
  visible: boolean
  imageUrl: string
  fileType: string
  isUploading: boolean
  aspect: number
  onCancel: () => void
  onConfirm: (croppedImage: Blob) => void
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.src = url
  })

const getCroppedImg = async (
  imageSrc: string,
  pixelCrop: Area,
  fileType: string = 'image/jpeg',
  aspect: number = 1,
): Promise<Blob> => {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    throw new Error('No 2d context')
  }

  // Set canvas size based on aspect ratio
  let canvasWidth: number
  let canvasHeight: number

  if (aspect >= 1) {
    // Landscape or square (aspect >= 1)
    canvasWidth = Math.max(pixelCrop.width, pixelCrop.height * aspect)
    canvasHeight = canvasWidth / aspect
  } else {
    // Portrait (aspect < 1)
    canvasHeight = Math.max(pixelCrop.height, pixelCrop.width / aspect)
    canvasWidth = canvasHeight * aspect
  }

  canvas.width = canvasWidth
  canvas.height = canvasHeight

  // Fill background based on file type
  if (fileType === 'image/png') {
    // PNG: transparent background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  } else {
    // JPEG: white background
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  // Calculate offset to center the cropped content
  const offsetX = (canvasWidth - pixelCrop.width) / 2
  const offsetY = (canvasHeight - pixelCrop.height) / 2

  // Draw the cropped portion centered on canvas
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(
    image,
    pixelCrop.x, // Source x
    pixelCrop.y, // Source y
    pixelCrop.width, // Source width
    pixelCrop.height, // Source height
    offsetX, // Destination x (centered)
    offsetY, // Destination y (centered)
    pixelCrop.width, // Destination width
    pixelCrop.height, // Destination height
  )

  // Convert to blob with appropriate format
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Canvas to Blob failed'))
        }
      },
      fileType,
      fileType === 'image/jpeg' ? 0.9 : 1,
    )
  })
}

function ImageCropModal({
  visible,
  imageUrl,
  fileType,
  isUploading,
  aspect,
  onCancel,
  onConfirm,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)

  const onCropComplete = useCallback(
    (croppedArea: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels)
    },
    [],
  )

  const handleConfirm = async () => {
    if (!croppedAreaPixels || isUploading) return

    try {
      const croppedImage = await getCroppedImg(
        imageUrl,
        croppedAreaPixels,
        fileType,
        aspect,
      )
      onConfirm(croppedImage)
    } catch (error) {
      console.error('Error cropping image:', error)
    }
  }

  return (
    <Modal
      open={visible}
      title="画像をトリミング"
      onCancel={isUploading ? undefined : onCancel}
      width={600}
      closable={!isUploading}
      maskClosable={!isUploading}
      footer={[
        <Button key="cancel" onClick={onCancel} disabled={isUploading}>
          キャンセル
        </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={handleConfirm}
          loading={isUploading}
          disabled={!croppedAreaPixels}
        >
          確定
        </Button>,
      ]}
      styles={{
        body: {
          height: 500,
        },
      }}
    >
      <div className="relative h-[400px] w-full bg-gray-100">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={aspect}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          cropShape="rect"
          showGrid={true}
          restrictPosition={false}
          style={{
            containerStyle: {
              backgroundColor: '#f5f5f5',
            },
          }}
        />
      </div>
      <div className="mt-6 px-4">
        <div className="mb-2 text-sm font-medium">ズーム</div>
        <Slider
          min={0.1}
          max={3}
          step={0.1}
          value={zoom}
          onChange={(value) => setZoom(value)}
          disabled={isUploading}
          marks={{
            0.1: '0.1x',
            0.5: '0.5x',
            1: '1x',
            2: '2x',
            3: '3x',
          }}
        />
      </div>
    </Modal>
  )
}

export default ImageCropModal
