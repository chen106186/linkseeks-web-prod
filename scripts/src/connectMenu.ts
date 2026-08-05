import path from 'path'
import fs from 'fs'
import { importMetaGlob } from './utils'
import locales from './locales'
// import locales from './zh-CN'

const sourceMaps = {
  platform: 1,
  admin: 99,
}
interface RouteConfig {
  filePath: string
  content: any
}

interface RouteModule {
  path: string
  buttons: {
    name: string
    path: string
    config: any
    code: string
  }[]
  config: any
}

function buildTree(data: any, terminal: string) {
  const tree: any = {}

  data.forEach((item) => {
    if (item.config.menuMeta === false && !item.config.authButtons) {
      return
    }
    const paths = item.path.split('/').filter(Boolean)
    let currentNode = tree

    paths.forEach((path) => {
      if (!currentNode.children) {
        currentNode.children = []
      }

      const fullPath = currentNode.path ? `${currentNode.path}/${path}` : `/${path}`
      const existingNode = currentNode.children.find((node) => node.path === fullPath)
      if (existingNode) {
        currentNode = existingNode
      } else {
        const newNode: any = { path: fullPath, name: locales[`menu.${fullPath.split('/').slice(1).join('.')}`] }
        newNode.source = sourceMaps[terminal]
        newNode.code = newNode.path
        currentNode.children.push(newNode)
        currentNode = newNode
      }
    })

    currentNode.name = locales[`menu.${currentNode.path.split('/').slice(1).join('.')}`]

    currentNode.buttons =
      item.config.authButtons?.map((v) => {
        v.path = currentNode.path + '/' + v.key
        v.code = v.path
        return v
      }) || []
    delete item.config.authButtons
    currentNode.config = item.config || {}
  })

  return tree.children
}

class MenuFactory {
  terminal: string
  routerConfig: RouteConfig[]

  constructor(terminal?: string) {
    this.terminal = terminal || process.argv[2]
    this.routerConfig = []

    this.main().catch((error) => {
      console.error('An error occurred:', error)
    })
  }

  private async main() {
    if (this.terminal) {
      this.routerConfig = await importMetaGlob(this.resolveProject(this.terminal, '/**/page.config.{ts,tsx}'), {
        eager: true,
      })

      this.routerConfig.forEach((v) => {
        if (v.content['detail']?.authButtons || v.content['add']?.authButtons || v.content['edit']?.authButtons) {
          console.log(v)
        }
      })
      const routeFileModules = await importMetaGlob(this.resolveProject(this.terminal, '/**/view.{ts,tsx}'), {
        onlyPath: true,
      })

      const routePaths = this.parseRoutePath(
        routeFileModules.map((v) => v.filePath),
        this.parseRouteConfig(this.routerConfig),
      )

      this.outputRoute(routePaths)
    }
  }

  private resolveProject(terminal: string, p: string) {
    const modulePath = path.resolve(__dirname, `../../projects/${terminal}/src/pages${p}`)
    return modulePath
  }

  private replaceRoute(route: string) {
    const keyword = 'src/pages'
    return route.substring(route.indexOf(keyword) + keyword.length)
  }

  private parseRouteConfig(routerConfig: RouteConfig[]) {
    return routerConfig.reduce((prev, next) => {
      const routerPath = this.replaceRoute(next.filePath).replace('/page.config.ts', '')
      prev[routerPath] = {
        ...next.content,
      }
      return prev
    }, {} as any)
  }

  private outputRoute(routeModule: RouteModule[]) {
    const result = buildTree(routeModule, this.terminal)
    const output = path.resolve(__dirname, '../dist')
    const routeFilePath = path.join(output, `route.${this.terminal}.json`)

    fs.writeFile(routeFilePath, JSON.stringify(result), (err) => {
      if (err) {
        throw err
      }
      console.log('写入成功')
    })
  }

  private getDirPath(dirPath: string) {
    const dirname = path.dirname(dirPath)
    const result = this.replaceRoute(dirname)
    return result
  }

  private isAccess(validatePath: string) {
    try {
      fs.accessSync(validatePath, fs.constants.F_OK)
      return true
    } catch (err) {
      return false
    }
  }

  private parseRoutePath(modulePaths: string[], routerConfig: any) {
    const routes: RouteModule[] = []

    const btnPathnameList = ['add', 'detail', 'edit']

    for (const p of modulePaths) {
      const dirname = path.dirname(p)
      const routeKey = this.getDirPath(p)
      // 登录页不算
      if (
        routeKey === '/user' ||
        routeKey.startsWith('/user/') ||
        routeKey === '/404' ||
        routeKey === '/403' ||
        routeKey === '/500'
      ) {
        continue
      }
      const route: RouteModule = {
        path: routeKey,
        buttons: [],
        config: routerConfig[routeKey] ? { ...routerConfig[routeKey].view } : {},
      }

      btnPathnameList.forEach((name) => {
        const btnPathName = {
          add: '新增',
          edit: '编辑',
          detail: '详情',
        }
        const btnPath = path.resolve(dirname, name)
        const btnPathWithExt = this.isAccess(`${btnPath}.ts`) ? `${btnPath}.ts` : `${btnPath}.tsx`

        if (this.isAccess(btnPathWithExt)) {
          const btnRoutePath = this.replaceRoute(btnPath)
          route.buttons.push({
            name: btnPathName[name],
            path: btnRoutePath,
            code: btnRoutePath,
            config: routerConfig[routeKey] ? { ...routerConfig[routeKey][name] } : {},
          })
        }
      })

      routes.push(route)
    }

    return routes
  }
}

new MenuFactory()
