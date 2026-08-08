import SettingPanel from '@/pages/pageCustomized/components/SettingPanel'
import { LineTitle } from '@apps/components'
import { changeProps, clearSelectedStatus, produce } from '@apps/design-core'
import { DragIcon, PlusIcon } from '@linkseeks/icons'
import { Button, Radio, RadioGroup, Table, Tag } from '@linkseeks/ui'
import { Col, Form, Input, Popconfirm, Row, Modal, Slider, Space, Switch } from 'antd'
import { useEffect, useState } from 'react'
import { getWebIntl } from '@apps/locales'
import cloneDeep from 'lodash/cloneDeep'
import { ColumnsType } from 'antd/lib/table'
import { arrayMove } from '@linkseeks/tools'
import CommodityDrawer from '@/pages/pageCustomized/components/drawers/commodityDrawer'
import ActivityCommodityDrawer from '@/pages/pageCustomized/components/drawers/activityCommodityDrawer'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { RecommentCommodityItemType } from '@apps/design-ui/src/constants/commodity'
import { CommodityItemType } from '@apps/design-ui/src/Web/CommodityFloor/goods'
import { SubNavItemType } from '@apps/design-ui/src/Web/CommodityFloor'
import { DndContextProvider, useDnd } from '../MallNav/useDnd'
import { getTypeName } from '../MallNav/constants'
import TableRow from '../MallNav/TableRow'
import styles from '../AdvertSetting/index.less'
import { resetListSort } from '@/pages/pageCustomized/utils'

interface IProps {
  title?: string
  /** 上下边距 */
  verticalMargin?: number
  /** 商品类型 */
  showType?: 'normal' | 'marketing'
  commodityList: RecommentCommodityItemType[]
  layoutType: LAYOUT_TYPE
  showTitle?: boolean
}

