import {Trans} from '@lingui/react'
import {NavLink} from '@remix-run/react'

import type {Navigation} from '~/config/nav.config'

export const DesktopNav = ({items}: {items: Navigation[]}) => {
  return (
    <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
      {items.map((item, index) => (
        <NavLink
          key={index}
          to={item.path}
          className={({isActive}) =>
            `transition-colors ${isActive ? 'underline' : 'hover:underline'}`
          }
        >
          <Trans id={item.title.id}>{item.title.message}</Trans>
        </NavLink>
      ))}
    </nav>
  )
}
