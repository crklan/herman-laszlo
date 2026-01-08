import {Trans} from '@lingui/react/macro'
import type {SEOHandle} from '@nasa-gcn/remix-seo'
import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {Link, useLoaderData, useNavigate} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'
import {useQuery} from '@sanity/react-loader'
import groq from 'groq'
import {ArrowLeft, Calendar, MapPin} from 'lucide-react'
import {serverOnly$} from 'vite-env-only/macros'

import {Button} from '~/components/ui/button'
import {linguiServer} from '~/modules/lingui/lingui.server'
import {viewClient} from '~/sanity/client.server'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {dataset, projectId} from '~/sanity/projectDetails'
import {EXHIBITION_QUERY} from '~/sanity/queries'
import type {Exhibition} from '~/types/exhibition'

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  if (!data?.initial?.data) {
    return [{title: 'Exhibition Not Found | László Herman'}]
  }

  const exhibition = data.initial.data
  const builder = imageUrlBuilder({projectId, dataset})
  const imageUrl = exhibition.coverImage
    ? builder
        .image(exhibition.coverImage)
        .width(1200)
        .height(630)
        .quality(80)
        .url()
    : null

  const title = `${exhibition.title} | László Herman`
  const description =
    exhibition.description || `Exhibition at ${exhibition.location}`
  const canonicalUrl = `https://laszloherman.com${location.pathname}`

  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:url', content: canonicalUrl},
    ...(imageUrl ? [{property: 'og:image', content: imageUrl}] : []),
    {rel: 'canonical', href: canonicalUrl},
  ]
}

export const handle: SEOHandle = {
  getSitemapEntries: serverOnly$(async () => {
    const exhibitions = await viewClient.fetch(
      groq`*[_type == "exhibition"] {_id, _updatedAt}`,
    )
    return exhibitions.map((ex: any) => ({
      route: `/exhibition/${ex._id}`,
      priority: 0.7,
      lastmod: ex._updatedAt,
    }))
  }),
}

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const {options} = await loadQueryOptions(request.headers)
  const locale = await linguiServer.getLocale(request)

  const initial = await loadQuery<Exhibition>(
    EXHIBITION_QUERY,
    {id: params.id, locale},
    options,
  ).then((res) => ({...res, data: res.data || null}))

  if (!initial.data) {
    throw new Response('Not found', {status: 404})
  }

  return {initial, query: EXHIBITION_QUERY, params: {id: params.id, locale}}
}

export default function ExhibitionDetailPage() {
  const {initial, query, params} = useLoaderData<typeof loader>()
  const {data: exhibition} = useQuery<typeof initial.data>(query, params, {
    // @ts-expect-error
    initial,
  })
  const navigate = useNavigate()
  const builder = imageUrlBuilder({projectId, dataset})

  if (!exhibition) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <>
      <Button
        className="lg:ps-24 xl:ps-44 mt-12"
        variant="link"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft strokeWidth={1} />
        <Trans>Back</Trans>
      </Button>

      <div className="flex flex-col items-center px-12 py-4 lg:px-24 xl:px-44 lg:py-2">
        <div className="w-full max-w-5xl">
          <h1 className="font-display text-5xl mb-4">{exhibition.title}</h1>

          <div className="flex flex-col gap-2 text-lg text-muted-foreground mb-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>{exhibition.location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              <span>
                {formatDate(exhibition.startDate)} -{' '}
                {formatDate(exhibition.endDate)}
              </span>
            </div>
          </div>

          {exhibition.description && (
            <p className="font-body text-left mt-6 mb-8 text-lg leading-relaxed">
              {exhibition.description}
            </p>
          )}

          {exhibition.relatedSeries && exhibition.relatedSeries.length > 0 && (
            <div className="mb-8">
              <h3 className="font-display text-2xl mb-4">
                <Trans>Featured Series</Trans>
              </h3>
              <div className="flex flex-wrap gap-3">
                {exhibition.relatedSeries.map((series) => (
                  <Link
                    key={series._id}
                    to={`/series/${series._id}`}
                    className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
                  >
                    {series.name}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {exhibition.exhibitionPhotos &&
          exhibition.exhibitionPhotos.length > 0 && (
            <div className="w-full max-w-6xl mt-12">
              <h2 className="font-display text-3xl mb-6">
                <Trans>Exhibition Gallery</Trans>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exhibition.exhibitionPhotos.map((photo: any, index: number) => (
                  <div key={index} className="flex flex-col">
                    <img
                      src={builder
                        .image(photo.asset)
                        .width(600)
                        .height(600)
                        .quality(85)
                        .url()}
                      alt={photo.alt || `Exhibition photo ${index + 1}`}
                      className="w-full h-auto rounded-lg"
                    />
                    {photo.caption && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        {exhibition.videoUrl && (
          <div className="w-full max-w-4xl mt-12">
            <h2 className="font-display text-3xl mb-6">
              <Trans>Exhibition Video</Trans>
            </h2>
            <div className="aspect-video w-full">
              <iframe
                src={exhibition.videoUrl}
                className="w-full h-full rounded-lg"
                allowFullScreen
                title="Exhibition Video"
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}
