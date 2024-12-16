import {useFetcher} from '@remix-run/react'
import {Moon, Sun} from 'lucide-react'

import type {ThemePreference} from '~/types/themePreference'

import {Button} from './ui/button'

export function ThemeToggle(props: {theme: ThemePreference}) {
  const cookieToggle = useFetcher()
  const isDarkMode = props.theme === `dark`

  return (
    <cookieToggle.Form method="post" action="/resource/toggle-theme">
      <Button
        variant="ghost"
        size="icon"
        type="submit"
        disabled={cookieToggle.state === 'submitting'}
      >
        {isDarkMode ? (
          <Sun className="h-4 w-4 " />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        <div className="sr-only select-none">
          {isDarkMode ? `Light` : `Dark`} Mode
        </div>
      </Button>
    </cookieToggle.Form>
  )
}
