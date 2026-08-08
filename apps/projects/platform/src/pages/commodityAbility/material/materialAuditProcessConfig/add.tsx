import React, { useEffect, useState } from 'react'
import { PageHeaderWrapper } from '@apps/components'
import NiceForm from '@/components/NiceForm'
import { createFormActions, FormEffectHooks, FormPath } from '@apps/formily'
import { ArrayTable } from '@apps/formily'
import { addSchema } from './schemas'
import ProcessRadio from './components/processRadio'
import ApplicableMaterial from './components/applicableMaterials'
import SelectMaterial from './components/selectMaterial'
import { Button } from 'antd'
import {
  getProductMaterialGroupTree,
  getProductMaterialProcessBaseList,
  getProductMaterialProcessGet,
  getProductMaterialProcessPageRelMaterial,
  getProductMaterialProcessTreeRelMaterialGroup,
  postProductMaterialProcessSave,
  postProductMaterialProcessUpdate,
} from '@apps/apis'
import { useAsyncSelect } from '@/formSchema/effects/useAsyncSelect'
import FormilyTransfer from './components/formilyTransfer'
import { usePageStatus } from '@/hooks/usePageStatus'
import { usePrompt } from '@linkseeks/router-core'
import { useIntl } from '@linkseeks/i18n'

const formActions = createFormActions()

const { onFormInputChange$ } = FormEffectHooks

type SubmitDataType = {
  name: string
  /** 适用物料类型枚举值,1-所有物料,2-选择部分物料组,3-选择部分物料 */
  suitableMaterialType: string | number
  /** 基础物料流程id */
  baseProcessId: number
  /**
   * 选择部分物料,适用物料类型是3时，
   */
  materials?: {
    id: number
  }[]
  /** 选择部分物料分组,适用物料类型是2时 */
  materialGroups?: {
    id: number
  }[]
}

/** 全部物料 */
const ALL = 1

/** 选择部分物料组 */
const GROUP = 2

/** 选择部分物料 */
const MATERIAL_ITEM = 3

const Add: React.FC<{}> = (props) => {
  const { id, lastTypeParams } = usePageStatus()
  const isAdd = lastTypeParams.includes('add') && !id
  const isEdit = lastTypeParams === '/edit' && id
  const isEditable = isAdd || isEdit
  const [initialValue, setInitialValue] = useState(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [unsaved, setUnsaved] = useState(false)
  const intl = useIntl()

  /**
   * 新增物料审核流程规则
   */

  const anchorHeader = [
    {
      label: intl.formatMessage({ id: 'material.rules.header.process', defaultMessage: '流程规则' }),
      key: 'config',
    },
    {
      label: intl.formatMessage({ id: 'material.rules.header.flow', defaultMessage: '物料流程' }),
      key: 'type',
    },
    {
      label: intl.formatMessage({ id: 'material.rules.header.applyProcess', defaultMessage: '适用物料组/物料' }),
      key: 'apply',
    },
  ]

  usePrompt({
    when: unsaved,
    message: intl.formatMessage({
      id: 'common.tip.save.confirm',
      defaultMessage: '您还有未保存的内容，是否确定要离开？',
    }),
  })

  useEffect(() => {
    if (isAdd) {
      setInitialValue({
        suitableMaterialType: ALL,
      })
      return
    }
    async function getInitialValue() {
      const { data, code } = await getProductMaterialProcessGet({ processId: id })
      console.log(data)
      if (code === 1000) {
        /** 选择部分物料 */
        let materials = []
        let materialGroups = []
        if (data.suitableMaterialType === MATERIAL_ITEM) {
          const listData = await getProductMaterialProcessPageRelMaterial({ processId: id })
          materials = [...listData.data].map((_item) => {
            return {
              name: _item.materialName,
              code: _item?.materialCode || '',
              materialGroup: {
                name: _item.materialGroupName,
              },
              id: _item.materialId,
              ..._item,
            }
          })
        }

        if (data.suitableMaterialType === GROUP) {
          const res = await getProductMaterialProcessTreeRelMaterialGroup({ processId: id })
          materialGroups = res.data.map((_item) => _item.materialGroupId.toString())
        }

        setInitialValue({
          ...data,
          materials: materials,
          materialGroups: materialGroups,
        })
      }
    }
    getInitialValue()
  }, [])

  const fetchProcess = async () => {
    const { data, code } = await getProductMaterialProcessBaseList({ processType: isAdd ? '1' : '2' })
    if (code === 1000) {
      return data
    }
    return []
  }

  const handleSubmit = async (values: SubmitDataType) => {
    setLoading(true)
    let tempData = {}
    if (values.suitableMaterialType === 2) {
      tempData = {
        materialGroups: values.materialGroups?.map((_item) => {
          return {
            materialGroupId: _item,
          }
        }),
      }
    } else if (values.suitableMaterialType === 3) {
      tempData = {
        materials: values.materials?.map((_item) => {
          return {
            materialId: _item.id,
          }
        }),
      }
    }

    const { materials, materialGroups, ...rest } = values
    const defaultPostData = {
      ...rest,
      ...tempData,
    }
    const postData = isAdd
      ? defaultPostData
      : {
          ...defaultPostData,
          id: id,
        }

    const service = isAdd ? postProductMaterialProcessSave : postProductMaterialProcessUpdate

    const { data, code } = await service(postData)
    setLoading(false)
    if (code === 1000) {
      setUnsaved(false)
      setTimeout(() => {
        history.back()
      }, 100)
    }
  }

  const renderTitle = () => {
    if (isAdd) {
      return intl.formatMessage({ id: 'material.rules.isAdd', defaultMessage: '新增物料审核流程' })
    }
    if (isEdit) {
      return intl.formatMessage({ id: 'material.rules.isEdit', defaultMessage: '编辑物料审核流程配置' })
    }
    return intl.formatMessage({ id: 'material.rules.isView', defaultMessage: '查看物料审核流程配置' })
  }

  return (
    <PageHeaderWrapper
      title={renderTitle()}
      items={anchorHeader}
      extra={
        (isAdd || isEdit) && (
          <Button onClick={() => formActions.submit()} loading={loading}>
            {intl.formatMessage({ id: 'material.group.save', defaultMessage: '保存' })}
          </Button>
        )
      }
    >
      <NiceForm
        onSubmit={handleSubmit}
        schema={addSchema}
        actions={formActions}
        value={initialValue}
        editable={isEditable as boolean}
        components={{
          ProcessRadio,
          ApplicableMaterial,
          ArrayTable,
          SelectMaterial,
          FormilyTransfer,
        }}
        effects={($, actions) => {
          useAsyncSelect('baseProcessId', fetchProcess)
          $('onFieldInputChange', 'baseProcessId').subscribe((fieldState) => {
            actions.setFieldState('selectMaterials', (state) => {
              FormPath.setIn(state, 'props.x-component-props', {
                processId: fieldState.value,
              })
            })
          })
          $('onFieldMount', 'materialGroups').subscribe((fieldState) => {
            // console.log("挂载")
            getProductMaterialGroupTree({ rootNodeId: '0' }).then(({ data }) => {
              actions.setFieldState('materialGroups', (state) => {
                FormPath.setIn(state, 'props.enum', data)
              })
            })
          })
          onFormInputChange$().subscribe(() => {
            if (!unsaved) {
              setUnsaved(true)
            }
          })
        }}
      />
    </PageHeaderWrapper>
  )
}

export default Add
