import {Trans} from '@lingui/react/macro'
import type {SEOHandle} from '@nasa-gcn/remix-seo'
import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {useLoaderData} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'
import {serverOnly$} from 'vite-env-only/macros'

import {ExhibitionListItem} from '~/components/ExhibitionListItem'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '~/components/ui/tabs'
import {linguiServer} from '~/modules/lingui/lingui.server'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {EXHIBITIONS_QUERY} from '~/sanity/queries'
import type {Exhibition} from '~/types/exhibition'

export const meta: MetaFunction = ({location}) => {
  const title = 'Exhibitions | László Herman'
  const description =
    "Browse László Herman's exhibition history. View current and past exhibitions."
  const canonicalUrl = `https://laszloherman.com${location.pathname}`

  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: canonicalUrl},
    {name: 'robots', content: 'index, follow'},
    {rel: 'canonical', href: canonicalUrl},
  ]
}

export const handle: SEOHandle = {
  getSitemapEntries: serverOnly$(async () => [
    {route: '/exhibitions', priority: 0.9},
  ]),
}

export const loader = async ({request}: LoaderFunctionArgs) => {
  const {options} = await loadQueryOptions(request.headers)
  const locale = await linguiServer.getLocale(request)

  const initial = await loadQuery<Exhibition[]>(
    EXHIBITIONS_QUERY,
    {locale},
    options,
  ).then((res) => ({...res, data: res.data || []}))

  return {initial, query: EXHIBITIONS_QUERY, params: {locale}}
}

export default function ExhibitionsPage() {
  const {initial, query, params} = useLoaderData<typeof loader>()
  const {data: exhibitions} = useQuery<typeof initial.data>(query, params, {
    // @ts-expect-error
    initial,
  })

  const today = new Date()
  const currentExhibitions = exhibitions?.filter(
    (ex) => new Date(ex.endDate) >= today,
  )
  const pastExhibitions = exhibitions?.filter(
    (ex) => new Date(ex.endDate) < today,
  )

  return (
    <div className="w-full px-12 py-16 xl:px-44 xl:py-20">
      <h1 className="font-display text-5xl lg:text-7xl mb-12">
        <Trans>Exhibitions</Trans>
      </h1>

      {(!exhibitions || exhibitions.length === 0) && (
        <p className="text-center text-muted-foreground py-12">
          <Trans>No exhibitions found.</Trans>
        </p>
      )}

      {exhibitions && exhibitions.length > 0 && (
        <Tabs defaultValue="current" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="current">
              <Trans>Current</Trans>
            </TabsTrigger>
            <TabsTrigger value="past">
              <Trans>Past</Trans>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            {currentExhibitions && currentExhibitions.length > 0 ? (
              <div className="space-y-6">
                {currentExhibitions.map((exhibition) => (
                  <ExhibitionListItem
                    key={exhibition._id}
                    exhibition={exhibition}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                <Trans>No current exhibitions.</Trans>
              </p>
            )}
          </TabsContent>
          <TabsContent value="past">
            {pastExhibitions && pastExhibitions.length > 0 ? (
              <div className="space-y-6">
                {pastExhibitions.map((exhibition) => (
                  <ExhibitionListItem
                    key={exhibition._id}
                    exhibition={exhibition}
                  />
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-12">
                <Trans>No past exhibitions.</Trans>
              </p>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}
