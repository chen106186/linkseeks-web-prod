import SettingPanel from '@/pages/design/components/SettingPanel'
import { ImageBox, LineTitle } from '@apps/components'
import { changeProps, clearSelectedStatus, produce } from '@apps/design-core'
import { AdvertItem, NAV_TYPE } from '@apps/design-ui'
import { DragIcon, PlusIcon } from '@linkseeks/icons'
import { Button, Table } from '@linkseeks/ui'
import { Col, Form, InputNumber, Popconfirm, Row, Slider, Space } from 'antd'
import { useEffect, useState } from 'react'
import { getWebIntl } from '@apps/locales'
import cloneDeep from 'lodash/cloneDeep'
import { ColumnsType } from 'antd/lib/table'
import { arrayMove } from '@linkseeks/tools'
import moment from 'moment'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { DndContextProvider, useDnd } from '../MallNav/useDnd'
import { getTypeName } from '../MallNav/constants'
import TableRow from '../MallNav/TableRow'
import CommonItemModal, { ModalFormType } from '../CommonItemModal'
import styles from '../AdvertSetting/index.less'
import StandardImage from '@apps/components/src/web/StandardImage'
import { resetListSort } from '@/pages/design/utils'

interface IProps {
  dataList: AdvertItem[]
  componentHeight: number
  verticalMargin: number
  layoutType: LAYOUT_TYPE
}

