import { action, computed, observable, runInAction } from 'mobx'



class OrderStore {
  @observable orderInfo = null

  @action.bound
  public getOrderInfo = (sessionKey) => {
    return new Promise((resolve) => {
      const sessionOrderInfo = sessionStorage.getItem(sessionKey)
      resolve(JSON.parse(sessionOrderInfo))
    })
  }

  @action.bound
  public clearOrderInfo = (sessionKey) => {
    this.orderInfo = null
    sessionStorage.removeItem(sessionKey)
  }
}

export default OrderStore
