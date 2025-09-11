import {pathsAreEqual, stringToPath} from 'sanity'
import {defineMigration, set} from 'sanity/migrate'

const targetPath = stringToPath('name')

export default defineMigration({
  title: 'migrateTechniqueNames',
  documentTypes: ['technique'],

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
