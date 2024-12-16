import type {LinguiConfig} from '@lingui/conf'

const config: LinguiConfig = {
  fallbackLocales: {
    default: 'sl',
  },
  locales: ['en', 'sl'],
  catalogs: [
    {
      path: '<rootDir>/app/locales/{locale}',
      include: ['app'],
    },
  ],
}

export default config
