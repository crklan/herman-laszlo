import {i18n} from '@lingui/core'
import {detect, fromHtmlTag} from '@lingui/detect-locale'
import {I18nProvider} from '@lingui/react'
import {RemixBrowser} from '@remix-run/react'
import {startTransition, StrictMode} from 'react'
import {hydrateRoot} from 'react-dom/client'

import {loadCatalog} from './modules/lingui/lingui'

async function hydrate() {
  const locale = detect(fromHtmlTag('lang')) || 'en'

  await loadCatalog(locale)
  startTransition(() => {
    hydrateRoot(
      document,
      <StrictMode>
        <I18nProvider i18n={i18n}>
          <RemixBrowser />
        </I18nProvider>
      </StrictMode>,
    )
  })
}

hydrate()
