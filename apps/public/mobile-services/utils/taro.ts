import {
  getApp as getAppTaro,
  getSystemInfoSync as getSystemInfoSyncTaro,
  getSystemInfo as getSystemInfoTaro,
  getEnv as getEnvTaro,
  getImageInfo as getImageInfoTaro,
  getNetworkType as getNetworkTypeTaro,
  ENV_TYPE,
  getMenuButtonBoundingClientRect as getMenuButtonBoundingClientRectTaro,
  showToast as showToastTaro,
  hideToast as hideToastTaro,
  showLoading as showLoadingTaro,
  hideLoading as hideLoadingTaro,
  createAnimation as createAnimationTaro,
  canvasToTempFilePath as canvasToTempFilePathTaro,
  createSelectorQuery as createSelectorQueryTaro,
  nextTick as nextTickTaro,
  pxTransform as pxTransformTaro,
  setNavigationBarTitle as setNavigationBarTitleTaro,
  setNavigationBarColor as setNavigationBarColorTaro,
  showModal as showModalTaro,
  setClipboardData as setClipboardDataTaro,
  previewImage as previewImageTaro,
  login as loginTaro,
  requestPayment as requestPaymentTaro,
  getCurrentInstance as getCurrentInstanceTaro,
  getCurrentPages as getCurrentPagesTaro,
  navigateBack as navigateBackTaro,
  switchTab as switchTabTaro,
  reLaunch as reLaunchTaro,
  redirectTo as redirectToTaro,
  navigateTo as navigateToTaro,
  preload as preloadTaro,
  navigateToMiniProgram as navigateToMiniProgramTaro,
  onAppShow as onAppShowTaro,
  onAppHide as onAppHideTaro,
  offAppShow as offAppShowTaro,
  offAppHide as offAppHideTaro,
  setStorage as setStorageTaro,
  setStorageSync as setStorageSyncTaro,
  getStorage as getStorageTaro,
  getStorageSync as getStorageSyncTaro,
  removeStorage as removeStorageTaro,
  removeStorageSync as removeStorageSyncTaro,
  makePhoneCall as makePhoneCallTaro,
  scanCode as scanCodeTaro,
  uploadFile as uploadFileTaro,
  canIUse as canIUseTaro,
  getUpdateManager as getUpdateManagerTaro,
  getFileSystemManager as getFileSystemManagerTaro,
  arrayBufferToBase64 as arrayBufferToBase64Taro,
  createCanvasContext as createCanvasContextTaro,
  getSetting as getSettingTaro,
  openSetting as openSettingTaro,
  authorize as authorizeTaro,
  saveImageToPhotosAlbum as saveImageToPhotosAlbumTaro,
  useShareAppMessage as useShareAppMessageTaro,
  useRouter as useRouterTaro,
  useDidShow as useDidShowTaro,
  useDidHide as useDidHideTaro,
  Events as EventsTaro,
  eventCenter as eventCenterTaro,
  getLocation as getLocationTaro,
  request as requestTaro,
  CanvasContext as CanvasContextTaro,
  exitMiniProgram as exitMiniProgramTaro,
  onNeedPrivacyAuthorization as onNeedPrivacyAuthorizationTaro,
  getPrivacySetting as getPrivacySettingTaro,
  openPrivacyContract as openPrivacyContractTaro,
  downloadFile as downloadFileTaro,
  openDocument as openDocumentTaro,
  useReady as useReadyTaro,
  usePullDownRefresh as usePullDownRefreshTaro,
  stopPullDownRefresh as stopPullDownRefreshTaro,
  chooseMessageFile as chooseMessageFileTaro,
  usePageScroll as usePageScrollTaro,
  enableAlertBeforeUnload as enableAlertBeforeUnloadTaro,
  disableAlertBeforeUnload as disableAlertBeforeUnloadTaro,
  getLaunchOptionsSync as getLaunchOptionsSyncTaro,
} from '@tarojs/taro'
import { MethodHandler } from './taroUtil'

// 获取到小程序全局唯一的 App 实例。
export const getApp = getAppTaro

// 系统信息
export const systemInfo = getSystemInfoSyncTaro()

// 获取系统信息异步接口
export const getSystemInfo = getSystemInfoTaro

// 获取当前运行环境
export const getEnv = getEnvTaro

// 获取系统信息同步接口
export const getSystemInfoSync = () => {
  const systemInfoSync = getSystemInfoSyncTaro()
  return systemInfoSync?.safeArea
    ? systemInfoSync
    : {
        ...systemInfoSync,
        safeArea: {
          bottom: 0,
        },
      }
}

export type SystemInfoSyncResult = Taro.getSystemInfoSync.Result

