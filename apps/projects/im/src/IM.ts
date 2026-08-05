import TUIChatEngine from '@tencentcloud/chat-uikit-engine'
import { getSupportTimGetUserSig } from '@apps/apis'
const SDKAppID = 1600097309
export const initIMSDK = async () => {
  try {
    const { data, code, message } = await getSupportTimGetUserSig({}, { noRedirectLogin: true })
    if (code === 1000) {
      const res = await TUIChatEngine.login({
        ...data,
        SDKAppID,
        userID: data.userId,
        useUploadPlugin: true,
      })
      console.log(res)
      return {
        ...res,
        code,
      }
    } else {
      return {
        code,
        message,
      }
    }
  } catch (err) {
    return err
  }
}
