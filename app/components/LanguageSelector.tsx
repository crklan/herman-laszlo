import type {MessageDescriptor} from '@lingui/core'
import {msg} from '@lingui/core/macro'
import {Trans} from '@lingui/react'
import {useFetcher, useFetchers, useRouteLoaderData} from '@remix-run/react'
import {LanguagesIcon} from 'lucide-react'
import type {ComponentProps} from 'react'

import type config from '../../lingui.config'
import type {action, RootLoaderType} from '../root'
import {Button} from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function getLanguages(): Array<{
  key: (typeof config.locales)[number]
  label: MessageDescriptor
}> {
  return [
    {key: 'en', label: msg`English`},
    {key: 'sl', label: msg`Slovene`},
  ]
}

export function LocaleSelector(props: ComponentProps<'select'>) {
  const languages = getLanguages()
  const {setLocale} = useLocaleSelector()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <LanguagesIcon className="h-5 w-5" />
          <span className="sr-only">Toggle language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem key={language.key}>
            <button
              className="w-full text-left"
              type="submit"
              name="locale"
              value={language.key}
              onClick={() => setLocale(language.key)}
            >
              <Trans id={language.label.id} />
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function useOptimisticLocale() {
  const fetchers = useFetchers()
  const themeFetcher = fetchers.find((f) => f.formAction === '/')

  if (themeFetcher?.formData) {
    const submission = Object.fromEntries(themeFetcher.formData)

    // Use Valibot or zod to validate
    if (
      submission.status === 'success' &&
      typeof submission.value === 'object' &&
      'locale' in submission.value
    ) {
      return (submission.value as {locale: string}).locale
    }
  }
}

export function useLocaleSelector() {
  const data = useRouteLoaderData<RootLoaderType>('root')
  const fetcher = useFetcher<typeof action>()

  const optimisticLocale = useOptimisticLocale()
  const locale = optimisticLocale ?? data?.locale ?? 'en'

  const setLocale = (locale: string) => {
    fetcher.submit(
      {
        locale,
      },
      {
        method: 'POST',
        action: '/set-locale',
      },
    )
  }

  return {
    locale,
    setLocale,
  }
}
