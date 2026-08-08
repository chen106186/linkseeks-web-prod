/*
 * @Author: LeeJiancong
 * @Date: 2020-09-10 11:00:17
 * @LastEditors: LeeJiancong
 * @Copyright: 1549414730@qq.com
 * @LastEditTime: 2020-09-10 11:17:09
 */
/**
 * @description:  需求选择
 * @param {type}
 * @return {type}
 */
import React, { Component } from 'react'
import { Space, Radio, Tooltip } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
export interface plarms {
  platType: number //类型 1平台 2系统匹配 3会员选择
  changePlatform?: Function //事件
  disabled?: boolean
}
const intl = getIntl()

const PlatType: React.FC<plarms> = (props) => {
  return (
    <Space size={16}>
      <Radio.Group disabled={props.disabled} value={props.platType} onChange={(e) => props.changePlatform(e)}>
        <Radio value={1}>
          {intl.formatMessage({ id: 'transaction_components.fabuzhipingtai' })}
          <Tooltip title={intl.formatMessage({ id: 'transaction_components.xuqiufabuzhiqiyeshang' })}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Radio>
        <Radio value={2}>
          {intl.formatMessage({ id: 'transaction_components.xitongpipei' })}
          <Tooltip title={intl.formatMessage({ id: 'transaction_components.xitongtongguoxuqiudanpin' })}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Radio>
        <Radio value={3}>
          {intl.formatMessage({ id: 'transaction_components.zhidinghuiyuan' })}
          <Tooltip title={intl.formatMessage({ id: 'transaction_components.xuanzeyudangqianhuiyuanyou' })}>
            <QuestionCircleOutlined />
          </Tooltip>
        </Radio>
      </Radio.Group>
    </Space>
  )
}
PlatType.defaultProps = {
  platType: 1,
  disabled: false,
}
export default PlatType
