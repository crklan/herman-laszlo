import {Trans} from '@lingui/react/macro'
import type {SEOHandle} from '@nasa-gcn/remix-seo'
import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'
import {useLoaderData, useNavigate} from '@remix-run/react'
import imageUrlBuilder from '@sanity/image-url'
import {useQuery} from '@sanity/react-loader'
import groq from 'groq'
import {ArrowLeft, X} from 'lucide-react'
import {useState} from 'react'
import {serverOnly$} from 'vite-env-only/macros'

import {ImagePreview} from '~/components/ImagePreview'
import {Button} from '~/components/ui/button'
import {linguiServer} from '~/modules/lingui/lingui.server'
import {viewClient} from '~/sanity/client.server'
import {loadQuery} from '~/sanity/loader.server'
import {loadQueryOptions} from '~/sanity/loadQueryOptions.server'
import {dataset, projectId} from '~/sanity/projectDetails'
import {PAINTING_QUERY} from '~/sanity/queries'
import type {Painting} from '~/types/painting'

export const meta: MetaFunction<typeof loader> = ({data, location, params}) => {
  if (!data?.initial?.data) {
    return [
      {title: 'Painting Not Found | László Herman'},
      {
        name: 'description',
        content: 'The requested painting could not be found.',
      },
    ]
  }

  const painting = data.initial.data
  const builder = imageUrlBuilder({projectId, dataset})

  // Generate high-quality image URL for social sharing
  const imageUrl = painting.image
    ? builder
        .image(painting.image)
        .width(1200)
        .height(630)
        .quality(80)
        .fit('crop')
        .auto('format')
        .url()
    : null

  const title = `${painting.title} | László Herman`
  const description = `"${painting.title}" by László Herman${painting.year ? ` (${painting.year})` : ''}. ${painting.technique ? `Created using ${painting.technique}` : 'Original artwork'}${painting.width && painting.height ? `, ${painting.width}x${painting.height} cm` : ''}.${painting.series ? ` Part of the ${painting.series} series.` : ''} Available for inquiry.`

  const canonicalUrl = `https://laszloherman.com${location.pathname}`

  // Build breadcrumb based on referrer or series info
  const breadcrumb = painting.series
    ? `Home > Works > Series > ${painting.series} > ${painting.title}`
    : `Home > Works > ${painting.title}`

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
    {property: 'og:image:alt', content: `${painting.title} by László Herman`},

    // Twitter Card
    {name: 'twitter:card', content: 'summary_large_image'},
    {name: 'twitter:title', content: title},
    {name: 'twitter:description', content: description},
    ...(imageUrl ? [{name: 'twitter:image', content: imageUrl}] : []),
    {name: 'twitter:image:alt', content: `${painting.title} by László Herman`},

    // Additional SEO
    {name: 'author', content: 'László Herman'},
    {
      name: 'keywords',
      content: `László Herman, ${painting.title}, ${painting.technique || 'painting'}, ${painting.series || 'artwork'}, contemporary art, fine art`,
    },
    {name: 'robots', content: 'index, follow'},
    {rel: 'canonical', href: canonicalUrl},

    // Art-specific meta
    ...(painting.year
      ? [{name: 'dcterms.created', content: painting.year.toString()}]
      : []),
    {name: 'dcterms.creator', content: 'László Herman'},
    {name: 'dcterms.type', content: 'Image'},
    {name: 'dcterms.medium', content: painting.technique || 'Mixed media'},

    // Breadcrumb
    {name: 'breadcrumb', content: breadcrumb},
  ]
}

export const handle: SEOHandle = {
  getSitemapEntries: serverOnly$(async () => {
    try {
      const paintings = await viewClient.fetch(
        groq`*[_type == "painting"] {
        _id,
        _updatedAt,
        title
      }`,
        {},
        {
          signal: AbortSignal.timeout(30000),
        },
      )

      return paintings.map((painting: any) => ({
        route: `/painting/${painting._id}`,
        priority: 0.7,
        lastmod: painting._updatedAt,
      }))
    } catch (error) {
      console.error('Sitemap generation failed for paintings:', error)
      return []
    }
  }),
}

export const loader = async ({params, request}: LoaderFunctionArgs) => {
  const {options} = await loadQueryOptions(request.headers)
  const query = PAINTING_QUERY
  const locale = await linguiServer.getLocale(request)
  const initial = await loadQuery<Painting>(
    query,
    {id: params.id, locale},
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
  const builder = imageUrlBuilder({projectId, dataset})
  const [showLightbox, setShowLightbox] = useState(false)
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
          <div
            className="col-span-12 lg:col-span-6 flex items-center justify-center cursor-pointer"
            onClick={() => setShowLightbox(true)}
          >
            <ImagePreview isPreview={true} data={data as Painting} />
          </div>
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center items-start gap-1 mt-12 lg:mt-0">
            <h2 className="text-4xl">{data?.title}</h2>
            <span className="mb-4">{data?.series?.name}</span>
            <span>{data?.technique?.name}</span>
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

      {/* Image Lightbox */}
      {showLightbox && data?.image && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setShowLightbox(false)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={builder
              .image(data.image)
              .width(1920)
              .quality(90)
              .auto('format')
              .url()}
            alt={data.title || 'Painting'}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
