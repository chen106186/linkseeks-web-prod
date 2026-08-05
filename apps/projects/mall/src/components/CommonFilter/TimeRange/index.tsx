import React, { useEffect } from 'react'
import { DatePicker, message, Form } from 'antd'
import moment from 'moment'
import { LAYOUT_TYPE } from '@/types/global'
import { changeURLArg, getQueryString, removeURLArg } from '@/utils/getUrlParam'
import { getWebIntl } from '@/utils/locales'
import FilterBox from '../FilterBox'
import styles from './index.less'
import { FILTER_PARAM } from '../types'
import { LinkTo } from '@/utils'

interface PricePropsType {
  innerValue: FILTER_PARAM | undefined
  /**
   * 过滤项改变触发事件
   */
  onChange?: (values: FILTER_PARAM) => void
  pathname?: string
  search?: string
}

const TimeRange: React.FC<PricePropsType> = (props) => {
  const { pathname, innerValue, search } = props
  const translate = getWebIntl()
  const [form] = Form.useForm()

  useEffect(() => {
    if (innerValue) {
      if (innerValue.startTime) {
        form.setFieldsValue({
          startTime: moment(innerValue.startTime),
        })
      } else {
        form.setFieldsValue({
          startTime: undefined,
        })
      }

      if (innerValue.endTime) {
        form.setFieldsValue({
          endTime: moment(innerValue.endTime),
        })
      } else {
        form.setFieldsValue({
          endTime: undefined,
        })
      }
    } else {
      form.resetFields()
    }
  }, [innerValue])

  /**
   * 筛选时间
   */
  const fnChangeUrl = (startTime: string, endTime: string) => {
    let url = `${pathname}${search}`
    let hasBo = false
    if (startTime) {
      if (search) {
        if (search.indexOf('startTime') > -1) {
          url = changeURLArg(url, 'startTime', startTime)
        } else {
          url = url + `&startTime=${startTime}`
        }
      } else {
        url = url + `?startTime=${startTime}`
        hasBo = true
      }
    } else {
      if (search && search.indexOf('startTime') > -1) {
        url = removeURLArg(search, 'startTime')
      }
    }
    if (endTime) {
      if (search) {
        if (search.indexOf('endTime') > -1) {
          url = changeURLArg(url, 'endTime', endTime)
        } else {
          url = url + `&endTime=${endTime}`
        }
      } else if (hasBo) {
        url = url + `&endTime=${endTime}`
      } else {
        url = url + `?endTime=${endTime}`
      }
    } else {
      if (search && search.indexOf('endTime') > -1) {
        url = removeURLArg(search, 'endTime')
      }
    }
    LinkTo(url)
  }

  /**
   * 比较时间的大小
   */
  const compareTime = (startTime: string, endTime: string): boolean => {
    const start = new Date(startTime).getTime()
    const end = new Date(endTime).getTime()
    return end >= start
  }

  /**
   * 确定时间
   */
  const fnDetermine = () => {
    let descObj = form.getFieldsValue()
    let startTime = ''
    if (descObj.startTime) {
      startTime = moment(descObj.startTime).format('YYYY-MM-DD')
    }
    let endTime = ''
    if (descObj.endTime) {
      endTime = moment(descObj.endTime).format('YYYY-MM-DD')
    }
    if (startTime && endTime) {
      let bo = compareTime(startTime, endTime)
      if (!bo) {
        message.error(translate('web.resource.mall.jieshushijianbunengxioayukaishishijian'))
        return
      }
    }
    fnChangeUrl(startTime, endTime)
  }

  return (
    <FilterBox title={translate('web.resource.mall.fabushijian')}>
      <Form className={styles.filter_time} form={form}>
        <div className={styles.filter_time_left}>
          <div className={styles.filter_time_warp}>
            <Form.Item name="startTime">
              <DatePicker style={{ width: '100%' }} placeholder={translate('web.resource.mall.xuanzekaishishijian')} />
            </Form.Item>
          </div>
          <div className={styles.filter_time_warp}>
            <Form.Item name="endTime">
              <DatePicker style={{ width: '100%' }} placeholder={translate('web.resource.mall.xuanzejieshushijian')} />
            </Form.Item>
          </div>
        </div>
        <div className={styles.filter_time_right} onClick={fnDetermine}>
          {translate('web.common.confirm')}
        </div>
      </Form>
    </FilterBox>
  )
}

export default TimeRange
