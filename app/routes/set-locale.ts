import type {SEOHandle} from '@nasa-gcn/remix-seo'
import type {ActionFunctionArgs} from '@remix-run/node'
import {json} from '@remix-run/node'

import {localeCookie} from '~/modules/lingui/lingui.server'

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData()

  const locale = formData.get('locale') ?? 'en'

  return json(null, {
    headers: {
      'Set-Cookie': await localeCookie.serialize(locale),
    },
  })
}

export const handle: SEOHandle = {
  getSitemapEntries: () => null,
}
