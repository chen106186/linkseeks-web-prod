/**
 * 单选框结构公共弹窗
 */
import React, { useRef, useState, useCallback, forwardRef, memo, useImperativeHandle } from 'react'
import type { RadioChangeEvent } from 'antd'
import { Radio, Modal } from 'antd'
import CommonDrawer from '@/components/CommonDrawer'
import { useIntl } from '@linkseeks/i18n'

export interface CommonRadioDrawerType {
  onOk?: (values: any, setCache?: boolean) => void
  fieldCode?: string
  selectCache?: any[]
  dataSource?: any[]
  fetchApi?: Function
  fetchParams?: any
  title: string
  idKey?: string
  labelKey?: string
  disabled?: boolean
}

const CommonCheckboxDrawer = (props: CommonRadioDrawerType, ref) => {
  const intl = useIntl()
  const {
    onOk,
    fieldCode,
    selectCache,
    dataSource,
    fetchApi,
    fetchParams = {},
    title,
    idKey = 'id',
    labelKey = 'name',
    disabled,
  } = props

  const [list, setList] = useState<any[]>([])
  const [checkedKeys, setCheckedKeys] = useState<any[]>([])

  const drawRef = useRef<any>()
  const isValuesChangeRef = useRef<boolean>(false)

  const handleOk = useCallback(() => {
    isValuesChangeRef.current = false
    onOk?.(checkedKeys.map((item) => ({ ...item, value: item.value || item[fieldCode] })))
  }, [checkedKeys])

  const getRadioList = () => {
    fetchApi?.(fetchParams, { ctlType: 'none' }).then(({ code, data }) => {
      if (code === 1000) {
        setList(data)
      }
    })
  }

  const handleShow = () => {
    if (fetchApi) {
      getRadioList()
    } else {
      if (dataSource) {
        setList(dataSource)
      }
    }
  }

  useImperativeHandle(ref, () => ({
    show(flag: boolean, params = {}, data) {
      drawRef?.current?.show(flag, params)
      if (data) {
        setCheckedKeys(data?.selectData || [])
      }
    },
    setKeys(keys: any[]) {
      setCheckedKeys(keys || [])
    },
  }))

  return (
    <CommonDrawer
      ref={drawRef}
      title={title}
      width={600}
      destroyOnClose
      onOk={handleOk}
      onShow={handleShow}
      onCancel={(fnClose) => {
        if (isValuesChangeRef.current) {
          Modal.confirm({
            content: intl.formatMessage({
              id: 'common.close.tips',
              defaultMessage: '您还有未保存的内容，是否确定要关闭？',
            }),
            onOk: () => {
              isValuesChangeRef.current = false
              fnClose()
            },
          })
          return
        }
        fnClose()
      }}
    >
      <Radio.Group
        disabled={disabled}
        className="use-radio-button-column"
        value={checkedKeys[0]?.id}
        onChange={(e: RadioChangeEvent) => {
          isValuesChangeRef.current = true
          const _id = e.target.value
          const findOne = list.find((_i) => _i[idKey] === _id)
          setCheckedKeys([{ id: _id, value: findOne?.[fieldCode], label: findOne?.[labelKey] || '' }])
        }}
      >
        {list.map((_item) => (
          <Radio key={_item[idKey]} value={_item[idKey]} disabled={selectCache.includes(_item[idKey])}>
            {_item[labelKey]}
          </Radio>
        ))}
      </Radio.Group>
    </CommonDrawer>
  )
}

export default memo(forwardRef(CommonCheckboxDrawer))
