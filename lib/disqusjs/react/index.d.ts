import * as react from 'react'

interface DisqusJSConfig {
  shortname: string
  siteName?: string
  identifier?: string
  url?: string
  title?: string
  api?: string
  apikey: string | string[]
  nesting?: number
  nocomment?: string
  admin?: string
  adminLabel?: string
  disqusJsModeAssetsUrlTransformer?: (url: string) => string
}

declare const _default: react.ForwardRefExoticComponent<
  Omit<
    DisqusJSConfig & react.ClassAttributes<HTMLDivElement> & react.HTMLAttributes<HTMLDivElement>,
    'ref'
  > &
    react.RefAttributes<HTMLDivElement>
>

export { _default as default }
export type { DisqusJSConfig }
