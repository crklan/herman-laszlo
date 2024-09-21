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
      <div className="bg-white w-full grid grid-cols-12 p-12 py-16 lg:p-20 lg:py-20">
        <div className="relative order-2 lg:order-1 col-span-12 lg:col-span-6 flex justify-center items-center">
          <img
            className="object-cover h-[90%] w-3/4 z-10 shadow-[-20px_20px_0_5px_rgba(222,74,46,1)] lg:shadow-[-30px_30px_0_5px_rgba(222,74,46,1)]"
            src={portrait}
            alt="Portrait of Laszlo"
          />
        </div>
        <div className="order-1 lg:order-2 col-span-12 lg:col-start-7 lg:col-span-6 flex flex-col gap-12">
          <div className="font-display text-5xl lg:text-7xl mt-20">
            O umetniku
          </div>
          <p className="text-lg lg:text-xl font-light leading-7 lg:leading-9">
            László Herman  se je rodil leta 1961 v Gornjem Lakošu, v Lendavi. 
            Odraščal je v delovski-kmečki družini. Dvojezično šolo je obiskoval
            v Gaberju v Lendavi, nato pa šolanje nadaljeval na ljubljanski
            srednji šoli za oblikovanje. V slovenski prestolnici je zaključil
            tudi višješolsko in visokošolsko izobraževanje, in sicer najprej na
            Pedagoški akademiji - smer likovna in tehnična vzgoja, kasneje pa še
            na Pedagoški fakulteti Univerze v Ljubljani - smer likovna umetnost.
            Odkar je zaključil šolanje, dela kot učitelj. Na začetku svoje
            umetniške poti je imela velik vpliv nanj fotografska umetnost,
            kasneje pa se je njegovo zanimanje preusmerilo k slikarstvu. Njegovi
            slikarski podvigi in študije obsegajo širok tematski in motivni
            spekter: zgodovino, znanstveno-tehnično revolucijo, manjšinsko bit,
            poglavja iz zgodovine lastne družine, brezizhodnost malega človeka,
            ki je žrtev političnih manipulacij in refleksije na globalizacijsko
            soodvisnost. Pomembnejši cikli, s katerimi je uspel vzbuditi tudi
            zanimanje stroke, so naslednji: Zimsko vzdušje, Začarani krog
            življenja, Prekmurska svatba, Sprehod po Luni - Orel je pristal,
            Obmejni veter, Potovanje v neznano, Sprehod po versajskem parku,
            Made in China ter Dolgo, vroče poletje v Lakošu.
          </p>
        </div>
      </div>
    </div>
  )
}
