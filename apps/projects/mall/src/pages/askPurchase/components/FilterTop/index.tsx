import React, { useState, useEffect } from 'react'
import { getWebIntl } from '@/utils/locales'
import cx from 'classnames'
import { CaretUpOutlined, CaretDownOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Checkbox } from 'antd'
import { useLocation } from 'react-router-dom'
import { LinkTo } from '@/utils'
import { changeURLArg, getQueryString, removeURLArg } from '@/utils/getUrlParam'
import styles from './index.module.less'

interface Props {
  totalPage?: number
  newPage?: number
  totalCount?: number
  fnChangePage?: Function
}

const FilterTop: React.FC<Props> = (props) => {
  const { totalPage = 1, newPage = 1, totalCount = 0, fnChangePage } = props
  const { pathname, search } = useLocation()
  const [newSelect, setNewSelect] = useState('0')
  const [unexpired, setUnexpired] = useState(true)
  const translate = getWebIntl()

  /**
   * 发布时间修改url
   */
  const fnChangeTimeUrl = (descSelect: string) => {
    if (!descSelect) {
      return
    }
    const url = `${pathname}${search}`

    LinkTo(changeURLArg(url, 'Reputation', descSelect + ''))
  }

  /**
   * 修改发布时间
   */
  const handleSort = () => {
    console.log(newSelect)
    let descSelect = ''
    if (newSelect == '0') {
      descSelect = '3'
    } else if (newSelect === '3') {
      descSelect = '4'
    } else if (newSelect === '4') {
      descSelect = '3'
    }
    fnChangeTimeUrl(descSelect)
    setNewSelect(descSelect)
  }

  const judgeIsActive = (type: number) => {
    if (Number(newSelect) === type) {
      return true
    }
    return false
  }

  /**
   *
   * @param e 修改是否过期
   */
  const fnChangeUnexpored = (e: any) => {
    let url = `${pathname}${search}`
    setUnexpired(e)

    // 添加userAction参数标记用户已手动操作
    url = changeURLArg(url, 'userAction', '1')

    if (e) {
      LinkTo(changeURLArg(url, 'Unexpired', '1'))
    } else {
      LinkTo(removeURLArg(url, 'Unexpired'))
    }
  }

  /**
   * 修改页码
   */
  const handlePageChange = (type: string) => {
    if (fnChangePage) {
      fnChangePage(type)
    }
  }

  useEffect(() => {
    const unexpiredParam = getQueryString('Unexpired', search)
    const userActionParam = getQueryString('userAction', search)

    // 如果用户还没有手动操作过(没有userAction参数)，且URL中没有Unexpired参数，则默认添加Unexpired=1
    if (!userActionParam && !unexpiredParam) {
      const url = `${pathname}${search}`
      LinkTo(changeURLArg(url, 'Unexpired', '1'))
      setUnexpired(true)
    } else if (unexpiredParam) {
      // 如果URL中有Unexpired参数，根据参数值设置状态
      setUnexpired(unexpiredParam === '1')
    } else {
      // 如果没有Unexpired参数但有userAction参数，说明用户操作过但取消了，设置为false
      setUnexpired(false)
    }

    const Reputation = getQueryString('Reputation', search)
    if (Reputation) {
      setNewSelect(Reputation)
    } else {
      setNewSelect('0')
    }
  }, [search, pathname])

  return (
    <div className={styles.tool_bar}>
      <div className={styles.tool_bar_left}>
        <div className={styles.tool_bar_filter_item} onClick={() => handleSort()}>
          <span className={judgeIsActive(3) || judgeIsActive(4) ? styles.active : ''}>
            {translate('web.resource.mall.fabushijian')}
          </span>
          <div className={styles.price_filter_box}>
            <CaretUpOutlined translate={undefined} className={cx(styles.icon, judgeIsActive(4) ? styles.active : '')} />
            <CaretDownOutlined
              translate={undefined}
              className={cx(styles.icon, judgeIsActive(3) ? styles.active : '')}
            />
          </div>
        </div>
        <div className={styles.tool_bar_filter_item}>
          <Checkbox
            checked={unexpired}
            onChange={(e) => {
              fnChangeUnexpored(e.target.checked)
            }}
          >
            {translate('web.resource.mall.zhikanweiguoqi')}
          </Checkbox>
        </div>
      </div>
      <div className={styles.tool_bar_right}>
        <div className={styles.count}>
          <span>{translate('web.common.gong')}</span>
          <label>{totalCount}</label>
          <span>{translate('web.resource.mall.tiaoxinxi')}</span>
        </div>
        <div className={styles.pageBox}>
          <LeftOutlined
            translate={undefined}
            className={cx(styles.pageBoxIcon)}
            onClick={() => {
              if (newPage > 1) {
                handlePageChange('down')
              }
            }}
          />
          <div className={styles.pageBox_main}>
            <span>{newPage}</span>
            <span>/</span>
            <span>{Math.ceil(totalPage) || 1}</span>
          </div>
          <RightOutlined
            translate={undefined}
            className={cx(styles.pageBoxIcon, newPage >= totalPage ? styles.disabled : '')}
            onClick={() => {
              if (newPage < totalPage) {
                handlePageChange('add')
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default FilterTop
