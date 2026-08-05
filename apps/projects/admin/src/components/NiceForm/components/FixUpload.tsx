/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-01 17:32:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-02 09:56:25
 * @Description: 默认带上 accessToken 的 AntUpload
 */
import React from 'react'
import { authService } from '@apps/services'
import AntUpload from './AntUpload'

const FixUpload = (formilyProps) => {
  const { props, ...restProps } = formilyProps
  const { accessToken } = authService.getAuth() || {}
  const mergeProps = Object.assign({}, restProps, {
    props: {
      ...props,
      'x-component-props': {
        ...(props['x-component-props'] || {}),
        headers: {
          accessToken,
        },
      },
    },
  })
  return <AntUpload {...mergeProps} />
}

FixUpload.isFieldComponent = true

export default FixUpload
