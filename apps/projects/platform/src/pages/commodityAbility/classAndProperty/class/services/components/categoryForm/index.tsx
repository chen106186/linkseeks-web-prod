import React, { Fragment, useState } from 'react'
import { Form, Input, Select, Button, Modal } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import { useCategoryContext } from '../../context'
import { validatorByte } from '@/utils/regExp'
import { SingleCardUpload } from '@apps/components'
import { LinkIcon } from '@linkseeks/icons'
import TabTree, { useTreeActions } from '@/components/TabTree'
import { useTreeTabs } from '@/hooks/useTreeTabs'
import { getProductPlatformGetCategoryTree } from '@apps/apis'
import { useWebIntl } from '@apps/locales'
import { Validator } from '@apps/validator'
import { ShowType } from '@apps/components/src/web/UploadFile/constants'

interface IProps {
  /** 是否多租户部署 */
  isMultiple: boolean
}

const validator = new Validator()
const CategoryForm: React.FC<IProps> = ({ isMultiple }) => {
  const { selectCategoryInfo, categoryForm } = useCategoryContext()
  const [plateformVisible, setPlateformVisible] = useState<boolean>(false)
  const [plateformSelectNode, setPlateformSelectNode] = useState<any>()
  const [resetSearch, setResetSearch] = useState<boolean>(false)
  const [customPlateformExpandkeys, setCustomPlateformExpandkeys] = useState<number[]>([])
  const plateformTreeActions = useTreeActions()
  const intl = useIntl()
  const translate = useWebIntl()
  const fetchPlatformTreeData = async (params?) => {
    // 平台后台树
    const res = await getProductPlatformGetCategoryTree()
    return res
  }

  /* 关联平台后台品类树 */
  const { treeData: plateformTreeData } = useTreeTabs({
    fetchMenuData: fetchPlatformTreeData,
  })

  const handleSelectOk = () => {
    setPlateformVisible(false)
    if (plateformSelectNode?.id) {
      categoryForm.setFieldValue('category', plateformSelectNode)
    }
  }

  const handlePlateformSelect = (key, node) => {
    setPlateformSelectNode({ id: key * 1, name: node._title })
  }

  const handleSelectCancel = () => {
    setPlateformVisible(false)
    plateformTreeActions.setExpandedKeys && plateformTreeActions.setExpandedKeys([])
  }

  const handleConnectCategroyBtn = () => {
    setPlateformVisible(true)
    if (selectCategoryInfo?.category?.id) {
      setCustomPlateformExpandkeys([selectCategoryInfo.category.id])
      plateformTreeActions.setSelectKey && plateformTreeActions.setSelectKey(selectCategoryInfo.category.id)
    }
  }
  return (
    <Fragment>
      <Form.Item
        name="name"
        label={translate('web.resource.commodity.pinleimincheng')}
        rules={[
          {
            required: true,
            message: translate.formatFormInputTip(translate('web.resource.commodity.pinleimincheng')),
          },
          {
            pattern: /^(?![0-9])/,
            message: intl.formatMessage({
              id: 'classAndProperty.class.classSchema.name.placeholder.error1',
              defaultMessage: '不能数字开头',
            }),
          },
          // {
          //   pattern: /^[^`~!@#$%^&*()_\-+=<>?:"{}|,.\/;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]*$/,
          //   message: intl.formatMessage({
          //     id: 'classAndProperty.class.classSchema.name.placeholder.error2',
          //     defaultMessage: '不能包含特殊字符',
          //   }),
          // },
          {
            validator: (r, v, c) => validatorByte(r, v, c, 36),
          },
        ]}
      >
        <Input placeholder={translate.formatFormInputTip(translate('web.resource.commodity.pinleimincheng'))} />
      </Form.Item>
      <Form.Item
        name="type"
        label={translate('web.resource.commodity.pinleileixing')}
        rules={[
          {
            required: true,
            message: translate.formatFormInputTip(translate('web.resource.commodity.pinleileixing')),
          },
        ]}
      >
        <Select
          options={[
            {
              label: translate('web.resource.commodity.shiwushanpin'),
              value: 1,
            },
            {
              label: translate('web.resource.commodity.xunishanpin'),
              value: 2,
            },
            {
              label: translate('web.resource.commodity.fuwushanpin'),
              value: 3,
            },
            {
              label: translate('web.resource.commodity.jifenduihuanshanping'),
              value: 4,
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        name="imageUrl"
        label={intl.formatMessage({ id: 'classAndProperty.class.classSchema.imageUrl', defaultMessage: '品类图片' })}
      >
        <SingleCardUpload />
      </Form.Item>
      <Form.Item
        name="sendCycle"
        label={intl.formatMessage({
          id: 'classAndProperty.class.classSchema.deadline',
          defaultMessage: '发货周期',
        })}
        rules={[
          {
            pattern: /^([1-9]\d{0,8}|[0]{1,1})$/,
            message: intl.formatMessage({
              id: 'classAndProperty.class.classSchema.deadline.placeholder1',
              defaultMessage: '请正确输入发货周期',
            }),
          },
        ]}
      >
        <Input
          prefix={intl.formatMessage({
            id: 'classAndProperty.class.classSchema.deadline.prefix',
            defaultMessage: '下单后',
          })}
          suffix={intl.formatMessage({
            id: 'classAndProperty.class.classSchema.deadline.suffix',
            defaultMessage: '天发货',
          })}
          placeholder={intl.formatMessage({
            id: 'classAndProperty.class.classSchema.deadline.placeholder',
            defaultMessage: '请输入发货周期',
          })}
        />
      </Form.Item>
      <Form.Item name={['category', 'id']} hidden>
        <Input />
      </Form.Item>
      <Form.Item
        name={['category', 'name']}
        hidden={isMultiple}
        label={intl.formatMessage({
          id: 'classAndProperty.class.classSchema.category.name',
          defaultMessage: '对应平台品类',
        })}
        tooltip={intl.formatMessage({
          id: 'classAndProperty.class.classSchema.category.name.desc',
          defaultMessage:
            '如果需要在商城中通过平台定义的品类及属性筛选商品，需要在对应平台品类一栏中选择对应到平台定义的商品品类。',
        })}
      >
        <Input
          readOnly
          addonAfter={
            <Button
              type="primary"
              style={{ margin: '0 -12px' }}
              onClick={handleConnectCategroyBtn}
              icon={<LinkIcon />}
            />
          }
        />
      </Form.Item>
      <Modal
        title={intl.formatMessage({ id: 'classAndProperty.class.modal.1.title' })}
        open={plateformVisible}
        onOk={handleSelectOk}
        onCancel={handleSelectCancel}
        okText={intl.formatMessage({ id: 'classAndProperty.class.modal.1.okText' })}
        cancelText={intl.formatMessage({ id: 'classAndProperty.class.modal.1.cancelText' })}
        forceRender
        getContainer="#root"
      >
        <TabTree
          fetchData={(params) => fetchPlatformTreeData(params)}
          treeData={plateformTreeData}
          handleSelect={(key, node) => handlePlateformSelect(key, node)}
          actions={plateformTreeActions}
          customKey="id"
          enableSearch={true}
          searchPlaceholder={intl.formatMessage({ id: 'classAndProperty.class.modal.1.searchPlaceholder' })}
          resetSearch={resetSearch}
          customExpandkeys={customPlateformExpandkeys}
        />
      </Modal>
    </Fragment>
  )
}

export default CategoryForm
