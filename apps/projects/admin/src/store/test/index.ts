import { action, computed, observable, runInAction } from 'mobx'
import { ITestModule } from '@/module/testModule'

const demoAsync = (): Promise<string[]> =>
  new Promise((resolve) =>
    setTimeout(() => resolve(['富强、民主、文明、和谐', '自由、平等、公正、法治', '爱国、敬业、诚信、友善']), 2000),
  )

class TestStore implements ITestModule {
  @observable public testList: string[] = ['列表一', '列表二', '列表三']
  @observable public testText: string = '这是测试mobx文本'
  @observable public testNumber: number = 110

  // 外部直接调用, 生成字符串, 类似vue中的computed
  @computed
  public get printInfo(): string {
    return `hello, ${this.testText}, Test data is ${this.testNumber}`
  }

  /** 定义动作区块，外部调用，改变对应的状态 **/
  // 可以改变存的testText值
  @action.bound
  public setText(testText: string) {
    this.testText = testText
  }

  @action.bound
  public setNumber(testNumber: number) {
    this.testNumber = testNumber
  }

  // 异步修改数据, 需要使用bound，保持this指向当前store
  @action.bound
  public async getAsyncInfo() {
    try {
      const result = await demoAsync()
      runInAction(() => {
        this.testList = result
      })

      return result
    } catch (error) {
      return error
    }
  }
}

export default TestStore
