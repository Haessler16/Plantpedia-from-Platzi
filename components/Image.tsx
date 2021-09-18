import { useCallback } from 'react'
import NextImage, {
  ImageLoaderProps,
  ImageProps as NextImageProps,
} from 'next/image'

export type ImageLayout = 'responsive' | 'intrinsic' | 'fixed' | undefined
export type ImageFit = 'pad' | 'fill' | 'crop' | 'scale' | 'thumb'
export type AspectRatio = '16:9' | '4:3' | '1:1' | '3:2' | '9:12'

export type ImageProps = {
  width: number
  src: string
  layout: ImageLayout
  height?: never
  aspectRatio: AspectRatio
  fit?: ImageFit
} & DistributiveOmit<NextImageProps, 'height'>

const aspectRatioToRatio = {
  '1:1': 1,
  '4:3': 3 / 4,
  '16:9': 9 / 16,
  '3:2': 2 / 3,
  '9:12': 12 / 9,
}

function calcAspectRatio(aspectRatio: AspectRatio, width: number): number {
  let ratio = aspectRatioToRatio[aspectRatio]

  return Math.floor(width * ratio)
}

export const Image = ({
  layout,
  src,
  width,
  aspectRatio,
  fit = 'fill',
}: ImageProps) => {
  const height = calcAspectRatio(aspectRatio, width)

  const loader = useCallback(
    (args: ImageLoaderProps): string => {
      const loderHeight = calcAspectRatio(aspectRatio, args.width)
      return `${args.src}?w=${width}&h=${loderHeight}&fit=${fit}`
    },
    [aspectRatio, fit]
  )

  return (
    <NextImage
      layout={layout}
      src={src}
      width={width}
      height={height}
      loader={loader}
    />
  )
}

// https://davidgomes.com/pick-omit-over-union-types-in-typescript/
type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never
