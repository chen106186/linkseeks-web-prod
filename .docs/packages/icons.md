# Icons - 图标库

这里我们和腾讯的 Codesign 进行了打通，当 UI 同事更新 Codesign 的图标库时，我们会自动更新我们的图标库，这样就可以直接使用 Codesign 的图标库了。

## 如何更新图标库

1. 打开 Codesign 的图标库，点击 **下载图标字体**
2. 找到下载后的文件，有`iconfont.json`文件，将其复制到 packages/icons/assets 目录下
3. cd packages/icons
4. 运行 `pnpm script`
5. 新的图标库将会被生成到 packages/icons/src 目录下

## 如何使用

按照图标命名转化成驼峰即可

```ts
import { PlusIcon } from '@linkseeks/icons'

<PlusIcon>
```
