import {pathsAreEqual, stringToPath} from 'sanity'
import {defineMigration, set} from 'sanity/migrate'

const targetPath = stringToPath('title')

export default defineMigration({
  title: 'migratePaintingsTitles',
  documentTypes: ['painting'],

  migrate: {
    string(node, path, ctx) {
      if (pathsAreEqual(path, targetPath)) {
        return set([
          {
            _key: 'sl',
            _type: 'internationalizedArrayStringValue',
            value: node,
          },
        ])
      }
    },
  },
})
