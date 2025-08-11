//mdx-components.tsx

import { type MDXComponents as MDXComponentsType } from 'mdx/types'

import { MDXComponents } from '@/components/advontier-website/articles-static/MDXComponents'

export function useMDXComponents(components: MDXComponentsType) {
  return {
    ...components,
    ...MDXComponents,
  }
}
