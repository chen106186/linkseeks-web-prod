import { cloneDeep, flow } from 'lodash'

interface Flow {
  name: string
  action(...payload: any): any
  desc?: string
}

/**
 * 一个简单的流程控制
 */
export class FlowDispatch {
  private flows: Flow[] = []
  private dispatchIndex = 0
  originData: any
  dispatchData: any

  constructor(initPayload) {
    this.originData = cloneDeep(initPayload)
    this.dispatchData = cloneDeep(initPayload)
  }
  // 注册数据处理流程
  register(flow: Flow | Flow[]) {
    if (Array.isArray(flow)) {
      this.flows.push(...flow)
    } else {
      this.flows.push(flow)
    }
  }

  // 开始执行
  async start() {
    const flow = this.flows[this.dispatchIndex]
    if (flow) {
      if (isAsyncFunction(flow.action)) {
        return await this.run(flow)
      } else {
        return this.run(flow)
      }
    } else {
      return null
    }
  }

  private async run(flow: Flow) {
    try {
      const next = await flow.action.call(this, this.dispatchData)
      this.dispatchIndex++
      if (this.dispatchIndex === this.flows.length) {
        return this.dispatchData
      }
      return this.start()
    } catch (error: any) {
      const errorResult = {
        errorMsg: error?.message || error,
        stack: error?.stack,
        name: flow.name,
        desc: flow.desc,
      }
      this.handleError(errorResult)
      return this.dispatchData
    }
  }

  // 统一异常处理
  private handleError(error) {
    throw error
  }
}

function isAsyncFunction(func) {
  const funcString = func.toString()
  return /\basync\b/.test(funcString)
}
