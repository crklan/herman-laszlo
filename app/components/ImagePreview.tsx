import {Link} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'

import {dataset, projectId} from '~/sanity/projectDetails'
import {Painting} from '~/types/painting'

export const ImagePreview = ({data}: {data: Painting}) => {
  const builder = imageUrlBuilder({projectId, dataset})
  if (!data) return <div></div>
  return (
    <Link to={`/painting/${data._id}`}>
      <div className="group relative cursor-pointer flex justify-center hover:opacity-50 opacity-100 transition-opacity">
        <img
          alt="Preview"
          className="not-prose max-h-[500px] rounded-lg"
          src={builder.image(data.image).maxHeight(300).width(500).quality(80).fit("fillmax").url()}
        />
        <p className="absolute text-white top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-3xl font-bold opacity-0 group-hover:opacity-100 transition-all">
          {data.title}
        </p>
      </div>
    </Link>
  )
}
