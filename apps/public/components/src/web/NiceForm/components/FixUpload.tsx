/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-01 17:32:51
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-09-02 09:56:25
 * @Description: 默认带上 token 的 AntUpload
 */
import React from 'react'
import AntUpload from './AntUpload'

const getAuth = () => {
  try {
    const localAuth = window.localStorage.getItem('auth')
    return localAuth ? JSON.parse(localAuth) : null
  } catch (error) {
    return {}
  }
}

const FixUpload = (formilyProps: any) => {
  const { props, ...restProps } = formilyProps
  const { accessToken } = getAuth() || {}
  const mergeProps = Object.assign({}, restProps, {
    props: {
      ...props,
      headers: {
        accessToken,
      },
    },
  })
  return <AntUpload {...mergeProps} />
}

FixUpload.isFieldComponent = true

export default FixUpload
