import { showToast, hideToast } from '@tarojs/taro'

class Toast {
  static show(options: Taro.showToast.Option) {
    return showToast(options)
  }

  static hide(options: Taro.hideToast.Option) {
    return hideToast(options)
  }
}

export default Toast
