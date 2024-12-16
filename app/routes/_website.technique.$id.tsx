import {Trans} from '@lingui/react/macro'
import type {LoaderFunctionArgs} from '@remix-run/node'
import {Link, useLoaderData, useNavigate} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'
import {ArrowLeft} from 'lucide-react'

import {Mansory} from '~/components/Mansory'
import {Button} from '~/components/ui/button'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {TEHNIQUE_QUERY} from '~/sanity/queries'
import type {Serie} from '~/types/series'

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  console.log(params.id)
  const {options} = await loadQueryOptions(request.headers)
  const query = TEHNIQUE_QUERY
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

  return (
    <>
      <Button
        className="lg:ps-24 xl:ps-44 mt-12"
        variant="link"
        onClick={goBack}
      >
        <ArrowLeft strokeWidth={1} />
        <Trans>Back</Trans>
      </Button>
      <div className="flex flex-col text-center px-12 py-4 lg:px-24 xl:px-44 lg:py-2">
        <h1 className="font-display text-5xl mb-12">
          <Trans>{data?.name}</Trans>
        </h1>
        <p className="font-body text-left">{data?.description}</p>
        <Mansory paintings={data?.paintings} />
      </div>
    </>
  )
}
