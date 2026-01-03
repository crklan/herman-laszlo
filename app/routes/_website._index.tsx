import {Trans} from '@lingui/react/macro'
import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {Link, useLoaderData} from '@remix-run/react'
import {useQuery} from '@sanity/react-loader'

import background from '~/assets/background.avif'
import portrait from '~/assets/new-portrait.jpeg'
import {Button} from '~/components/ui/button'
import {linguiServer} from '~/modules/lingui/lingui.server'
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
> = ({matches, location}) => {
  const layoutData = matches.find(
    (match) => match.id === `routes/_website`,
  )?.data
  const home = layoutData ? layoutData.initial.data : null

  const title =
    home?.title && home?.siteTitle
      ? `${home.title} | ${home.siteTitle}`
      : 'László Herman | Contemporary Artist'

  const description =
    'László Herman - Contemporary artist born in 1961 in Gornji Lakoš, Lendava. Explore paintings spanning history, minority identity, family heritage, and globalization themes.'

  const canonicalUrl = `https://laszloherman.com${location.pathname}`

  return [
    {title},
    {name: 'description', content: description},

    // Open Graph
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: canonicalUrl},
    {property: 'og:site_name', content: 'László Herman'},
    {property: 'og:image', content: `https://laszloherman.com${portrait}`},
    {property: 'og:image:alt', content: 'Portrait of László Herman'},

    // Twitter Card
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    {name: 'twitter:image', content: `https://laszloherman.com${portrait}`},
    {name: 'twitter:image:alt', content: 'Portrait of László Herman'},

    // Additional SEO
    {name: 'author', content: 'László Herman'},
    {
      name: 'keywords',
      content:
        'László Herman, contemporary artist, painter, Lendava, Slovenian art, paintings, gallery, artwork',
    },
    {name: 'robots', content: 'index, follow'},
    {rel: 'canonical', href: canonicalUrl},

    // Artist-specific structured data hints
    {name: 'dcterms.creator', content: 'László Herman'},
    {name: 'dcterms.type', content: 'Text'},
    {name: 'geo.placename', content: 'Lendava, Slovenia'},

    // Homepage specific
    {property: 'og:locale', content: 'sl_SI'},
  ]
}

export const loader = async ({request}: LoaderFunctionArgs) => {
  const {options} = await loadQueryOptions(request.headers)
  const query = PAINTINGS_QUERY
  const locale = await linguiServer.getLocale(request)
  const params = {
    locale,
  }
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
      <div className="w-full min-h-screen bg-sky-600 dark:bg-sky-900 grid grid-cols-12 p-8 py-16 lg:p-20 lg:py-24 -mt-2 lg:mt-0">
        <div className="relative mt-12 lg:mt-0 order-2 lg:order-1 col-span-12 lg:col-span-5 flex justify-center items-center">
          <img
            className="object-cover h-full lg:h-[70%] lg:w-3/4 w-5/6 z-10 shadow-[-20px_20px_0_5px_rgba(255,255,255,1)] lg:shadow-[-40px_40px_0_10px_rgba(255,255,255,1)]"
            src={portrait}
            alt="Portrait of Laszlo"
          />
        </div>
        <div className="order-1 lg:order-2 col-span-12 lg:col-start-7 lg:col-span-6 flex flex-col gap-4 lg:gap-12">
          <div className="font-display text-5xl lg:text-7xl text-white mt-20">
            <Trans>About</Trans>
          </div>
          <p className="text-lg lg:text-2xl font-light leading-7 lg:leading-10 text-white">
            <Trans>
              László Herman se je rodil leta 1961 v Gornjem Lakošu, v Lendavi.
              Na začetku svoje umetniške poti je imela velik vpliv nanj
              fotografska umetnost, kasneje pa se je njegovo zanimanje
              preusmerilo k slikarstvu. Njegovi slikarski podvigi in študije
              obsegajo širok tematski in motivni spekter: zgodovino,
              znanstveno-tehnično revolucijo, manjšinsko bit, poglavja iz
              zgodovine lastne družine, brezizhodnost malega človeka, ki je
              žrtev političnih manipulacij in refleksije na globalizacijsko
              soodvisnost ...
            </Trans>
          </p>
          <Link to="/about">
            <Button size="lg" variant="outline">
              <Trans>Read more</Trans>
            </Button>
          </Link>
        </div>
      </div>
      {/* <div className="px-4 md:px-24 pb-16">
        <h3 className="mt-4 text-5xl font-display">Izbrana dela</h3>
        <Mansory paintings={data as Painting[]} />
      </div> */}
    </div>
  )
}
