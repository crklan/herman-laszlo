import {Link} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'

import {dataset, projectId} from '~/sanity/projectDetails'
import {Painting} from '~/types/painting'

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
        className="not-prose max-h-[800px] rounded-lg"
        src={builder
          .image(data.image)
          .maxHeight(300)
          .width(800)
          .quality(80)
          .fit('fillmax')
          .url()}
      />
    )
  }

  return (
    <Link className="flex justify-center" to={`/painting/${data._id}`}>
      <img
        alt="Preview"
        className="not-prose max-h-[500px] rounded-lg"
        src={builder
          .image(data.image)
          .maxHeight(300)
          .width(500)
          .quality(80)
          .fit('fillmax')
          .url()}
      />
    </Link>
  )
}
