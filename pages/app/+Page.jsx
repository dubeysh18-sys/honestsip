import React from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import App from '../../src/App.jsx'

export function Page() {
  const pageContext = usePageContext()
  const raw = pageContext.urlOriginal || '/'
  const pathname = new URL(raw, 'http://localhost').pathname
  return <App ssrPathname={pathname} />
}
