import { ArrowLeftOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { history } from '@linkseeks/router-manager'

interface PageHeaderProps {
  title?: JSX.Element | string
  layout?: 'vertical' | 'inline'
  children?: JSX.Element | React.ReactNode | string
  extraRight?: JSX.Element | React.ReactNode | string
}

function PageHeader({ title, layout = 'vertical', children, extraRight }: PageHeaderProps) {
  const [isFixed, setIsFixed] = useState<boolean>(false)

  useEffect(() => {
    window.addEventListener('scroll', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const onScroll = () => {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
    let floors = document.querySelectorAll('.page_heder_content')
    floors.forEach((floor: any, index: any) => {
      if (scrollTop > 50) {
        setIsFixed(true) //top-0
      } else {
        setIsFixed(false) // top-23
      }
    })
  }

  return (
    <div
      className={classNames({
        'page-header p-8 bg-white fixed z-30': true,
        'top-0': isFixed,
      })}
      style={{
        width: document.querySelector('.ant-layout-header').clientWidth,
      }}
    >
      <div className="flex page_header_default">
        <div className="flex flex-1 items-center">
          <ArrowLeftOutlined onClick={() => history.goBack()} className="mr-4" />
          <div className="text-3xl font-bold">{title}</div>
        </div>
        <div className="flex flex-1 flex-row-reverse">{extraRight}</div>
      </div>
      <div className="page_heder_content">{children}</div>
    </div>
  )
}

export default PageHeader
