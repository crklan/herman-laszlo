import type {SEOHandle} from '@nasa-gcn/remix-seo'
import type {LoaderFunctionArgs} from '@remix-run/node'
import {json} from '@remix-run/node'

import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {PAGINATED_TECHNIQUE_PAINTINGS_QUERY} from '~/sanity/queries'
import type {Painting} from '~/types/painting'
import {linguiServer} from '~/modules/lingui/lingui.server'

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const url = new URL(request.url)
  const offset = parseInt(url.searchParams.get('offset') || '0')
  const limit = parseInt(url.searchParams.get('limit') || '20')
  const locale = await linguiServer.getLocale(request)
  const {options} = await loadQueryOptions(request.headers)

  const result = await loadQuery<{paintings: Painting[]}>(
    PAGINATED_TECHNIQUE_PAINTINGS_QUERY,
    {
      techniqueId: params.techniqueId,
      offset,
      limit,
      locale,
    },
    options,
  )

  return json({paintings: result.data?.paintings || []})
}

export const handle: SEOHandle = {
  getSitemapEntries: () => null,
}
