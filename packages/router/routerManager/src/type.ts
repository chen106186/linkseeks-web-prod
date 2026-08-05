import { createBrowserRouter } from 'react-router-dom'

export interface RouteStackItem {}

export type RouterType = ReturnType<typeof createBrowserRouter>

export interface RouterNavigationOptions {
  query?: any
  state?: any
  [key: string]: any
}
