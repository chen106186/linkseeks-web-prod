import { getStorage, removeStorage, setStorage } from './taro'

export const setAsyncStorage = async (key: string, value: string | object) => {
  try {
    const storageValue = typeof value === 'object' ? JSON.stringify(value) : value
    await setStorage({
      key,
      data: storageValue,
    })
    return null
  } catch (err) {
    return err
  }
}

export const getAsyncStorage = async (key: string): Promise<any> => {
  try {
    const { data: storageValue, errMsg } = await getStorage({
      key,
    })
    return JSON.parse(storageValue as string)
  } catch (err) {
    return null
  }
}

export const removeAsyncStorage = async (key: string) => {
  try {
    await removeStorage({
      key,
    })
  } catch (e) {
    // remove error
  }
}
