import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import I18nProvider from './context/i18nProvider'
import { routes } from '../config/routes.config'

const context = {}

const Container = () => {
  return (
    <I18nProvider>
      <HelmetProvider context={context}>
        <RouterProvider router={createBrowserRouter(routes)} />
      </HelmetProvider>
    </I18nProvider>
  )
}

const root = document.getElementById('root')!
ReactDOM.createRoot(root).render(<Container />)
