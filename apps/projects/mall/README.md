### 商城项目（包含联营商城和自营商城）

#### 项目部署

1.构建项目（dist 目录）

```
执行 pnpm build
```

2.复制构建产物目录（dist）到服务器

3.在服务器复制过来的 dist 目录下安装依赖

```
pnpm install --prod --registry=https://registry.npmmirror.com/
```

4.执行命令，运行项目

```
pnpm prod
```

##### 国际化使用方法

```
import { getWebIntl } from '@/utils/locales'

const translate = getWebIntl()

translate('xxxxxx')
```
