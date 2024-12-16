import type {MessageDescriptor} from '@lingui/core'
import {msg} from '@lingui/core/macro'

export type Navigation = {
  title: MessageDescriptor
  path: string
}

export const navigation = [
  {title: msg`Home`, path: '/'},
  {title: msg`Work`, path: '/work'},
  {title: msg`About`, path: '/about'},
  {title: msg`Contact`, path: '/contact'},
]
