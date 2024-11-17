import type {LoaderFunctionArgs} from '@remix-run/node'
import {json, Outlet, useLoaderData, useOutletContext} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'
import {VisualEditing} from '@sanity/visual-editing/remix'
import {lazy, Suspense} from 'react'

import {Footer} from '~/components/Footer'
import {Header} from '~/components/Header'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {HOME_QUERY} from '~/sanity/queries'
import type {HomeDocument} from '~/types/home'
import {homeZ} from '~/types/home'
import type {ThemePreference} from '~/types/themePreference'

const SanityLiveMode = lazy(() =>
  import('~/components/SanityLiveMode').then((module) => ({
    default: module.SanityLiveMode,
  })),
)
const ExitPreview = lazy(() =>
  import('~/components/ExitPreview').then((module) => ({
    default: module.ExitPreview,
  })),
)

export const loader = async ({request}: LoaderFunctionArgs) => {
  const {preview, options} = await loadQueryOptions(request.headers)

  // Content from Sanity used in the global layout
  const query = HOME_QUERY
  const params = {}
  const initial = await loadQuery<HomeDocument>(query, params, options).then(
    (res) => ({
      ...res,
      data: res.data ? homeZ.parse(res.data) : undefined,
    }),
  )
  const maintenanceMode = process.env.MAINTENANCE_MODE === 'true'

  return json({
    initial,
    query,
    params,
    sanity: {preview},
    maintenanceMode,
  })
}

export default function Website() {
  const {initial, query, params, sanity, maintenanceMode} =
    useLoaderData<typeof loader>()
  const {data: home} = useQuery<typeof initial.data>(query, params, {
    // There's a TS issue with how initial comes over the wire
    // @ts-expect-error
    initial,
  })
  const {theme} = useOutletContext<{theme: ThemePreference}>()

  if (maintenanceMode) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold">László Herman</h1>
          <p className="text-lg mt-4">Website is currently in development 🚧</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Header home={home} theme={theme} />

      <div className="mx-auto grid grid-cols-1 gap-4 lg:gap-12">
        <Outlet />
      </div>
      <Footer />
      {sanity.preview ? (
        <Suspense>
          <SanityLiveMode />
          <ExitPreview />
          <VisualEditing />
        </Suspense>
      ) : null}
    </>
  )
}
