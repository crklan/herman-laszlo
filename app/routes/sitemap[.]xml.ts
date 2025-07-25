import {generateSitemap} from '@nasa-gcn/remix-seo'
import type {LoaderFunctionArgs} from '@remix-run/node'

export async function loader({request}: LoaderFunctionArgs) {
  // Dynamic import that handles both dev and production
  let routes: any = {}

  try {
    if (process.env.NODE_ENV === 'production') {
      const serverBuild = await import('@remix-run/dev/server-build')
      routes = serverBuild.routes
    } else {
      // In development, we'll rely on the individual route handles
      // The sitemap will still be generated from the SEO handles we added
      routes = {}
    }
  } catch (error) {
    console.warn('Could not load server build routes:', error)
    routes = {}
  }

  return generateSitemap(request, routes, {
    siteUrl: 'https://laszloherman.com',
  })
}
