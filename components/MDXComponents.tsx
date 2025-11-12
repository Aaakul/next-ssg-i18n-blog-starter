import CodeBlockWithCopyButton from '@/lib/pliny/ui/CodeBlockWithCopyButton'
import TOCInline from '@/lib/pliny/ui/TOCInline'
import type { MDXComponents } from 'mdx/types'
import Image from './Image'
import CustomLink from './Link'
import TableWrapper from './TableWrapper'

export const components: MDXComponents = {
  Image,
  TOCInline,
  a: CustomLink,
  pre: CodeBlockWithCopyButton,
  table: TableWrapper,
}
