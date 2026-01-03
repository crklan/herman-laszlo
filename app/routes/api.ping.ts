import {json} from '@remix-run/node'

export const loader = () => {
  return json(
    {
      status: 'ok',
      timestamp: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store',
      },
    },
  )
}