const HorizontalBanner: React.FC<IProps> = (props) => {
  const { dataList, componentHeight = 200, verticalMargin = 8, layoutType } = props
  const [optionType, setOptionType] = useState<'add' | 'edit'>('add')
  const [list, setList] = useState<AdvertItem[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [changeState, setChangeState] = useState<boolean>(false)
  const [tempVerticalMargin, setTempVerticalMargin] = useState<number>(verticalMargin)
  const translate = getWebIntl()
  const [componentForm] = Form.useForm()
  const [form] = Form.useForm()
  const dndProps = useDnd()

  useEffect(() => {
    if (dataList && dataList.length > 0) {
      const newList: AdvertItem[] = cloneDeep(dataList)
      if (newList) {
        setList(
          newList.map((item, index) => {
            item.sort = index + 1
            return item
          }),
        )
      }
    }
  }, [dataList])

  const updateList = (list: AdvertItem[]) => {
    setList(list)
    setChangeState(true)
  }

  const handleDeleteItem = (sort: number) => {
    updateList(list.filter((item) => item.sort !== sort))
  }

  const handleCancel = () => {
    clearSelectedStatus()
  }

  const handleConfirmSave = (e) => {
    componentForm.validateFields().then((values) => {
      e.preventDefault()
      if (!changeState) {
        clearSelectedStatus()
        return
      }

      changeProps({
        props: {
          ...values,
          linkdisable: true,
          dataList: resetListSort(list),
          canDelete: true,
        },
      })
      clearSelectedStatus()
    })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = list.findIndex((v) => v.sort === active.id)
      const newIndex = list.findIndex((v) => v.sort === over.id)
      updateList(arrayMove(list, oldIndex, newIndex))
    }
  }

  const handleModalConfirm = () => {
    form.validateFields().then((values) => {
      const effectiveStartTime = values.effectiveTime
        ? moment(values.effectiveTime[0]).format('yyyy-MM-DD HH:mm:ss')
        : undefined
      const effectiveEndTime = values.effectiveTime
        ? moment(values.effectiveTime[1]).format('yyyy-MM-DD HH:mm:ss')
        : undefined
      if (optionType === 'add') {
        const sortList = produce(list, (oldList) => {
          return oldList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        })
        const newSort = sortList.length > 0 ? sortList[sortList.length - 1].sort + 1 : 1
        updateList([
          ...list,
          {
            ...values,
            sort: newSort,
            effectiveStartTime,
            effectiveEndTime,
          },
        ])
      } else {
        const newList = produce(list, (oldList) => {
          oldList.map((listItem) => {
            if (listItem.sort === values.sort) {
              listItem.name = values.name
              listItem.type = values.type
              listItem.value = values.value
              listItem.valueText = values.valueText
              listItem.picUrl = values.picUrl
              listItem.effectiveStartTime = effectiveStartTime
              listItem.effectiveEndTime = effectiveEndTime
            }
          })
          return oldList
        })
        updateList(newList)
      }
      setModalVisible(false)
      form.resetFields()
    })
  }

  const handleEdit = (record: AdvertItem) => {
    setOptionType('edit')
    setModalVisible(true)
    form.setFieldsValue({
      ...record,
    })
    if (record.effectiveStartTime || record.effectiveEndTime) {
      form.setFieldValue('effectiveTime', [moment(record.effectiveStartTime), moment(record.effectiveEndTime)])
    }
  }

  const columns: ColumnsType<AdvertItem> = [
    {
      title: translate('web.common.sort'),
      dataIndex: 'sort',
      render: () => (
        <div className={styles['drag-btn']}>
          <DragIcon size={16} />
        </div>
      ),
    },
    {
      title: translate('web.common.tupian'),
      dataIndex: 'picUrl',
      render: (picUrl) => <StandardImage width={66} height={40} src={picUrl} />,
    },
    {
      title: translate('web.common.name'),
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.shop.tiaozhuanleixing'),
      dataIndex: 'type',
      render: (type, record) => {
        if (layoutType === LAYOUT_TYPE.shop && record.type === NAV_TYPE.mallHome) {
          return translate('web.resource.shop.dianpushouye')
        } else {
          return getTypeName(type, record.valueText)
        }
      },
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      width: 130,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            {translate('web.common.edit')}
          </Button>
          <Popconfirm
            title={translate('web.common.shifouquerenshanchu')}
            onConfirm={() => handleDeleteItem(record.sort)}
          >
            <Button type="link">{translate('web.common.delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <SettingPanel onCancel={handleCancel} onOK={handleConfirmSave}>
      <Form
        form={componentForm}
        labelAlign="left"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
        onValuesChange={() => setChangeState(true)}
      >
        <Form.Item
          label={translate('web.resource.shop.zujiankuandu')}
          name="componentHeight"
          initialValue={componentHeight}
          rules={[
            {
              required: true,
              message: translate('web.common.qingshuru'),
            },
          ]}
        >
          <InputNumber style={{ width: '100%' }} addonAfter="px" />
        </Form.Item>
        <Form.Item label={translate('web.resource.shop.shangxiabianju')}>
          <Row gutter={12}>
            <Col span={22}>
              <Form.Item name="verticalMargin" initialValue={verticalMargin}>
                <Slider
                  min={0}
                  max={100}
                  onChange={(value) => setTempVerticalMargin(value)}
                  tooltip={{
                    open: false,
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={2}>
              <span style={{ position: 'relative', top: 6 }}>{tempVerticalMargin}px</span>
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <LineTitle
        extra={
          <Button
            type="primary"
            icon={<PlusIcon />}
            onClick={() => {
              setOptionType('add')
              setModalVisible(true)
            }}
          >
            {translate('web.common.addResource')}
          </Button>
        }
      >
        <span>{translate('web.resource.commodity.tupianbianji')}</span>
        <label className={styles['line-subtitle']}>{translate('web.resource.shop.duoyuyzhangshizidonglunbo')}</label>
      </LineTitle>
      <DndContextProvider {...dndProps} handleDragEnd={handleDragEnd} items={list.map((item) => item.sort)}>
        <Table
          rowKey="sort"
          columns={columns}
          dataSource={list}
          pagination={false}
          components={{
            body: {
              row: TableRow,
            },
          }}
        />
      </DndContextProvider>
      <CommonItemModal
        title={optionType === 'add' ? translate('web.common.addResource') : translate('web.common.edit')}
        visible={modalVisible}
        layoutType={layoutType}
        formSchema={[
          {
            type: ModalFormType.Input,
            name: 'sort',
            hidden: true,
          },
          {
            type: ModalFormType.Upload,
            label: translate('web.common.tupian'),
            name: 'picUrl',
            rules: [
              {
                required: true,
                message: translate('web.resource.shop.qingshangchuantupian'),
              },
            ],
          },
          {
            type: ModalFormType.Input,
            name: 'name',
            label: translate('web.common.name'),
            rules: [
              {
                required: true,
                message: translate('web.common.qingshuru'),
              },
            ],
          },
          {
            type: ModalFormType.DateRange,
            name: 'effectiveTime',
            label: translate('web.resource.shop.youxiaoqi'),
          },
          {
            type: ModalFormType.NavType,
            name: 'type',
            label: translate('web.resource.shop.daohangleixing'),
            rules: [
              {
                required: true,
                message: translate('web.common.qingxuanze'),
              },
            ],
          },
        ]}
        form={form}
        onOk={handleModalConfirm}
        onCancel={() => {
          setModalVisible(false)
          form.resetFields()
        }}
      />
    </SettingPanel>
  )
}

export default HorizontalBanner
