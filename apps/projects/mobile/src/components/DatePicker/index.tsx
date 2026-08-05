import React, { useEffect, useState } from 'react'
import { useMobileIntl } from '@apps/locales'
import { PickerView } from '@apps/mobile-ui'

interface IPorps {
  children?: React.ReactNode
  mode?: 'year' | 'month' | 'day'
  start?: number
  end?: number
  value?: string
  onChange?: (value: string) => void
}

const DatePicker: React.FC<IPorps> = (props) => {
  const [dateArray, setDateArray] = useState<any[]>([])
  const [arrValue, setArrValue] = useState<Array<string | null>>([])
  const { mode = 'day', start = 2000, end = 2030, onChange } = props
  const translate = useMobileIntl()

  useEffect(() => {
    // 获取当前年份和月份
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1 // 注意：月份从 0 开始
    const currentDay = new Date().getDate()
    const month = currentMonth < 10 ? '0' + currentMonth : currentMonth
    const day = currentDay < 10 ? '0' + currentDay : currentDay

    if (mode === 'year') {
      setArrValue([String(currentYear)])
    } else if (mode === 'month') {
      setArrValue([String(currentYear), String(month)])
    } else {
      setArrValue([String(currentYear), String(month), String(day)])
    }

    const initDateArray = () => {
      const years: string[] = []
      let months: string[] = []
      const days: string[] = []
      let dataAyyra: Array<string[]> = []

      for (let i = start; i <= end; i++) {
        years.push(i + '')
        dataAyyra = [years]
      }

      if (mode === 'day' || mode === 'month') {
        // 构造月份范围
        for (let i = 1; i <= 12; i++) {
          months.push((i < 10 ? '0' : '') + i)
        }
        dataAyyra = [years, months]
      }

      if (mode === 'day') {
        // 构造天数范围（假设每个月都有 31 天）
        for (let i = 1; i <= 31; i++) {
          days.push((i < 10 ? '0' : '') + i)
          dataAyyra = [years, months, days]
        }
      }
      // 更新日期数据
      setDateArray(dataAyyra)
    }

    initDateArray()
  }, [])

  const handlePickerChange = (val: Array<string | null>) => {
    setArrValue(val)
  }

  const handleConfirm = (value: string[]) => {
    let val = ''
    switch (mode) {
      case 'year':
        val = value[0]
        break
      case 'month':
        val = `${value[0]}-${value[1]}`
        break
      case 'day':
        val = `${value[0]}-${value[1]}-${value[2]}`
        break
      default:
        break
    }

    onChange?.(val)
  }

  return (
    <PickerView
      cancelText={translate('mobile.common.cancel')}
      submitText={translate('mobile.common.confirm')}
      columns={dateArray}
      value={arrValue}
      onConfirm={handleConfirm}
      onChange={(val) => {
        handlePickerChange(val)
      }}
    >
      {props.children}
    </PickerView>
  )
}

export default DatePicker
