import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {Link, useLoaderData} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'

import background from '~/assets/background.png'
import portrait from '~/assets/portrait.png'
import {Mansory} from '~/components/Mansory'
import {Button} from '~/components/ui/button'
import type {loader as layoutLoader} from '~/routes/_website'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {PAINTINGS_QUERY} from '~/sanity/queries'
import type {Painting} from '~/types/painting'

export const meta: MetaFunction<
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
}

export const loader = async ({request}: LoaderFunctionArgs) => {
  const {options} = await loadQueryOptions(request.headers)
  const query = PAINTINGS_QUERY
  const params = {}
  const initial = await loadQuery<Painting[]>(query, params, options).then(
    (res) => ({
      ...res,
      data: res.data ? res.data : null,
    }),
  )

  if (!initial.data) {
    throw new Response('Not found', {status: 404})
  }

  return {initial, query, params}
}

export default function Index() {
  const {initial, query, params} = useLoaderData<typeof loader>()
  const {data} = useQuery<typeof initial.data>(query, params, {
    // There's a TS issue with how initial comes over the wire
    // @ts-expect-error
    initial,
  })

  return (
    <div>
      <div className="relative w-full h-[95vh]">
        <img
          className="h-full w-full object-cover"
          alt="Landing page"
          src={background}
        />
        <h1 className="text-8xl lg:text-[220px] font-display text-white absolute w-full text-center top-[40%]">
          László Herman
        </h1>
      </div>
      <div className="w-full min-h-screen bg-sky-600 grid grid-cols-12 p-12 py-16 lg:p-20 lg:py-24">
        <div className="relative order-2 lg:order-1 col-span-12 lg:col-span-5 flex justify-center items-center">
          <img
            className="object-cover h-[90%] w-3/4 z-10 shadow-[-20px_20px_0_5px_rgba(255,255,255,1)] lg:shadow-[-30px_30px_0_5px_rgba(255,255,255,1)]"
            src={portrait}
            alt="Portrait of Laszlo"
          />
        </div>
        <div className="order-1 lg:order-2 col-span-12 lg:col-start-7 lg:col-span-6 flex flex-col gap-12">
          <div className="font-display text-5xl lg:text-7xl text-white mt-20">
            O slikarju
          </div>
          <p className="text-lg lg:text-2xl font-light leading-7 lg:leading-10 text-white">
            László Herman se je rodil leta 1961 v Gornjem Lakošu, v Lendavi. Na
            začetku svoje umetniške poti je imela velik vpliv nanj fotografska
            umetnost, kasneje pa se je njegovo zanimanje preusmerilo k
            slikarstvu. Njegovi slikarski podvigi in študije obsegajo širok
            tematski in motivni spekter: zgodovino, znanstveno-tehnično
            revolucijo, manjšinsko bit, poglavja iz zgodovine lastne družine,
            brezizhodnost malega človeka, ki je žrtev političnih manipulacij in
            refleksije na globalizacijsko soodvisnost ...
          </p>
          <div>
            <Link to="/about">
              <Button size="lg" variant="outline">
                Preberi več
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="px-24 pb-16">
        <Mansory paintings={data as Painting[]} />
      </div>
    </div>
  )
}
