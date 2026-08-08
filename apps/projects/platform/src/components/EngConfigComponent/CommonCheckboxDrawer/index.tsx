/**
 * 多选框结构公共弹窗
 */
import React, { useRef, useState, useCallback, forwardRef, memo, useImperativeHandle } from 'react'
import { Checkbox, Modal } from 'antd'
import CommonDrawer from '@/components/CommonDrawer'
import cs from 'classnames'
import styles from './index.less'
import { CheckSquareFilled } from '@ant-design/icons'
import { useIntl } from '@linkseeks/i18n'

export interface CommonCheckboxDrawerType {
  onOk?: (values: any) => void
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

const CommonCheckboxDrawer = (props: CommonCheckboxDrawerType, ref) => {
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
  const [checkAll, setCheckAll] = useState(false)

  const drawRef = useRef<any>()
  const isValuesChangeRef = useRef<boolean>(false)

  const handleOk = useCallback(() => {
    isValuesChangeRef.current = false
    onOk?.(checkedKeys.map((item) => ({ id: item.id, value: item.value || item[fieldCode] })))
  }, [checkedKeys])

  const getCheckboxList = () => {
    fetchApi?.(fetchParams, { ctlType: 'none' }).then(({ code, data }) => {
      if (code === 1000) {
        setList(data)
      }
    })
  }

  const setCheckedInfo = (keys: any[]) => {
    setCheckedKeys(keys)
    const len = list.flatMap((item) =>
      selectCache.includes(item[idKey]) ? [] : [{ id: item[idKey], value: item[fieldCode] }],
    )?.length
    setCheckAll(len && len === keys.length)
  }

  const handleShow = () => {
    if (fetchApi) {
      getCheckboxList()
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
        setCheckedInfo(data?.selectData || [])
      }
    },
    setKeys(keys: any[]) {
      setCheckedInfo(keys || [])
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
      <Checkbox
        // indeterminate={indeterminate}
        disabled={selectCache.length === list.length || disabled}
        onChange={(e) => {
          isValuesChangeRef.current = true
          setCheckedKeys(
            e.target.checked
              ? list.flatMap((item) =>
                  selectCache.includes(item[idKey]) ? [] : [{ id: item[idKey], value: item[fieldCode] }],
                )
              : [],
          )
          setCheckAll(e.target.checked)
        }}
        checked={checkAll}
      >
        {intl.formatMessage({ id: 'common.text.all', defaultMessage: '全部' })}
      </Checkbox>
      <div className={styles.box}>
        {list.map((item) => (
          <div
            key={item[idKey]}
            className={cs(
              styles['box-item'],
              checkedKeys.some((i) => i.id === item[idKey]) && styles.checked,
              (selectCache.includes(item[idKey]) || disabled) && styles.disabled,
            )}
            onClick={() => {
              if (selectCache.includes(item[idKey]) || disabled) return
              isValuesChangeRef.current = true
              const newChecked = checkedKeys.filter((i) => i.id !== item[idKey])
              if (newChecked.length === checkedKeys.length) {
                newChecked.push({ id: item[idKey], value: item[fieldCode] })
              }
              setCheckedInfo(newChecked)
            }}
          >
            <div className={styles.left}>
              {item.logoUrl && <img className={styles.image} src={item.logoUrl} alt={item.logoUrl} />}
              <div>{item[labelKey]}</div>
            </div>
            <div className={styles.right}>
              {checkedKeys.some((i) => i.id === item[idKey]) ? (
                <CheckSquareFilled style={{ fontSize: '16px', color: '#00A98F' }} />
              ) : (
                <div className={styles['uncheck-box']} />
              )}
            </div>
          </div>
        ))}
      </div>
    </CommonDrawer>
  )
}

export default memo(forwardRef(CommonCheckboxDrawer))
