import {Logo} from '~/components/Logo'
import {ThemeToggle} from '~/components/ThemeToggle'
import {navigation} from '~/config/nav.config'
import type {HeaderProps} from '~/types/home'

import {DesktopNav} from './DesktopNav'
import {MobileNav} from './MobileNav'

export function Header(props: HeaderProps) {
  return (
    <header className="transition-colors ease-in-out dark:border-gray-900">
      <div className="container mx-auto flex items-center justify-between p-4 lg:px-12">
        <Logo home={props.home} />
        <div className="md:flex gap-4 justify-center items-center hidden">
          <DesktopNav items={navigation} />
          <div className="flex">
            <ThemeToggle theme={props.theme} />
            {/*  <LocaleSelector /> */}
          </div>
        </div>
        <MobileNav className="md:hidden" items={navigation} />
      </div>
    </header>
  )
}
