import '@fontsource/poppins/300.css'
import '@fontsource/poppins/700.css'

import {i18n} from '@lingui/core'
import type {
  ActionFunctionArgs,
  LinksFunction,
  LoaderFunctionArgs,
} from '@remix-run/node'
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

import {loadCatalog} from './modules/lingui/lingui'
import {linguiServer, localeCookie} from './modules/lingui/lingui.server'

export const links: LinksFunction = () => {
  return [
    {rel: 'preconnect', href: 'https://cdn.sanity.io'},
    {rel: 'stylesheet', href: 'https://use.typekit.net/zde6oty.css'},
    {rel: 'stylesheet', href: styles},
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
  ]
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData()

  const locale = formData.get('locale') ?? 'en'

  return Response.json(null, {
    headers: {
      'Set-Cookie': await localeCookie.serialize(locale),
    },
  })
}

export const loader = async ({request}: LoaderFunctionArgs) => {
  // Dark/light mode
  const cookieHeader = request.headers.get('Cookie')
  const cookieValue = (await themePreferenceCookie.parse(cookieHeader)) || {}
  const theme = themePreference.parse(cookieValue.themePreference) || 'light'
  const bodyClassNames = getBodyClassNames(theme)
  const locale = await linguiServer.getLocale(request)

  const {toast, headers} = await getToast(request)
  headers.append('Set-Cookie', await localeCookie.serialize(locale))

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
      locale,
    },
    {
      headers,
    },
  )
}

export type RootLoaderType = typeof loader

export default function App() {
  const {theme, bodyClassNames, ENV} = useLoaderData<typeof loader>()
  const {toast, locale} = useLoaderData<typeof loader>()
  // Hook to show the toasts
  useEffect(() => {
    if (toast?.type === 'error') {
      notify.error(toast.message)
    }
    if (toast?.type === 'success') {
      notify.success(toast.message)
    }
  }, [toast])

  useEffect(() => {
    if (i18n.locale !== locale) {
      loadCatalog(locale)
    }
  }, [locale])

  return (
    <html lang={locale ?? 'en'} className="h-full">
      <head>
        <Meta />
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
