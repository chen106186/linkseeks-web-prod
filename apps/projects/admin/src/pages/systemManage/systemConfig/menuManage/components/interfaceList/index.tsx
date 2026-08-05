import { Button } from '@linkseeks/ui'
import style from './index.less'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { useMenuContext } from '../../services/context'

const InterfaceList = forwardRef((_, ref) => {
  const { interfaceList } = useMenuContext()

  return (
    <div className={style['list']}>
      {interfaceList.length === 0 && <div>暂无数据</div>}
      {interfaceList.map((v) => (
        <div className={style['item']} key={v.path}>
          <div>{v.path}</div>
        </div>
      ))}
    </div>
  )
})

export default InterfaceList
