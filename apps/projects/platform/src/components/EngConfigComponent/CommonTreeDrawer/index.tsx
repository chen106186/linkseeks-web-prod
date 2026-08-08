/**
 * 树结构公共弹窗
 */
import React, { useRef, useState, useCallback, forwardRef, memo, useEffect, useImperativeHandle } from 'react'
import { Modal, Tree } from 'antd'
import CommonDrawer from '@/components/CommonDrawer'
import { useIntl } from '@linkseeks/i18n'

interface PropsType {
  onOk?: (values: any) => void
  fieldCode?: string
  selectCache?: any[]
  fetchApi: Function
  fetchParams?: any
  title: string
  treeKey?: string
  disabled?: boolean
}

const CommonTreeDrawer = (props: PropsType, ref) => {
  const intl = useIntl()
  const { onOk, fieldCode, selectCache, fetchApi, fetchParams = {}, title, treeKey = 'id', disabled } = props

  const [tree, setTree] = useState<any[]>([])
  const [checkedKeys, setCheckedKeys] = useState<any[]>([])

  const drawRef = useRef<any>()
  const isValuesChangeRef = useRef<boolean>(false)

  const handleOk = useCallback(() => {
    isValuesChangeRef.current = false
    onOk?.(checkedKeys.map((item) => ({ id: item.id, value: item.value || item[fieldCode] })))
  }, [checkedKeys])

  const getTree = () => {
    fetchApi?.(fetchParams).then(({ code, data }) => {
      if (code === 1000) {
        setTree(data)
      }
    })
  }

  const _onCheck = (checked: string[], e: any) => {
    isValuesChangeRef.current = true
    const newChecks = e.checkedNodes.flatMap((item) => (!!item.children.length ? [] : [item]))
    setCheckedKeys(newChecks)
  }

  const checkAbleTree = () => {
    const newTree = JSON.parse(JSON.stringify(tree))
    function delTree(delItem) {
      if (delItem) {
        if (delItem.children.length) {
          delItem.children.forEach((item) => {
            delTree(item)
          })
        } else {
          if (selectCache.includes(delItem.id)) {
            delItem.disableCheckbox = true
          }
        }
      }
    }
    newTree.forEach((item) => {
      delTree(item)
    })
    return newTree
  }

  useImperativeHandle(ref, () => ({
    show(flag: boolean, params = {}, data) {
      drawRef?.current?.show(flag, params)
      if (data) {
        setCheckedKeys(data?.selectData || [])
      }
    },
    setKeys(keys: any[]) {
      setCheckedKeys(keys)
    },
  }))

  useEffect(() => {
    getTree()
  }, [])
  console.log(checkAbleTree(), 'checkAbleTree()')
  return (
    <CommonDrawer
      ref={drawRef}
      title={title}
      width={600}
      destroyOnClose
      onOk={handleOk}
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
      <Tree
        disabled={disabled}
        checkable={true}
        onCheck={_onCheck}
        treeData={checkAbleTree()}
        blockNode={true}
        checkedKeys={checkedKeys.map((item) => item[treeKey])}
        fieldNames={{ key: treeKey, title: 'name' }}
      />
    </CommonDrawer>
  )
}

export default memo(forwardRef(CommonTreeDrawer))
