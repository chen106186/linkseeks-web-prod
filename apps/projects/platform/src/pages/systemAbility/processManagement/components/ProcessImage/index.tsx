import React from 'react'
import { Empty, Form, Image } from 'antd'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'

type PropsType = {
  dataSource: any[] // 流程选择的主数据
  processKey?: string // dataSource的流程主键（后端基础流程数据的字段没统一好！有的叫 baseProcessId 有的叫 baseProcessid， 所以这里做一下兼容）
}

export default function ProcessImage({ dataSource, processKey = 'baseProcessId' }: PropsType) {
  const intl = useIntl()

  // 但是表单的 baseProcessId 字段都是统一叫 baseProcessId
  return (
    <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.baseProcessId !== curValues.baseProcessId}>
      {({ getFieldValue }) => {
        const processImage = dataSource.find(
          (item) => item[processKey] === getFieldValue('baseProcessId'),
        )?.processImage
        return (
          <div>
            {processImage ? (
              <Image width="100%" height={192} src={processImage} style={{ borderRadius: 8, objectFit: 'contain' }} />
            ) : (
              <div className={styles['empty']}>
                {getFieldValue('baseProcessId')
                  ? intl.formatMessage({ id: 'processRuleSetting.liuchengtubucunzai', defaultMessage: '流程图不存在' })
                  : `${intl.formatMessage({ id: 'common.select', defaultMessage: '请选择' })}${intl.formatMessage({
                      id: 'processRuleSetting.liucheng',
                      defaultMessage: '流程',
                    })}`}
              </div>
            )}
          </div>
        )
      }}
    </Form.Item>
  )
}
