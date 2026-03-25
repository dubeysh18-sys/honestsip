import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import '../src/index.css'
import '../src/i18n.js'

export default function Layout({ children }) {
  return <HelmetProvider>{children}</HelmetProvider>
}
