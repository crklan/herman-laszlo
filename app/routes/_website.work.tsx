import {Trans} from '@lingui/react/macro'
import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'

import {SeriesPreview} from '~/components/SeriesPreview'
import {TechniquePreview} from '~/components/TechniquePreview'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '~/components/ui/tabs'
import {linguiServer} from '~/modules/lingui/lingui.server'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {SERIES_QUERY, TECHNIQUES_QUERY} from '~/sanity/queries'
import type {Serie} from '~/types/series'
import type {Technique} from '~/types/technique'

export const meta: MetaFunction = ({location}) => {
  const title = 'Works | László Herman'
  const description =
    "Browse László Herman's artwork collection. Choose to explore by series to see thematic collections, or by technique to discover different artistic methods and mediums."
  const canonicalUrl = `https://laszloherman.com${location.pathname}`

  return [
    {title},
    {name: 'description', content: description},

    // Open Graph
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: canonicalUrl},
    {property: 'og:site_name', content: 'László Herman'},

    // Twitter Card
    {name: 'twitter:card', content: 'summary'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},

    // Additional SEO
    {name: 'author', content: 'László Herman'},
    {
      name: 'keywords',
      content:
        'László Herman, artwork, paintings, series, techniques, contemporary art, portfolio, gallery',
    },
    {name: 'robots', content: 'index, follow'},
    {rel: 'canonical', href: canonicalUrl},
  ]
}

export const loader = async ({request}: LoaderFunctionArgs) => {
  const {options} = await loadQueryOptions(request.headers)
  const locale = await linguiServer.getLocale(request)

  const seriesQuery = SERIES_QUERY
  const params = {
    locale: locale,
  }
  const seriesResponse = await loadQuery<Serie[]>(
    seriesQuery,
    params,
    options,
  ).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))
  const techniquesQuery = TECHNIQUES_QUERY
  const techniqueResponse = await loadQuery<Technique[]>(
    techniquesQuery,
    params,
    options,
  ).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  if (!seriesResponse.data) {
    throw new Response('Not found', {status: 404})
  }

  return {
    series: {initial: seriesResponse, query: seriesQuery, params},
    techniques: {initial: techniqueResponse, query: techniquesQuery, params},
  }
}

export default function Index() {
  const {series, techniques} = useLoaderData<typeof loader>()
  const {data: seriesData} = useQuery<typeof series.initial.data>(
    series.query,
    series.params,
    {
      // There's a TS issue with how initial comes over the wire
      // @ts-expect-error
      initial: series.initial,
    },
  )

  const {data: techniquesData} = useQuery<typeof techniques.initial.data>(
    techniques.query,
    techniques.params,
    {
      // There's a TS issue with how initial comes over the wire
      // @ts-expect-error
      initial: techniques.initial,
    },
  )

  return (
    <div>
      <div className="w-full px-12 py-16 xl:px-44 xl:py-20">
        <h1 className="font-display text-5xl lg:text-7xl mb-12">
          <Trans>Works</Trans>
        </h1>
        <Tabs defaultValue="series" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="series">
              <Trans>Series</Trans>
            </TabsTrigger>
            <TabsTrigger value="techniques">
              <Trans>Techniques</Trans>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="series">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-10 lg:gap-6">
              {seriesData?.map((serie) => (
                <SeriesPreview key={serie.slug} data={serie} />
              ))}
            </div>
          </TabsContent>
          <TabsContent value="techniques">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
              {techniquesData?.map((technique) => (
                <TechniquePreview key={technique.slug} data={technique} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
