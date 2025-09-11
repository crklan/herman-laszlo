import {pathsAreEqual, stringToPath} from 'sanity'
import {defineMigration, set} from 'sanity/migrate'

const targetPath = stringToPath('description')

export default defineMigration({
  title: 'migrateSeriesDescription',
  documentTypes: ['series'],

  migrate: {
    string(node, path, ctx) {
      if (pathsAreEqual(path, targetPath)) {
        if (pathsAreEqual(path, targetPath)) {
          return set([
            {
              _key: 'sl',
              _type: 'internationalizedArrayTextValue',
              value: node,
            },
          ])
        }
      }
    },
  },
})
