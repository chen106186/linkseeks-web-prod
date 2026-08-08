export interface IRoutes {
  routes: []
}

/**
 * @description 定义请求成功的接口模型
 * @author xjm
 * @date 2020-06-01
 * @export
 * @interface IRequestSuccess
 * @template T  data类型, 无法指定时可传入any
 */
export interface IRequestSuccess<T> {
  code: number
  data: T
  message: string
  time: number
}

/**
 * @todo
 * @description 定义请求失败时的接口模型
 * @author xjm
 * @date 2020-05-25
 * @export
 * @interface IRequestError
 */
export interface IRequestError extends Error {
  data?: any
  message: string
  time?: number
}
