import type {LoaderFunctionArgs, MetaFunction} from '@remix-run/node'

import portrait from '~/assets/portrait.png'
import type {loader as layoutLoader} from '~/routes/_website'

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
  return null
}

export default function Index() {
  return (
    <div>
      <div className="bg-white w-full min-h-screen grid grid-cols-12 p-12 py-16 lg:p-20 lg:py-20">
        <div className="relative order-2 lg:order-1 col-span-12 lg:col-span-6 flex justify-center items-center">
          <img
            className="object-cover h-[80%] w-3/4 z-10 shadow-[-20px_20px_0_5px_rgba(61,140,204,1)] lg:shadow-[-30px_30px_0_5px_rgba(61,140,204,1)]"
            src={portrait}
            alt="Portrait of Laszlo"
          />
        </div>

        <div className="order-1 lg:order-2 col-span-12 lg:col-start-7 lg:col-span-6 flex flex-col gap-12">
          <div className="font-display text-5xl lg:text-7xl mt-20">Contact</div>
          <p>Pošljite povpraševanje ali stopite v kontakt.</p>
        </div>
      </div>
    </div>
  )
}
