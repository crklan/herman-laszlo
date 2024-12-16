import {Trans} from '@lingui/react'
import {NavLink} from '@remix-run/react'
import * as React from 'react'

import type {Navigation} from '~/config/nav.config'

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'

interface MobileNavProps {
  className?: string
  items: Navigation[]
}

export function MobileNav({className, items}: MobileNavProps) {
  const [open, setOpen] = React.useState(false)
  const onRedirect = () => setOpen(false)
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className={className}>
        <div className="flex items-center justify-center">
          <span className="font-bold">Meni</span>
        </div>
      </SheetTrigger>
      <SheetContent
        side="left"
        onOpenAutoFocus={(e: Event) => e.preventDefault()}
        onCloseAutoFocus={(e: Event) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle></SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4">
          {items.map((item, index) => (
            <NavLink
              key={index}
              onClick={onRedirect}
              to={item.path}
              className={({isActive}) =>
                `transition-colors ${isActive ? 'underline' : 'hover:underline'}`
              }
            >
              <Trans id={item.title.id}>{item.title.message}</Trans>
            </NavLink>
          ))}
        </nav>
        <SheetFooter className="absolute bottom-4 left-0 w-full">
          <div className="container flex flex-wrap flex-col items-center mr-4">
            <p className="text-center text-xs leading-loose text-muted-foreground">
              Laszlo Herman © 2024
            </p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
