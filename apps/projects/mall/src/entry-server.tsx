import ReactDOMServer from 'react-dom/server'
import { createStaticHandler, createStaticRouter, StaticRouterProvider } from 'react-router-dom/server'
import { Response } from 'node-fetch'
import { HelmetProvider } from 'react-helmet-async'
import CacheManager from '@/utils/cache'
import i18next from 'i18next'
import { routes } from '../config/routes.config'
import I18nProvider from './context/i18nProvider'

export async function render(fetchRequest: any) {
  const { query, dataRoutes } = createStaticHandler(routes)
  const context: any = await query(fetchRequest)

  if (context instanceof Response) {
    throw context
  }

  if (context?.loaderData['0']?.language) {
    const language = context?.loaderData['0']?.language
    CacheManager.set('language', language)
    i18next.changeLanguage(language)
  }

  const router = createStaticRouter(dataRoutes, context)

  const helmetContext = {}

  const html = ReactDOMServer.renderToString(
    <I18nProvider language={context?.loaderData['0']?.language}>
      <HelmetProvider context={helmetContext}>
        <StaticRouterProvider context={context} router={router} nonce="the-nonce" />
      </HelmetProvider>
    </I18nProvider>,
  )
  return { html, ...helmetContext }
}
