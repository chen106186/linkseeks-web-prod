import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks } from '@apps/formily'
import { Button, Card, message } from 'antd'
import React, { useEffect, useState } from 'react'
import { ArrayTable } from '@apps/formily'
import { PlusOutlined } from '@ant-design/icons'
import styles from './sourceList.less'
import TableModal from '@/pages/customerAbility/components/TableModal'
import { getProductMaterielGetMaterielSourceList, postProductMaterielSubmitMaterielSourceList } from '@apps/apis'
import { usePageStatus } from '@/hooks/usePageStatus'
import { history } from '@linkseeks/router-manager'
import { usePrompt, useLocation } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'
import { getMemberAbilityMaintenanceSubOrdinateMemberList } from '@apps/apis'
import Operation from './components/operation'
import { schema } from './schema/sourceListSchema'
import AddMaterialModal from './addMaterialModal'
import { useRowSelectionTable } from '@/hooks/useRowSelectionTable'

const formActions = createFormActions()

const { onFormInputChange$ } = FormEffectHooks

const DEFAULT_RETURN_DATA = {
  totalCount: 0,
  data: [],
}

const SourceList = () => {
  const { id } = usePageStatus()
  const { name = '' } = useLocation()?.state || { name: '' }
  const [visible, setVisible] = useState<boolean>(false)
  const [initialValue, setInitialValue] = useState<any>({ datas: [], name: name, cacheData: [] })
  const [checkedValue, setCheckedValue] = useState([])
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState(false)
  const [materialVisible, setMaterialVisible] = useState<boolean>(false)
  const [editState, setEditState] = useState(false)
  const intl = useIntl()

  const anchorHeader = [
    {
      label: intl.formatMessage({ id: 'material.sourceList', defaultMessage: '货源清单' }),
      key: 'source-list',
    },
  ]

  const [selectRow, selectRowFns] = useRowSelectionTable({ customKey: 'uniqueId' })
  const [rowSelection, rowCtl] = useRowSelectionTable({ customKey: 'materialId' })

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  const handleOpenModal = (_type: string) => {
    const data = formActions.getFieldValue('datas')
    let _data = []
    const materialData = data.filter((item) => {
      if (!item.supplierMaterial) {
        _data.push(item)
      }
      return item.supplierMaterial
    })
    if (_type === '1') {
      const { setSelectRow, setSelectedRowKeys } = selectRowFns
      const isEffective = _data.filter((_item) => _item.status && !_item?.supplierMaterial)
      setCheckedValue(isEffective)
      const rowKeys = isEffective.map((item) => item.uniqueId)
      setSelectedRowKeys(rowKeys)
      setSelectRow(isEffective)
      setVisible(true)
    } else {
      const { setSelectRow, setSelectedRowKeys } = rowCtl
      const rowKeys = materialData.map((item) => item.materialId)
      setSelectRow(materialData)
      setSelectedRowKeys(rowKeys)
      setCheckedValue(materialData)
      setMaterialVisible(true)
    }
  }
  const getInitialValue = async () => {
    const { data, code } = await getProductMaterielGetMaterielSourceList({ id: id } as any)
    if (code === 1000) {
      const formatedData = data.map((_item) => {
        return {
          ..._item,
          roleId: _item.memberRoleId,
          name: _item.memberName,
          uniqueId: _item.supplierMaterial ? _item.materialId : _item.memberId + '' + _item.memberRoleId,
        }
      })
      const isEffective = formatedData.filter((_item) => _item.status)
      console.log('isEffective', isEffective)
      setInitialValue({ name: name, datas: isEffective, cacheData: formatedData })
    }
    return []
  }
  useEffect(() => {
    getInitialValue()
  }, [])

  const renderAddition = () => (
    <>
      <div className={styles.addition} onClick={() => handleOpenModal('1')}>
        <PlusOutlined />
        <span className={styles.text}>
          {intl.formatMessage({ id: 'material.edit.supplier', defaultMessage: '编辑供应商' })}
        </span>
      </div>
      <div className={styles.addition} onClick={() => handleOpenModal('2')}>
        <PlusOutlined />
        <span className={styles.text}>
          {intl.formatMessage({ id: 'material.add.supplier.material', defaultMessage: '添加供应商物料' })}
        </span>
      </div>
    </>
  )

  const handleFetchData = async (params) => {
    const { data, code } = await getMemberAbilityMaintenanceSubOrdinateMemberList(params)
    if (code === 1000) {
      let list = []
      if (data?.data?.length > 0) {
        list = data.data.map((item) => ({ ...item, uniqueId: item?.memberId?.toString() + item?.roleId?.toString() }))
      }
      return { data: list, totalCount: data?.totalCount || 0 }
    }
    return DEFAULT_RETURN_DATA as any
  }

  const columns = [
    {
      title: intl.formatMessage({ id: 'material.supplier.id', defaultMessage: '供应商id' }),
      dataIndex: 'id',
    },
    {
      title: intl.formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
      dataIndex: 'name',
    },
  ]

  const suppilerSchema = {
    type: 'object',
    properties: {
      layout: {
        type: 'object',
        'x-component': 'mega-layout',
        properties: {
          memberName: {
            type: 'string',
            'x-component': 'Search',
            'x-component-props': {
              placeholder: intl.formatMessage({ id: 'material.supplier.name', defaultMessage: '供应商名称' }),
              align: 'flex-left',
              advanced: false,
            },
          },
        },
      },
    },
  }

  const handleOnOk = () => {
    const { selectRow = [], selectedRowKeys } = selectRowFns
    const cacheData = formActions.getFieldValue('datas')
    const supplierData = cacheData.filter((item) => !item.supplierMaterial)
    const supplierKeys = supplierData?.map((item) => item.uniqueId)
    const allKeys = cacheData?.map((item) => item.uniqueId)
    const deleteKeys = supplierKeys.filter((key) => !selectedRowKeys.includes(key))
    const newKeys = new Set([...allKeys, ...selectedRowKeys])
    const list = []
    for (const key of newKeys) {
      let filterItem = selectRow.filter((item) => item.uniqueId === key)[0]
      if (!filterItem) {
        filterItem = cacheData.filter((item) => item.uniqueId === key)[0]
      }
      if (filterItem && !deleteKeys.includes(filterItem.uniqueId)) {
        if (filterItem.supplierMaterial) {
          list.push(filterItem)
        } else {
          list.push({
            ...filterItem,
            status: 1,
            supplierMaterial: false,
          })
        }
      }
    }
    formActions.setFieldValue('cacheData', list)
    formActions.setFieldValue('datas', list)
    setVisible(false)
    setUnsaved(true)
    // const currentMemberIdAndRoleIdList = cacheData.map((_item) => {
    //   return `${_item?.memberId}_${_item?.roleId}`;
    // })
    /** 从原数组中如果没有查到当前值，那么就代表他是新增进来的 */

    /**
     * 比如原数组 [1_1, 1_2]
     * 勾选数组 [1_1, 1_2, 1_3],
     * 那么 [1_3] 就是新增的
     */

    /** 获取从元素组中没有勾选则数据 */
    /**
     * 比如原数组 [1_1, 1_2]
     * 勾选数组 [1_1],
     * 那么 [1_2] 就是删除的
     */
    //  const addList = [];

    // selectRowRecord.forEach((_item) => {
    //   if (_item && !currentMemberIdAndRoleIdList.includes(`${_item?.memberId}_${_item?.roleId}`)) {
    //     addList.push(_item);
    //   }
    // })

    // const newDataSource = cacheData.concat(addList).map((_item) => {
    //   const isEnable = selectRow.includes(`${_item?.memberId}_${_item?.roleId}`)
    //   return {
    //     ..._item,
    //     // status: !isEnable ? 0 : 1, ??
    //     status: 1,
    //     supplierMaterial: false, //false——选择供应商，true——添加供应商物料
    //   }
    // });

    // formActions.setFieldValue('cacheData', newDataSource)
    // formActions.setFieldValue('datas', newDataSource.filter((_item) => _item.status))
    // setVisible(false)
    // setUnsaved(true)
  }

  const onAddMaterialOk = () => {
    const { selectRow = [], selectedRowKeys } = rowCtl
    const cacheData = formActions.getFieldValue('datas')
    const materialData = cacheData.filter((item) => item.supplierMaterial)
    const materialKeys = materialData?.map((item) => item.uniqueId)
    const allKeys = cacheData?.map((item) => item.uniqueId)
    const deleteKeys = materialKeys.filter((key) => !selectedRowKeys.includes(key))
    const newKeys = new Set([...allKeys, ...selectedRowKeys])
    const list = []
    for (const key of newKeys) {
      let filterItem = selectRow.filter((item) => item.uniqueId === key)[0]
      if (!filterItem) {
        filterItem = cacheData.filter((item) => item.uniqueId === key)[0]
      }
      if (filterItem && !deleteKeys.includes(filterItem.uniqueId)) {
        if (filterItem?.supplierMaterial + '' == 'false') {
          list.push(filterItem)
        } else {
          list.push({
            ...filterItem,
            status: 1,
            supplierMaterial: true, //false——选择供应商，true——添加供应商物料
            materialId: filterItem?.id,
            uniqueId: filterItem?.id,
          })
        }
      }
    }
    console.log(list, 'list')
    formActions.setFieldValue('cacheData', list)
    formActions.setFieldValue('datas', list)
    setMaterialVisible(false)
    setUnsaved(true)
  }

  const handleSubmit = async (value: any) => {
    if (editState) {
      message.warning('请先确认表格内的数据')
      return
    }
    const { datas } = value
    setLoading(true)
    const uniqueSet = new Set()
    const postData = []
    datas?.forEach((_item) => {
      //??
      // const key = `${_item.memberId}_${_item.roleId}`;
      // if (uniqueSet.has(key)) {
      //   return;
      // }
      // uniqueSet.add(key);
      const { id, name, roleId, roleName, operations, level, levelTag, memberTypeName, ...rest } = _item
      const target = {
        ...rest,
        memberName: name,
        memberRoleId: roleId,
        memberRoleName: roleName,
      }
      postData.push(target)
    })

    const { data, code } = await postProductMaterielSubmitMaterielSourceList({
      list: postData,
      id: id,
    } as any)
    setLoading(false)
    if (code === 1000) {
      setUnsaved(false)
      setTimeout(() => {
        history.goBack()
      }, 100)
    }
  }

  /**
   * 处理删除操作、确认操作没有触发 onFormInputChange 的问题
   */
  const handleActionsAfter = () => {
    setUnsaved(true)
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({ id: 'material.sourceList', defaultMessage: '货源清单' })}
      items={anchorHeader}
      extra={
        <Button onClick={() => formActions.submit()} loading={loading}>
          {intl.formatMessage({ id: 'material.submit', defaultMessage: '提交' })}
        </Button>
      }
    >
      <Card title={intl.formatMessage({ id: 'material.sourceList', defaultMessage: '货源清单' })}>
        <NiceForm
          previewPlaceholder=" "
          expressionScope={{
            renderAddition: renderAddition(),
            handleActionsAfter: handleActionsAfter,
            setEditState: setEditState,
          }}
          initialValues={initialValue}
          onSubmit={handleSubmit}
          actions={formActions}
          schema={schema}
          components={{
            ArrayTable,
            Operation,
          }}
          effects={($, actions) => {
            onFormInputChange$().subscribe(() => {
              if (!unsaved) {
                setUnsaved(true)
              }
            })
          }}
        />
      </Card>
      <TableModal
        rowSelection={selectRow}
        modalType="Drawer"
        visible={visible}
        onClose={() => setVisible(false)}
        title={intl.formatMessage({ id: 'material.select.supplier.modal.title', defaultMessage: '选择供应商' })}
        columns={columns}
        schema={suppilerSchema}
        onOk={handleOnOk}
        fetchData={handleFetchData}
        tableProps={{ rowKey: 'uniqueId' }}
        effects={($, actions) => {}}
        mode={'checkbox'}
        value={checkedValue}
      />
      {materialVisible && (
        <AddMaterialModal
          visible={materialVisible}
          setVisible={setMaterialVisible}
          handleOnOk={onAddMaterialOk}
          checkedValue={checkedValue}
          rowSelection={rowSelection}
        />
      )}
    </PageHeaderWrapper>
  )
}

export default SourceList
