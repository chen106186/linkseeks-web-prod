# 瓴犀小程序&h5

## src 下各个目录的内容和使用方式

- assets 存放静态资源,如图片，字体等，图片需要存放到 oss，放在这里只做对比用
- components 存放公共的业务组件
- config 路由配置文件 h5 兼容使用
- constants 存放常量，已复制 app 中的内容
- hooks 复用公共逻辑
- locales 国际化文件
- packages 分包页面
- pages 页面
- store 和 app 使用一致
- styles 注意页面中的样式文件，尽量都引入该文件下的东西，使用 variables 进行变量化
- types 公共类型
- utils 工具方法

## 关于如何新增路由

只需直接在 src/routes/index.ts 中新增， 以 key: value 的形式 key 为菜单的唯一标识，将用于后续做权限控制 value 为真实的菜单跳转路径

## 关于国际化

- 由于目前有多个语言包，如果全部当成静态资源打包的话会造成主包的体积超出了 2M，所以将本地的语言包进行转换 JSON 文件存放于 oss(临时处理方式)

- i18n 国际化使用方法

```ts
import { useIntl } from '@linkseeks/i18n'
const intl = useIntl()

console.log(intl.formatMessage('test', defaultMessage: 'hi')) // hi
```

### 语言包转 JSON

具体实现可以查看 `outputJson.ts` 里的代码:

执行：

```sh
ts-node ./scripts/outputJson.ts
```

会在`scripts` 下得到一个`version`值命名的文件夹，到此语言包转 json 文件的步骤就完成了

- 上传完成后删除该文件夹即可，无需提交到代码仓库

<br/>

### 上传语言包到 oss

已经在`scripts -> uploadLocales.sh`写好执行代码了

- 注意，执行该脚本需要在本地安装`ossutil`工具,目前该上传语言到 oss 的脚本只支持`ossutilmac64`

- 关于命令行 ossutil 可以[看我](https://www.alibabacloud.com/help/zh/object-storage-service/latest/getting-started-ossutil)

- 需要先在本地创建配置 `.ossutilconfig`文件，运行下面命令，根据提示填入需要的资料即可

```sh
ossutilmac64 config
```

执行:

```sh
sh ./scripts/uploadLocales.sh ${version}
```

这里的 version 是指转 json 的 version 值

然后就会出现在`http://lingxi-mini.oss-cn-hangzhou.aliyuncs.com/miniprogram/locales`文件夹内

到此上传语言包至 oss 步骤完成

### 关于 oss

如果项目无需执行 oss 相关操作，请按如下步骤操作

- 删除`./scripts/uploadKey`

- 删除`./scripts/ossconfig`

- 删除`./scripts/preview.sh`

- 删除`./scripts/upload.sh`

- 删除`./scripts/uploadLocales.sh`

如果项目需执行 oss 相关操作，请按如下步骤操作

- 修改`./scripts/ossconfig`中相关值

- 修改`./scripts/preview.sh`中相关值

- 修改`./scripts/uploadLocales.sh`中相关值
