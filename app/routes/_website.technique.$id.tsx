import {Trans} from '@lingui/react/macro'
import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {useLoaderData, useNavigate} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'
import {useQuery} from '@sanity/react-loader'
import {ArrowLeft} from 'lucide-react'

import {Mansory} from '~/components/Mansory'
import {Button} from '~/components/ui/button'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {dataset, projectId} from '~/sanity/projectDetails'
import {TEHNIQUE_QUERY} from '~/sanity/queries'
import {Technique} from '~/types/technique'

export const meta: MetaFunction<typeof loader> = ({data, location}) => {
  if (!data?.initial?.data) {
    return [
      {title: 'Technique Not Found | László Herman'},
      {
        name: 'description',
        content: 'The requested technique could not be found.',
      },
    ]
  }

  const technique = data.initial.data
  const builder = imageUrlBuilder({projectId, dataset})

  // Use cover image for social sharing
  const imageUrl = technique.cover?.image
    ? builder
        .image(technique.cover.image)
        .width(1200)
        .height(630)
        .quality(80)
        .url()
    : null

  const title = `${technique.name} Technique | László Herman`
  const description = technique.description
    ? `${technique.description} - Artworks created using ${technique.name} by László Herman.`
    : `Explore artworks created using ${technique.name} technique by László Herman. View paintings and artistic explorations in this medium.`

  const canonicalUrl = `https://laszloherman.com${location.pathname}`

  return [
    {title},
    {name: 'description', content: description},

    // Open Graph
    {property: 'og:title', content: title},
    {property: 'og:description', content: description},
    {property: 'og:type', content: 'website'},
    {property: 'og:url', content: canonicalUrl},
    ...(imageUrl ? [{property: 'og:image', content: imageUrl}] : []),
    {property: 'og:site_name', content: 'László Herman'},

    // Twitter Card
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    ...(imageUrl ? [{name: 'twitter:image', content: imageUrl}] : []),

    // Additional SEO
    {name: 'author', content: 'László Herman'},
    {
      name: 'keywords',
      content: `László Herman, ${technique.name}, technique, paintings, contemporary art, artistic medium`,
    },
    {name: 'robots', content: 'index, follow'},
    {rel: 'canonical', href: canonicalUrl},

    // Breadcrumb structured data
    {
      name: 'breadcrumb',
      content: 'Home > Works > Techniques > ' + technique.name,
    },
  ]
}

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const {options} = await loadQueryOptions(request.headers)
  const query = TEHNIQUE_QUERY
  const initial = await loadQuery<Technique>(
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
        <h1 className="font-display text-5xl mb-12">
          <Trans>{data?.name}</Trans>
        </h1>
        <p className="font-body text-left">{data?.description}</p>
        <Mansory
          initialPaintings={data?.paintings || []}
          totalCount={data?.totalCount || 0}
          apiEndpoint={`/resource/techniques-paintings/${params.id}`}
        />
      </div>
    </>
  )
}
