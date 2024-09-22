import '@fontsource/poppins/300.css'
import '@fontsource/poppins/700.css'

import type {LinksFunction, LoaderFunctionArgs} from '@remix-run/node'
import {json} from '@remix-run/node'
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react'
import {useEffect} from 'react'
import {getToast} from 'remix-toast'
import {toast as notify} from 'sonner'

import {Toaster} from '~/components/ui/sonner'
import {themePreferenceCookie} from '~/cookies'
import {getBodyClassNames} from '~/lib/getBodyClassNames'
import styles from '~/tailwind.css?url'
import {themePreference} from '~/types/themePreference'

export const links: LinksFunction = () => {
  return [
    {rel: 'stylesheet', href: styles},
    {rel: 'preconnect', href: 'https://cdn.sanity.io'},
    {rel: 'stylesheet', href: 'https://use.typekit.net/zde6oty.css'},
  ]
}

export const loader = async ({request}: LoaderFunctionArgs) => {
  // Dark/light mode
  const cookieHeader = request.headers.get('Cookie')
  const cookieValue = (await themePreferenceCookie.parse(cookieHeader)) || {}
  const theme = themePreference.parse(cookieValue.themePreference) || 'light'
  const bodyClassNames = getBodyClassNames(theme)
  const {toast, headers} = await getToast(request)

  return json(
    {
      theme,
      bodyClassNames,
      ENV: {
        VITE_SANITY_PROJECT_ID: import.meta.env.VITE_SANITY_PROJECT_ID!,
        VITE_SANITY_DATASET: import.meta.env.VITE_SANITY_DATASET!,
        VITE_SANITY_API_VERSION: import.meta.env.VITE_SANITY_API_VERSION!,
      },
      toast,
    },
    {
      headers,
    },
  )
}

export default function App() {
  const {theme, bodyClassNames, ENV} = useLoaderData<typeof loader>()
  const {toast} = useLoaderData<typeof loader>()
  // Hook to show the toasts
  useEffect(() => {
    if (toast?.type === 'error') {
      notify.error(toast.message)
    }
    if (toast?.type === 'success') {
      notify.success(toast.message)
    }
  }, [toast])

  return (
    <html lang="en">
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="https://fav.farm/🤘" />
        <Links />
      </head>
      <body className={bodyClassNames}>
        <Outlet context={{theme}} />
        <ScrollRestoration />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.ENV = ${JSON.stringify(ENV)}`,
          }}
        />
        <Scripts />
        <Toaster />
      </body>
    </html>
  )
}
