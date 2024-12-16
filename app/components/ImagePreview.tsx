import {Link} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'

import {dataset, projectId} from '~/sanity/projectDetails'
import type {Painting} from '~/types/painting'

export const ImagePreview = ({
  data,
  isPreview = false,
}: {
  data: Painting
  isPreview: boolean
}) => {
  const builder = imageUrlBuilder({projectId, dataset})
  if (!data) return <div></div>
  if (isPreview) {
    return (
      <img
        alt="Preview"
        className="object-contain max-h-[800px]  rounded-lg"
        src={builder
          .image(data.image)
          .quality(100)
          .auto('format')
          .fit('fillmax')
          .url()}
      />
    )
  }

  return (
    <Link
      className="flex justify-center object-contain"
      to={`/painting/${data._id}`}
    >
      <img
        alt="Preview"
        className="not-prose max-h-[500px] rounded-lg"
        src={builder.image(data.image).quality(40).fit('max').url()}
      />
    </Link>
  )
}
