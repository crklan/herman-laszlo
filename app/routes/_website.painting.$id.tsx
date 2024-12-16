import {Trans} from '@lingui/react/macro'
import type {LoaderFunctionArgs} from '@remix-run/node'
import {useLoaderData, useNavigate} from '@remix-run/react'
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
        <div className="grid grid-cols-12 lg:gap-16 w-full lg:min-h-[500px]">
          <div className="col-span-12 lg:col-span-6 flex items-center justify-center">
            <ImagePreview isPreview={true} data={data as Painting} />
          </div>
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-start gap-1 mt-12 lg:mt-0">
            <h2 className="text-4xl">{data?.title}</h2>
            <span className="mb-4">{data?.series}</span>
            <span>{data?.technique}</span>
            <span>{`${data?.width}x${data?.height} cm`}</span>
            <span>{data?.year}</span>
            <div className="border-b border-gray-400 w-full my-4"></div>
            <a
              href={`mailto:info@laszloherman.com?subject=Povpraševanje "${data?.title}"`}
            >
              <Button>
                <Trans>Pošlji povpraševanje</Trans>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
