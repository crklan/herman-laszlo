import {generateRobotsTxt} from '@nasa-gcn/remix-seo'

export function loader() {
  return generateRobotsTxt([
    {type: 'sitemap', value: 'https://laszloherman.com/sitemap.xml'},
    {type: 'disallow', value: '/studio'},
    {type: 'disallow', value: '/studio/*'},
    {type: 'disallow', value: '/resource'},
    {type: 'disallow', value: '/resource/*'},
    {type: 'disallow', value: '/send'},
    {type: 'disallow', value: '/set-locale'},
  ])
}
