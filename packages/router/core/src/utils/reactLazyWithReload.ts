/**
*这是React的包装。Lazy基于Christoph Nakazawa解决方案(https://gist.github.com/cpojer/c50a742ec943d95c3c72a41ac1c06f03)针对使用React时发生的问题。Lazy和我们部署了一个新版本的模块，更改散列（由捆绑器自动管理）。
*
*问题是：

*当我们的React应用程序被编译用于生产时，打包工具（在本例中为Vite）通常会在文件名中添加哈希来处理缓存。

*只要文件的内容发生变化，这些散列就会发生变化。这可以确保用户获得文件的最新版本，因为哈希的更改将迫使浏览器下载新文件，而不是提供缓存版本。

*

*如果用户打开了您的应用程序并进行了新的部署，则动态加载的模块的文件名可能会更改（由于新的哈希）。

*然后，如果用户导航到应用程序中需要加载新模块的部分，他们的浏览器将尝试使用旧文件名（位于以前加载的代码中）加载模块，这将导致错误，因为服务器上不再存在该文件。

*

*解决方案-解决方法：

*

*React的包装。如果找不到模块，则重新加载页面的Lazy。

*如果在10秒之前，错误再次出现，我们假设这不是与此问题相关的错误，并抛出错误，让

*反应误差边界(https://react.dev/reference/react/useTransition#displaying-对于具有错误边界的用户来说是一个错误）来管理它。

*

*如果您想管理react惰性包装器内部的错误，请检查Christoph解决方案。
**/

import type { ComponentType } from 'react'
import * as React from 'react'

export const lazy = (factory: () => Promise<{ default: ComponentType<any> }>) => {
  return React.lazy(() => factory().catch(importErrorHandler))
}

export function importErrorHandler(err: string): { default: ComponentType<any> } {
  // 从本地存储获取上次重新加载时间和当前时间
  const timeStr = sessionStorage.getItem('last-reload')
  const time = timeStr ? Number(timeStr) : null
  const now = Date.now()

  // 如果上次重新加载时间超过10秒，请重新加载页面
  const isReloading = !time || time + 10_000 < now
  if (isReloading) {
    console.log('New version for this module found. Reloading ...')
    sessionStorage.setItem('last-reload', String(now))
    window.location.reload()
    return { default: () => null }
  }

  // 让ErrorBoundary处理错误
  throw new Error(err)
}
