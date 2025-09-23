//mdx-components.tsx

import { type MDXComponents as MDXComponentsType } from 'mdx/types'

import { MDXComponents } from '@/components/react-ui/articles-static/MDXComponents'

export function useMDXComponents(components: MDXComponentsType) {
  return {
    ...components,
    ...MDXComponents,
  }
}
