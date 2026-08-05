import React, { PropsWithChildren } from 'react'
import { Provider } from 'mobx-react'
import { IEvaluationModule } from '@/module/evaluationModule'

// import { ProductContext } from '@/pages/commodity/products/addProducts';

/**
 *
 * mobx使用说明
 * @observable 只有被这个装饰后才能监听数据变化
 * @computed 是根据@observable的数据计算属性
 * @action 只能是同步处理数据，不能异步
 * @action.bound 可以保证装饰的函数内部this永远指向当前store
 * runInAction 是在action中做异步处理时需要调用的
 *
 * 官方文档：https://mobx.js.org/
 * 中文文档：https://cn.mobx.js.org/
 *
 *
 */

export interface IStore {
  EvaluationModule: IEvaluationModule
}

export const store = {}

const MobxProvider: React.FC<PropsWithChildren<{}>> = (props) => {
  return <Provider {...store}>{props.children}</Provider>
}

export default MobxProvider
