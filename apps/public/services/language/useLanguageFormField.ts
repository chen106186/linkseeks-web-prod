import { useEffect } from 'react'
import { Form, FormInstance } from '@linkseeks/ui'

const defaultDataSource = [
  {
    language: 'zh-CN',
    value: '',
  },
  {
    language: 'en-US',
    value: '',
  },
  {
    language: 'ko-KR',
    value: '',
  },
]
/**
 * 国际化字段所用的初始化hook
 */
const useLanguageFormField = (watchKey: string, formInstance: FormInstance, resetDataSource?: any[]) => {
  const languageValue = Form.useWatch(watchKey, formInstance)
  useEffect(() => {
    if (!languageValue || languageValue.length === 0) {
      const dataSource = resetDataSource ? resetDataSource : defaultDataSource
      formInstance.setFieldValue(watchKey, dataSource)
    }
  }, [languageValue, formInstance, resetDataSource])
}

export default useLanguageFormField