const CommodityReCommend: React.FC<IProps> = (props) => {
  const { commodityList, title, verticalMargin = 0, showType = 'normal', showTitle = true, layoutType } = props
  const [list, setList] = useState<RecommentCommodityItemType[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [activityDrawerVisible, setActivityDrawerVisible] = useState<boolean>(false)
  const [tagModalVisible, setTagModalVisible] = useState<boolean>(false)
  const [changeState, setChangeState] = useState<boolean>(false)
  const [tempVerticalMargin, setTempVerticalMargin] = useState<number>(verticalMargin)
  const [currentRecord, setCurrentRecord] = useState<RecommentCommodityItemType>()
  const translate = getWebIntl()
  const [componentForm] = Form.useForm()
  const [tagForm] = Form.useForm()
  const [selectShowType, setSelectShowType] = useState<'normal' | 'marketing'>(showType)
  const dndProps = useDnd()

  useEffect(() => {
    if (commodityList && commodityList.length > 0) {
      setList(cloneDeep(commodityList))
    }
  }, [commodityList])

  const updateList = (list: any[]) => {
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
          commodityList: resetListSort(list),
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

  const handleEdit = (record: any) => {
    setModalVisible(true)
  }

  const columns: ColumnsType<SubNavItemType> = [
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
      title: translate('web.common.name'),
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.shop.tiaozhuanleixing'),
      dataIndex: 'type',
      render: (type: number, record) => getTypeName(type, record.valueText),
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

  const handleAddTags = (record: RecommentCommodityItemType) => {
    setCurrentRecord(record)
    setTagModalVisible(true)
  }

  const handleDeleteTag = (record: RecommentCommodityItemType, tag: string) => {
    updateList(
      produce(list, (oldList) => {
        oldList.map((listItem) => {
          if (listItem.sort === record?.sort) {
            listItem.tags = (listItem.tags || []).filter((tagItem) => tagItem !== tag)
          }
        })
        return oldList
      }),
    )
  }

  const commodityColumns: ColumnsType<RecommentCommodityItemType> = [
    {
      title: translate('web.common.sort'),
      dataIndex: 'sort',
      width: 60,
      render: () => (
        <div className={styles['drag-btn']}>
          <DragIcon size={16} />
        </div>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: translate('web.resource.shop.shangpinguigemingcheng'),
      dataIndex: 'name',
    },
    {
      title: translate('web.resource.shop.zhanshibiaoqian'),
      dataIndex: 'tags',
      width: 180,
      render: (tags, record) => {
        return Array.isArray(tags)
          ? tags.map((tag) => (
              <Tag key={tag} color="red" closable onClose={() => handleDeleteTag(record, tag)}>
                {tag}
              </Tag>
            ))
          : ''
      },
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      width: 160,
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleAddTags(record)}>
            {translate('web.resource.shop.tianjiabiaoqian')}
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

  const onChooseCommodityConfirm = (chooseList: any) => {
    const sortList = produce(list, (oldList) => {
      return oldList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
    })
    const newSort = sortList.length > 0 ? sortList[sortList.length - 1].sort : 0

    const newList: RecommentCommodityItemType[] = chooseList.map((item, index) => ({
      id: item.id,
      commodityId: item.id,
      name: item.name,
      mainPic: item.mainPic,
      price: item.min,
      unitName: item.unitName,
      sold: item.sold || 0,
      tags: [],
      storeId: item.storeId,
      sort: newSort + (index + 1),
      priceType: item.priceType || 1,
    }))
    updateList([...list, ...newList])
    setModalVisible(false)
  }

  const onChooseActivityCommodityConfirm = (chooseList: any) => {
    const sortList = produce(list, (oldList) => {
      return oldList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
    })
    const newSort = sortList.length > 0 ? sortList[sortList.length - 1].sort : 0

    const newList: RecommentCommodityItemType[] = chooseList.map((item, index) => ({
      id: item.skuId,
      commodityId: item.id,
      skuId: item.skuId,
      name: item.productName,
      mainPic: item.productImgUrl,
      price: item.price,
      priceType: item.priceType || 1,
      activityPrice: item.activityPrice,
      unitName: item.unit,
      sold: item.sold || 0,
      tags: [],
      storeId: item.storeId,
      sort: newSort + (index + 1),
    }))

    updateList([...list, ...newList])
    setActivityDrawerVisible(false)
  }

  const handleTagModalConfirm = () => {
    tagForm.validateFields().then((values) => {
      updateList(
        produce(list, (oldList) => {
          oldList.map((listItem) => {
            if (listItem.sort === currentRecord?.sort) {
              listItem.tags = [...(listItem.tags || []), values.tag]
            }
          })
          return oldList
        }),
      )
      tagForm.resetFields()
      setTagModalVisible(false)
    })
  }

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
          label={translate('web.resource.shop.xianshibiaoti')}
          name="showTitle"
          initialValue={showTitle}
          valuePropName="checked"
          rules={[
            {
              required: true,
              message: translate('web.common.qingxuanze'),
            },
          ]}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          label={translate('web.resource.shop.mokuaibiaoti')}
          name="title"
          initialValue={title}
          rules={[
            {
              required: true,
              message: translate('web.common.qingshuru'),
            },
          ]}
        >
          <Input style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label={translate('web.resource.shop.shangxiabianju')}>
          <Row gutter={12}>
            <Col span={22}>
              <Form.Item name="verticalMargin" initialValue={verticalMargin} style={{ marginBottom: 0 }}>
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
        <Form.Item
          label={translate('web.resource.commodity.shanpinleixing')}
          name="showType"
          initialValue={showType}
          rules={[
            {
              required: true,
              message: translate('web.common.qingxuanze'),
            },
          ]}
        >
          <RadioGroup
            onChange={(e) => {
              if (list && list.length > 0) {
                Modal.confirm({
                  title: translate('web.resource.shop.xiugaishagnpnileixintip'),
                  onOk: () => {
                    setSelectShowType(e.target.value)
                    setList([])
                  },
                  onCancel: () => {
                    const type = e.target.value === 'normal' ? 'marketing' : 'normal'
                    setSelectShowType(type)
                    componentForm.setFieldValue('showType', type)
                  },
                })
              } else {
                setSelectShowType(e.target.value)
              }
            }}
          >
            <Radio value={'normal'}>{translate('web.resource.shop.putongshangpin')}</Radio>
            <Radio value={'marketing'}>{translate('web.resource.shop.yingxiaoshangpin')}</Radio>
          </RadioGroup>
        </Form.Item>
      </Form>
      <LineTitle
        style={{ marginTop: 24 }}
        extra={
          <Button
            type="primary"
            icon={<PlusIcon />}
            onClick={() => {
              if (selectShowType === 'normal') {
                setModalVisible(true)
              } else {
                setActivityDrawerVisible(true)
              }
            }}
          >
            {translate('web.common.addResource')}
          </Button>
        }
      >
        <span>{translate('web.resource.shop.tuijianshangpinpeizhi')}</span>
      </LineTitle>
      <DndContextProvider {...dndProps} handleDragEnd={handleDragEnd} items={list.map((item) => item.sort)}>
        <Table
          rowKey="sort"
          columns={commodityColumns}
          dataSource={list}
          pagination={false}
          components={{
            body: {
              row: TableRow,
            },
          }}
        />
      </DndContextProvider>
      <CommodityDrawer
        selectId={list.map((item) => item.id)}
        layoutType={layoutType}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={onChooseCommodityConfirm}
        selectType="checkbox"
        showActivity={false}
      />
      <ActivityCommodityDrawer
        selectId={list.map((item) => item.id)}
        visible={activityDrawerVisible}
        onCancel={() => setActivityDrawerVisible(false)}
        onOk={onChooseActivityCommodityConfirm}
      />
      <Modal
        open={tagModalVisible}
        onCancel={() => setTagModalVisible(false)}
        title={translate('web.resource.shop.tianjiabiaoqian')}
        centered
        destroyOnClose
        onOk={handleTagModalConfirm}
      >
        <Form form={tagForm}>
          <Form.Item
            name="tag"
            rules={[
              {
                required: true,
                message: translate('web.common.qingshuru'),
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </SettingPanel>
  )
}

export default CommodityReCommend
