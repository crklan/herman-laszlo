import type {LoaderFunctionArgs} from '@remix-run/node'
import {Link, useLoaderData} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'
import {ArrowLeft} from 'lucide-react'

import {ImagePreview} from '~/components/ImagePreview'
import {Button} from '~/components/ui/button'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {PAINTING_QUERY} from '~/sanity/queries'
import type {Painting} from '~/types/painting'

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
  const query = PAINTING_QUERY
  const initial = await loadQuery<Painting>(
    query,
    {id: params.id},
    options,
  ).then((res) => ({
    ...res,
    data: res.data ? res.data : null,
  }))

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

  return (
    <div className="flex flex-col text-center px-40 py-6">
      <div className="flex mb-4">
        <Button variant="link">
          <ArrowLeft strokeWidth={1} />
          <Link to="..">Back</Link>
        </Button>
      </div>
      <div className="grid grid-cols-12 gap-16 w-full">
        <div className="col-span-12 lg:col-span-6 flex justify-center">
          <ImagePreview isPreview={true} data={data as Painting} />
        </div>
        <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-start gap-1">
          <h2 className="text-4xl">{data?.title}</h2>
          <span className="mb-4">{data?.series}</span>
          <span>{data?.technique}</span>
          <span>{`${data?.width}x${data?.height} cm`}</span>
          <span>{data?.year}</span>
          <div className="border-b border-gray-400 w-96 my-4"></div>
          <a
            href={`mailto:info@laszloherman.com?subject=Povpraševanje "${data?.title}"`}
          >
            <Button>Pošlji povpraševanje</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
