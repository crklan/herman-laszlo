import {Trans} from '@lingui/react/macro'
import type {LoaderFunctionArgs} from '@remix-run/node'
import {Link, useLoaderData, useNavigate} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'
import {ArrowLeft} from 'lucide-react'

import {Mansory} from '~/components/Mansory'
import {Button} from '~/components/ui/button'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {SERIE_QUERY} from '~/sanity/queries'
import type {Serie} from '~/types/series'

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

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  console.log(params.id)
  const {options} = await loadQueryOptions(request.headers)
  const query = SERIE_QUERY
  const initial = await loadQuery<Serie>(query, {id: params.id}, options).then(
    (res) => ({
      ...res,
      data: res.data ? res.data : null,
    }),
  )

  if (!initial.data) {
    throw new Response('Not found', {status: 404})
  }

  return {
    initial,
    query,
    params,
  }
}

export default function Index() {
  const {initial, query, params} = useLoaderData<typeof loader>()
  const {data} = useQuery<typeof initial.data>(query, params, {
    // There's a TS issue with how initial comes over the wire
    // @ts-expect-error
    initial,
  })
  const navigate = useNavigate()
  const goBack = () => navigate(-1)

  console.log(data)
  return (
    <div className="flex flex-col text-center px-8 xl:px-44 xl:py-20">
      <div className="flex">
        <Button variant="link">
          <ArrowLeft strokeWidth={1} />
          <Button variant="link" onClick={goBack}>
            <Trans>Back</Trans>
          </Button>
        </Button>
      </div>
      <h1 className="font-display text-5xl mb-12">{data?.name}</h1>
      <p className="font-body text-left">{data?.description}</p>
      <Mansory paintings={data?.paintings} />
    </div>
  )
}
