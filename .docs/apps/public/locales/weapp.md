# 小程序国际化如何更新

1. 国际化文案都存放在 `apps/public/locales/mobile` 中，由于小程序体积限制，所以我们将国际化文案存放在 oss 上，并通过 i18n-next 的远程加载，进行 load。
2. 加载远程国际化文案的方法在 `apps/projects/mobile/src/app.tsx` 中，`OSS_DOMAIN` 是 oss 的链接常量， `/miniprogram/locales/${LOCAL_VERSION}/${lng[0]}/${ns[0]}.json` 是 oss 上的路径
3. 其中 LOCAL_VERSION 代表国际化的版本，我们默认使用了 v3-test， 若项目需要定制化，则可以在 oss 上创建对应的文件夹，并且将文件夹名改成对应的 LOCAL_VERSION
4. lng 代表所使用的语言， ns 则代表命名空间(这个我们可以不用动，默认使用 translate)

以上是知道我们项目国际化的基本信息是如何运作的，接下来如果需要更新

- `cd apps/projects/mobile`
- `pnpm createLocalesJSON` 这里会将所有的国际化文件，组合在一起生成出新的文件夹
- 可以看到 在 `apps/projects/mobile/scripts`中 有 v3-test 文件夹，里面的各种语言就是我们需要移动到 oss 的文件夹
- 接下来我们进入到 oss 界面，将 v3-test 里面的语言，按照目录结构 上传到 oss 上即可

总结一下

我们这里实际上是将 本地的国际化文件，进行生成组合成 各种语言的 json 文件，并上传到 oss。 而小程序在启动的时候，会去拉取 oss 的链接，下载国际化文件。