// 获取图片信息。网络图片需先配置download域名才能生效
export const getImageInfo = (options: Taro.getImageInfo.Option) => {
  // fix: 本地先暂时解决H5无法返回 path字段， 但实际上官方在3.7.x版本已经修复该问题
  // 后续可进一步升级 https://github.com/NervJS/taro/commit/3d4f6bdc81e6f8d7e5cbe2827d2d50ac1c82d5ca#diff-64e24dc6fdcbf73b5cdc1fa3fdab222b40de898cc6118a064e9c281b2e7a9059
  // 若升级后 则可去掉这个判断
  if (getEnvTaro() === ENV_TYPE.WEB) {
    const getBase64Image = (image: HTMLImageElement) => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const ctx = canvas.getContext('2d')
        ctx?.drawImage(image, 0, 0, image.width, image.height)
        return canvas.toDataURL('image/png')
      } catch (e) {
        console.error('getImageInfo:get base64 fail', e)
      }
    }
    const { src, success, fail, complete } = options

    const handle = new MethodHandler({ name: 'getImageInfo', success, fail, complete })
    return new Promise<Taro.getImageInfo.SuccessCallbackResult>((resolve, reject) => {
      const image = new Image()
      image.crossOrigin = ''
      image.onload = () => {
        handle.success(
          {
            width: image.naturalWidth,
            height: image.naturalHeight,
            path: getBase64Image(image) || src,
          },
          { resolve, reject },
        )
      }

      image.onerror = (e: any) => {
        handle.fail(
          {
            errMsg: e.message,
          },
          { resolve, reject },
        )
      }

      image.src = src
    })
  } else {
    return getImageInfoTaro(options)
  }
}

// 获取网络类型
export const getNetworkType = getNetworkTypeTaro

// 获取菜单按钮（右上角胶囊按钮）的布局位置信息。坐标信息以屏幕左上角为原点
export const getMenuButtonBoundingClientRect = () => {
  // fix: 由于h5下无法调用该方法，为兼容业务中使用，默认全部返回0
  if (getEnvTaro() === ENV_TYPE.WEAPP) {
    return getMenuButtonBoundingClientRectTaro
  } else {
    return {
      /** 下边界坐标，单位：px */
      bottom: 0,
      /** 高度，单位：px */
      height: 0,
      /** 左边界坐标，单位：px */
      left: 0,
      /** 右边界坐标，单位：px */
      right: 0,
      /** 上边界坐标，单位：px */
      top: 24,
      /** 宽度，单位：px */
      width: 0,
    }
  }
}

// 显示消息提示框
export const showToast = (option?: Taro.showToast.Option) => {
  const _option: any = Object.assign({ icon: 'none' }, option ?? {})
  showToastTaro(_option)
}

// 隐藏消息提示框
export const hideToast = hideToastTaro

// 显示 loading 提示框。需主动调用 Taro.hideLoading 才能关闭提示框
export const showLoading = showLoadingTaro

// 隐藏 loading 提示框
export const hideLoading = hideLoadingTaro

// 创建一个动画实例 animation。调用实例的方法来描述动画。最后通过动画实例的 export 方法导出动画数据传递给组件的 animation 属性
export const createAnimation = createAnimationTaro

// 把当前画布指定区域的内容导出生成指定大小的图片。在 draw() 回调里调用该方法才能保证图片导出成功
export const canvasToTempFilePath = canvasToTempFilePathTaro

// 返回一个 SelectorQuery 对象实例。在自定义组件或包含自定义组件的页面中，应使用 this.createSelectorQuery() 来代替
export const createSelectorQuery = createSelectorQueryTaro

// 延迟一部分操作到下一个时间片再执行。（类似于 setTimeout）
export const nextTick = nextTickTaro

// pxTransform
export const pxTransform = (size?: number, designWidth?: number | undefined) => {
  if (typeof size !== 'number') return size
  // TODO 由于微信小程序下有些地方没写 pxTransform 兼容，如果微信小程序下也改成 pxTransform 方式的话担心会有样式问题
  // 所以这里暂时只对 h5 处理成 pxTransform 兼容，WEAPP 下暂时不做处理，后续看情况调整
  if (getEnvTaro() === ENV_TYPE.WEAPP) {
    return size
  } else {
    return pxTransformTaro(size, designWidth)
  }
}

// 动态设置当前页面的标题
export const setNavigationBarTitle = setNavigationBarTitleTaro

// 设置页面导航条颜色
export const setNavigationBarColor = setNavigationBarColorTaro

// 显示模态对话框
export const showModal = showModalTaro

