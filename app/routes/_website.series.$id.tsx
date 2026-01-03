import {Trans} from '@lingui/react/macro'
import type {SEOHandle} from '@nasa-gcn/remix-seo'
import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {Link, useLoaderData, useNavigate} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'
import {useQuery} from '@sanity/react-loader'
import groq from 'groq'
import {ArrowLeft, Tv} from 'lucide-react'
import {serverOnly$} from 'vite-env-only/macros'

import {Mansory} from '~/components/Mansory'
import {Button} from '~/components/ui/button'
import {linguiServer} from '~/modules/lingui/lingui.server'
import {viewClient} from '~/sanity/client.server'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {dataset, projectId} from '~/sanity/projectDetails'
import {SERIE_QUERY} from '~/sanity/queries'
import type {Serie} from '~/types/series'

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  if (!data?.initial?.data) {
    return [
      {title: 'Series Not Found | László Herman'},
      {
        name: 'description',
        content: 'The requested series could not be found.',
      },
    ]
  }

  const series = data.initial.data
  const builder = imageUrlBuilder({projectId, dataset})

  // Use cover image for social sharing
  const imageUrl = series.cover?.image
    ? builder
        .image(series.cover.image)
        .width(1200)
        .height(630)
        .quality(80)
        .url()
    : null

  const title = `${series.name} Series | László Herman`
  const description = `Explore the ${series.name} series by László Herman. View all paintings and artworks in this thematic collection.`

  const canonicalUrl = `https://laszloherman.com${location.pathname}`

  return [
    {title},
    {name: 'description', content: description},

    // Open Graph
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: canonicalUrl},
    ...(imageUrl ? [{property: 'og:image', content: imageUrl}] : []),
    {property: 'og:site_name', content: 'László Herman'},

    // Twitter Card
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    ...(imageUrl ? [{name: 'twitter:image', content: imageUrl}] : []),

    // Additional SEO
    {name: 'author', content: 'László Herman'},
    {
      name: 'keywords',
      content: `László Herman, ${series.name}, series, paintings, contemporary art, artwork collection`,
    },
    {name: 'robots', content: 'index, follow'},
    {rel: 'canonical', href: canonicalUrl},

    // Breadcrumb structured data
    {name: 'breadcrumb', content: 'Home > Works > Series > ' + series.name},
  ]
}

export const handle: SEOHandle = {
  getSitemapEntries: serverOnly$(async (request) => {
    try {
      const series = await viewClient.fetch(
        groq`*[_type == "series"] {
          _id,
          _updatedAt,
          "name": name[_key == "en"][0].value,
        }`,
        {},
        {
          signal: AbortSignal.timeout(30000),
        },
      )

      return series.map((serie: any) => ({
        route: `/series/${serie._id}`,
        priority: 0.8, // Higher priority - category pages are important
        lastmod: serie._updatedAt,
      }))
    } catch (error) {
      console.error('Sitemap generation failed for series:', error)
      return []
    }
  }),
}

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const {options} = await loadQueryOptions(request.headers)
  const locale = await linguiServer.getLocale(request)
  const query = SERIE_QUERY

  const initial = await loadQuery<Serie>(
    query,
    {id: params.id, locale: locale},
    options,
  ).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  if (!initial.data) {
    throw new Response('Not found', {status: 404})
  }

  return {
    initial,
    query,
    params,
  }
}

export default function Index() {
  const {initial, query, params} = useLoaderData<typeof loader>()
  const {data} = useQuery<typeof initial.data>(query, params, {
    // There's a TS issue with how initial comes over the wire
    // @ts-expect-error
    initial,
  })
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  return (
    <>
      <Button
        className="lg:ps-24 xl:ps-44 mt-12"
        variant="link"
        onClick={goBack}
      >
        <ArrowLeft strokeWidth={1} />
        <Trans>Back</Trans>
      </Button>
      <div className="flex flex-col items-center text-center px-12 py-4 lg:px-24 xl:px-44 lg:py-2">
        <h1 className="font-display text-5xl ">{data?.name}</h1>
        {data?.description && (
          <p className="font-body text-left mt-6 lg:mt-12 max-w-5xl">
            {data?.description}
          </p>
        )}
        <div className="w-full">
          <Mansory
            initialPaintings={data?.paintings || []}
            totalCount={data?.totalCount || 0}
            apiEndpoint={`/resource/series-paintings/${params.id}`}
          />
        </div>
      </div>
    </>
  )
}
