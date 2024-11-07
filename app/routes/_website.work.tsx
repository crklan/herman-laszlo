import type {LoaderFunctionArgs} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'
import {ImagePreview} from '~/components/ImagePreview'
import {SeriesPreview} from '~/components/SeriesPreview'
import {TechniquePreview} from '~/components/TechniquePreview'

import {Tabs, TabsContent, TabsList, TabsTrigger} from '~/components/ui/tabs'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {SERIES_QUERY, TECHNIQUES_QUERY} from '~/sanity/queries'
import {Serie} from '~/types/series'
import {Technique} from '~/types/technique'

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

  console.log(seriesData, techniquesData)
  return (
    <div>
      <div className="bg-white w-full grid grid-cols-12 px-12 py-16 lg:px-44 lg:py-20">
        <Tabs defaultValue="series" className="w-[400px]">
          <TabsList className="mb-20">
            <TabsTrigger value="series">Series</TabsTrigger>
            <TabsTrigger value="techniques">Techniques</TabsTrigger>
          </TabsList>
          <TabsContent value="series">
            {seriesData?.map((serie) => (
              <SeriesPreview key={serie.slug} data={serie} />
            ))}
          </TabsContent>
          <TabsContent value="techniques">
            {techniquesData?.map((technique) => (
              <TechniquePreview key={technique.slug} data={technique} />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
