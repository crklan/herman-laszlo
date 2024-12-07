import {Link} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'

import {dataset, projectId} from '~/sanity/projectDetails'
import {Serie} from '~/types/series'

//h-[400px] w-[400px]

export const SeriesPreview = ({data}: {data: Serie}) => {
  const builder = imageUrlBuilder({projectId, dataset})
  if (!data) return <div></div>
  return (
    <Link
      className="flex w-full items-center justify-start flex-col"
      to={`/series/${data._id}`}
    >
      {data.cover?.image ? (
        <img
          alt="Preview"
          className="not-prose h-auto w-full rounded-lg max-w-[400px]"
          src={builder
            .image(data?.cover?.image)
            .width(400)
            .height(400)
            .quality(80)
            .url()}
        />
      ) : (
        <div className="w-[400px] h-[400px] bg-muted rounded-lg flex"></div>
      )}
      <p className="pt-2 text-center text-xl group-hover:opacity-100 transition-all">
        {data?.name}
      </p>
    </Link>
  )
}
