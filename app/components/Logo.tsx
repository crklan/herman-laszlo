import {Link} from '@remix-run/react'

import type {LogoProps} from '~/types/home'

export function Logo(props: LogoProps) {
  const {siteTitle} = props.home ?? {}

  if (!siteTitle && typeof document !== `undefined`) {
    console.info(
      `Create and publish "home" document in Sanity Studio at ${window.origin}/studio/desk/home`,
    )
  }

  return (
    <p className="mt-3 text-2xl font-display tracking-wide text-black dark:text-white lg:text-2xl text-nowrap">
      <Link to="/">{siteTitle ?? `Sanity Remix`}</Link>
    </p>
  )
}
