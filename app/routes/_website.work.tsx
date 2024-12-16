import {Trans} from '@lingui/react/macro'
import type {LoaderFunctionArgs} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'

import {SeriesPreview} from '~/components/SeriesPreview'
import {TechniquePreview} from '~/components/TechniquePreview'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '~/components/ui/tabs'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {SERIES_QUERY, TECHNIQUES_QUERY} from '~/sanity/queries'
import type {Serie} from '~/types/series'
import type {Technique} from '~/types/technique'

/* export const meta: MetaFunction<
  typeof loader,
  {
    'routes/_website': typeof layoutLoader
  }
> = ({matches}) => {
  const layoutData = matches.find(
    (match) => match.id === `routes/_website`,
  )?.data
  const home = layoutData ? layoutData.initial.data : null
  const title = [home?.title, home?.siteTitle].filter(Boolean).join(' | ')

  return [{title}]
} */

export const loader = async ({request}: LoaderFunctionArgs) => {
  const {options} = await loadQueryOptions(request.headers)
  const seriesQuery = SERIES_QUERY
  const params = {}
  const seriesInital = await loadQuery<Serie[]>(
    seriesQuery,
    params,
    options,
  ).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))
  const techniquesQuery = TECHNIQUES_QUERY
  const techniquesInital = await loadQuery<Technique[]>(
    techniquesQuery,
    params,
    options,
  ).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

  if (!seriesInital.data) {
    throw new Response('Not found', {status: 404})
  }

  return {
    series: {initial: seriesInital, query: seriesQuery, params},
    techniques: {initial: techniquesInital, query: techniquesQuery, params},
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
