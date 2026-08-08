import React, { useEffect, useMemo, useRef, useState } from 'react'
import { Button, Popconfirm, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { history } from '@linkseeks/router-manager'
import { StatusAuthButton, EditAuthButton, AuthButton, PageHeaderWrapper, StandardFormTable } from '@apps/components'
import type { RecordColumns, ActionType, SearchField } from '@apps/components/src/web/StandardFormTable/types'
import { getProductUnitDeleteUnit, getProductUnitUpdateUnitStatus, getProductUnitGetUnitList } from '@apps/apis'
import useUnit from './services/hooks/useUnit'
import AddUnitModal from './components/addUnitModal'
import { useLanguage } from '@apps/domains'

const SensitiveWords: React.FC = () => {
  const ref = useRef({} as ActionType)
  const { languageList } = useLanguage()
  const { operateType, unitForm, addModalVisible, setOperateType, setModalVsiible } = useUnit()

  /**切换状态 */
  const handleChangeStatus = async (id: any, status: any) => {
    const _status = status === true ? 'false' : 'true'
    const res = await getProductUnitUpdateUnitStatus({ id: id, status: _status })
    if (res.code === 1000) {
      ref.current.reload()
    } else {
      message.error(res.message)
    }
  }

  const confirmCancel = (id: any) => {
    getProductUnitDeleteUnit({ id }).then((res) => {
      if (res.code === 1000) {
        message.success('删除成功')
        ref.current.reload()
      }
    })
  }

  const columns: RecordColumns<any>[] = useMemo(() => {
    if (languageList && languageList.length > 0) {
      return [
        {
          title: 'ID',
          key: 'id',
          dataIndex: 'id',
          width: 60,
          fixed: 'left',
        },
        ...languageList.map((item) => ({
          title: item.language,
          key: item.key === 'zh-CN' ? 'name' : item.key,
          dataIndex: item.key,
          searchField:
            item.key === 'zh-CN'
              ? {
                  type: 'Input' as keyof typeof SearchField,
                  placeholder: '单位名称',
                }
              : undefined,
          render: (_, record) => {
            const unit = record.unitNameList.find((_item) => _item.language === item.key)
            if (unit) {
              return unit?.value
            }
            return ''
          },
        })),
        {
          title: '状态',
          key: 'status',
          dataIndex: 'status',
          fixed: 'right',
          render: (text: any, record: any) => (
            <StatusAuthButton
              customStyle={{ paddingLeft: 0 }}
              fieldNames="status"
              handleConfirm={() => handleChangeStatus(record.id, record.status)}
              record={record}
              expectTrueValue={true}
            />
          ),
        },
        {
          title: '操作',
          key: 'options',
          dataIndex: 'options',
          fixed: 'right',
          render: (text: any, record: any) => {
            return (
              <>
                <EditAuthButton>
                  <Button
                    type="link"
                    onClick={() => {
                      setOperateType('edit')
                      setModalVsiible(true)
                      const formData = {
                        id: record.id,
                      }
                      if (record.unitNameList && record.unitNameList.length > 0) {
                        for (const languageItem of record.unitNameList) {
                          formData[languageItem.language] = languageItem.value
                        }
                      }
                      unitForm.setFieldsValue(formData)
                    }}
                  >
                    编辑
                  </Button>
                </EditAuthButton>
                {!record.status && (
                  <AuthButton type="custom" code="delete">
                    <Popconfirm
                      onConfirm={() => confirmCancel(record.id)}
                      title="确定要执行这个操作?"
                      okText="确定"
                      cancelText="取消"
                    >
                      <Button type="link">删除</Button>
                    </Popconfirm>
                  </AuthButton>
                )}
              </>
            )
          },
        },
      ]
    }
    return []
  }, [languageList])

  /**获取单位列表数据 */
  const fetchData = async (params: any) => {
    const res = await getProductUnitGetUnitList(params, { ctlType: 'none' })
    return res.data ? res.data : []
  }

  return (
    <PageHeaderWrapper>
      <StandardFormTable
        actionRef={ref}
        columns={columns}
        rowKey="id"
        request={fetchData}
        autoScrollX
        searchButtons={[
          {
            key: 'add',
            type: 'primary',
            icon: <PlusOutlined />,
            children: '新建',
            onClick() {
              setOperateType('add')
              unitForm.resetFields()
              setModalVsiible(true)
            },
          },
        ]}
      />
      <AddUnitModal
        operateType={operateType}
        form={unitForm}
        visible={addModalVisible}
        setVisible={setModalVsiible}
        languageList={languageList}
        onOk={() => {
          ref.current.reload()
        }}
      />
    </PageHeaderWrapper>
  )
}
export default SensitiveWords
