import { Modal } from "antd"
import { ReactNode, useCallback, useEffect, useState } from "react"

export interface leaveOptions {
  title?: ReactNode,
  onSave: any,
  onModalOk(resolve: any),
  onModalCancel(reject: any),
}
/**
 * 对即将离开某个操作时， 发出提示弹窗
 */
export const useLeavePage = (options: leaveOptions): [React.Dispatch<React.SetStateAction<boolean>>, any] => {
  const { title, onSave, onModalOk, onModalCancel } = options
  const [saveStatus, setSaveStatus] = useState<boolean>(true)

  const validateSaveStatus = useCallback(() => {
    if (saveStatus) {
      return Promise.resolve()
    } else {
      return new Promise((resolve, reject) => {
        Modal.confirm({
          content: title || '确认要离开当前页面吗,您提交的数据尚未保存',
          onOk() {
            onModalOk(resolve)
          },
          onCancel() {
            onModalCancel(reject)
          }
        })
      })
    }
  }, [saveStatus])

  return [setSaveStatus, validateSaveStatus]
}