// 设置系统剪贴板的内容。调用成功后，会弹出 toast 提示"内容已复制"，持续 1.5s
export const setClipboardData = setClipboardDataTaro

// 在新页面中全屏预览图片。预览的过程中用户可以进行保存图片、发送给朋友等操作
export const previewImage = previewImageTaro

// 调用接口获取登录凭证（code）。通过凭证进而换取用户登录态信息，包括用户的唯一标识（openid）及本次登录的会话密钥（session_key）等
export const login = loginTaro

// 发起微信支付
export const requestPayment = requestPaymentTaro

// 获取小程序的 app、page 对象、路由参数等数据
export const getCurrentInstance = getCurrentInstanceTaro

// 获取当前页面栈。数组中第一个元素为首页，最后一个元素为当前页面
export const getCurrentPages = getCurrentPagesTaro

// 关闭当前页面，返回上一页面或多级页面。可通过 getCurrentPages 获取当前的页面栈，决定需要返回几层
export const navigateBack = navigateBackTaro

// 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
export const switchTab = switchTabTaro

// 关闭所有页面，打开到应用内的某个页面
export const reLaunch = reLaunchTaro

// 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
export const redirectTo = redirectToTaro

// 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
export const navigateTo = navigateToTaro

// 跳转预加载 API
export const preload = preloadTaro

// 打开另一个小程序
export const navigateToMiniProgram = navigateToMiniProgramTaro

// 监听小程序切前台事件。该事件与 App.onShow 的回调参数一致
export const onAppShow = onAppShowTaro

// 监听小程序切后台事件。该事件与 App.onHide 的回调时机一致
export const onAppHide = onAppHideTaro

// 取消监听小程序切前台事件
export const offAppShow = offAppShowTaro

// 取消监听小程序切后台事件
export const offAppHide = offAppHideTaro

// 将数据存储在本地缓存中指定的 key 中。会覆盖掉原来该 key 对应的内容
export const setStorage = setStorageTaro
export const setStorageSync = setStorageSyncTaro

// 从本地缓存中异步获取指定 key 的内容
export const getStorage = getStorageTaro
export const getStorageSync = getStorageSyncTaro

// removeStorage
export const removeStorage = removeStorageTaro
export const removeStorageSync = removeStorageSyncTaro

// 拨打电话
export const makePhoneCall = makePhoneCallTaro

// 调起客户端扫码界面，扫码成功后返回对应的结果
export const scanCode = scanCodeTaro

// 将本地资源上传到服务器。客户端发起一个 HTTPS POST 请求，其中 content-type 为 multipart/form-data
export const uploadFile = uploadFileTaro

// canIUse
export const canIUse = canIUseTaro

// getUpdateManager
export const getUpdateManager = getUpdateManagerTaro

// getFileSystemManager
export const getFileSystemManager = getFileSystemManagerTaro

// arrayBufferToBase64
export const arrayBufferToBase64 = arrayBufferToBase64Taro

// createCanvasContext
export const createCanvasContext = createCanvasContextTaro

// getSetting
export const getSetting = getSettingTaro

// openSetting
export const openSetting = openSettingTaro

// authorize
export const authorize = authorizeTaro

// saveImageToPhotosAlbum
export const saveImageToPhotosAlbum = saveImageToPhotosAlbumTaro

// useShareAppMessage
export const useShareAppMessage = useShareAppMessageTaro

// useRouter
export const useRouter = useRouterTaro

export const useDidShow = useDidShowTaro

export const useDidHide = useDidHideTaro

// Events
export const Events = EventsTaro

export const eventCenter = eventCenterTaro

// getLocation
export const getLocation = getLocationTaro

// request
export const request = requestTaro
export type CanvasContext = CanvasContextTaro

export const exitMiniProgram = exitMiniProgramTaro
// 微信小程序隐私相关
export const onNeedPrivacyAuthorization = onNeedPrivacyAuthorizationTaro || undefined
export const getPrivacySetting = getPrivacySettingTaro || undefined
export const openPrivacyContract = openPrivacyContractTaro || undefined

// 下载文件资源到本地
export const downloadFile = downloadFileTaro
// 新开页面打开文档
export const openDocument = openDocumentTaro

export const useReady = useReadyTaro

export const usePullDownRefresh = usePullDownRefreshTaro

export const stopPullDownRefresh = stopPullDownRefreshTaro

export const chooseMessageFile = chooseMessageFileTaro

export const usePageScroll = usePageScrollTaro

export const enableAlertBeforeUnload = enableAlertBeforeUnloadTaro

export const disableAlertBeforeUnload = disableAlertBeforeUnloadTaro

export const getLaunchOptionsSync = getLaunchOptionsSyncTaro
