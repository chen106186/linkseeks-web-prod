import SettingPanel from '@/pages/design/components/SettingPanel'
import { LineTitle, SingleCardUpload } from '@apps/components'
import { changeProps, clearSelectedStatus, produce } from '@apps/design-core'
import { DragIcon, PlusIcon } from '@linkseeks/icons'
import { Button, Radio, RadioGroup, Table } from '@linkseeks/ui'
import { Col, Form, Input, message, Popconfirm, Row, Select, Slider, Space, TreeSelect } from 'antd'
import { Fragment, useEffect, useState } from 'react'
import { getWebIntl } from '@apps/locales'
import cloneDeep from 'lodash/cloneDeep'
import { NAV_TYPE } from '@apps/design-ui'
import { ColumnsType } from 'antd/lib/table'
import { arrayMove } from '@linkseeks/tools'
import CommodityDrawer from '@/pages/design/components/drawer/commodityDrawer'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import ActivityDrawer from '@/pages/design/components/drawer/activityDrawer'
import { CommodityItemType } from '@apps/design-ui/src/Web/CommodityFloor/goods'
import { SubNavItemType } from '@apps/design-ui/src/Web/CommodityFloor'
import { DndContextProvider, useDnd } from '../MallNav/useDnd'
import useSelectOptions from '../CommonItemModal/useSelectOption'
import { NAV_TYPE_OPTION, getTypeName } from '../MallNav/constants'
import TableRow from '../MallNav/TableRow'
import CommonItemModal, { ModalFormType } from '../CommonItemModal'
import styles from '../AdvertSetting/index.less'
import MixDrawer from '@/pages/design/components/drawer/mixDrawer'
import { resetListSort } from '@/pages/design/utils'

interface IProps {
  title?: string
  /** 更多好货跳转类型 */
  moreType?: NAV_TYPE
  /** 更多好货跳转内容 */
  moreValue?: string
  moreValueText?: string
  /** 上下边距 */
  verticalMargin?: number
  /** 楼层图片 */
  floorImg?: string
  /** 二级入口配置 */
  subNavList?: SubNavItemType[]
  /** 显示数量 */
  showCount?: number
  commodityList: CommodityItemType[]
  layoutType: LAYOUT_TYPE
}

const CommodityFloor: React.FC<IProps> = (props) => {
  const {
    commodityList,
    moreType,
    moreValueText,
    moreValue,
    floorImg,
    subNavList,
    title,
    verticalMargin = 8,
    showCount = 8,
    layoutType,
  } = props
  const [optionType, setOptionType] = useState<'add' | 'edit'>('add')
  const [list, setList] = useState<CommodityItemType[]>([])
  const [navList, setNavList] = useState<SubNavItemType[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [navModalVisible, setNavModalVisible] = useState<boolean>(false)
  const [commodityDrawerVisible, setCommodityDrawerVisible] = useState<boolean>(false)
  const [activityDrawerVisible, setActivityDrawerVisible] = useState<boolean>(false)
  const [mixDrawerVisible, setMixDrawerVisible] = useState<boolean>(false)
  const { categoryOptions } = useSelectOptions()
  const [changeState, setChangeState] = useState<boolean>(false)
  const [tempVerticalMargin, setTempVerticalMargin] = useState<number>(verticalMargin)
  const translate = getWebIntl()
  const [componentForm] = Form.useForm()
  const [form] = Form.useForm()
  const [navForm] = Form.useForm()
  const dndProps = useDnd()

  useEffect(() => {
    if (commodityList && commodityList.length > 0) {
      setList(cloneDeep(commodityList))
    }
  }, [commodityList])

  useEffect(() => {
    if (subNavList && subNavList.length > 0) {
      setNavList(cloneDeep(subNavList))
    }
  }, [subNavList])

  const updateList = (list: any[], type: 'nav' | 'commodity') => {
    if (type === 'nav') {
      setNavList(list)
    } else {
      setList(list)
    }
    setChangeState(true)
  }

  const handleDeleteItem = (sort: number, type: 'nav' | 'commodity') => {
    if (type === 'nav') {
      updateList(
        navList.filter((item) => item.sort !== sort),
        type,
      )
    } else {
      updateList(
        list.filter((item) => item.sort !== sort),
        type,
      )
    }
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
          subNavList: resetListSort(navList),
          canDelete: true,
        },
      })
      clearSelectedStatus()
    })
  }

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = list.findIndex((v) => v.commodityId === active.id)
      const newIndex = list.findIndex((v) => v.commodityId === over.id)
      updateList(arrayMove(list, oldIndex, newIndex), 'commodity')
    }
  }

  const handleNavDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = navList.findIndex((v) => v.sort === active.id)
      const newIndex = navList.findIndex((v) => v.sort === over.id)
      updateList(arrayMove(navList, oldIndex, newIndex), 'nav')
    }
  }

  const handleModalConfirm = () => {
    navForm.validateFields().then((values) => {
      if (optionType === 'add') {
        const sortList = navList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        const newSort = sortList.length > 0 ? sortList[sortList.length - 1].sort + 1 : 1
        updateList(
          [
            ...navList,
            {
              ...values,
              sort: newSort,
            },
          ],
          'nav',
        )
      } else {
        const newList = produce(navList, (oldList) => {
          oldList.map((listItem) => {
            if (listItem.sort === values.sort) {
              listItem.name = values.name
              listItem.type = values.type
              listItem.value = values.value
              listItem.valueText = values.valueText
            }
          })
          return oldList
        })

        updateList(newList, 'nav')
      }
      setNavModalVisible(false)
      navForm.resetFields()
    })
  }

  const handleEdit = (record: any, type: 'nav' | 'commodity') => {
    setOptionType('edit')
    if (type === 'nav') {
      setNavModalVisible(true)
      navForm.setFieldsValue({
        ...record,
      })
    } else {
      setModalVisible(true)
    }
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
          <Button type="link" onClick={() => handleEdit(record, 'nav')}>
            {translate('web.common.edit')}
          </Button>
          <Popconfirm
            title={translate('web.common.shifouquerenshanchu')}
            onConfirm={() => handleDeleteItem(record.sort, 'nav')}
          >
            <Button type="link">{translate('web.common.delete')}</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const commodityColumns: ColumnsType<CommodityItemType> = [
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
      title: 'ID',
      dataIndex: 'commodityId',
    },
    {
      title: translate('web.resource.commodity.name'),
      dataIndex: 'commodityName',
    },
    {
      title: translate('web.resource.shop.guishupinlei'),
      dataIndex: 'commodityCategory',
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      width: 130,
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={translate('web.common.shifouquerenshanchu')}
            onConfirm={() => handleDeleteItem(record.sort, 'commodity')}
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

    const newList: CommodityItemType[] = chooseList.map((item, index) => ({
      sort: newSort + (index + 1),
      priceType: item.priceType,
      storeId: item.storeId,
      commodityId: item.id,
      commodityName: item.name,
      commodityPicUrl: item.mainPic,
      commodityPrice: item.min,
      commodityCategory: item.customerCategoryName,
    }))

    if ([...list, ...newList].length > 8) {
      message.info(translate('web.resource.shop.zuiduotianjialiugetuijianshangpin'))
      return
    }
    updateList([...list, ...newList], 'commodity')
    setModalVisible(false)
  }

  const onChooseConfirm = (chooseItem: any) => {
    componentForm.setFieldsValue({
      moreValue: chooseItem.id,
      moreValueText: chooseItem.name,
    })
    setCommodityDrawerVisible(false)
  }

  const onChooseActivityConfirm = (chooseItem: any) => {
    componentForm.setFieldsValue({
      moreValue: chooseItem.id,
      moreValueText: chooseItem.name,
    })
    setActivityDrawerVisible(false)
  }

  const onChooseCpecialPageConfirm = (chooseItem: any) => {
    componentForm.setFieldsValue({
      moreValue: chooseItem.id,
      moreValueText: chooseItem.name,
    })
    setMixDrawerVisible(false)
  }

  const getNavOption = () => {
    return NAV_TYPE_OPTION.filter((item) => {
      if (layoutType === LAYOUT_TYPE.shop && item.value === NAV_TYPE.srm) {
        return false
      }
      return true
    }).map((item) => ({
      ...item,
      label:
        layoutType === LAYOUT_TYPE.shop && item.value === NAV_TYPE.mallHome
          ? translate('web.resource.shop.dianpushouye')
          : item.label,
    }))
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
          label={translate('web.resource.shop.louchengmingcheng')}
          name="title"
          initialValue={title}
          rules={[
            {
              required: true,
              message: translate('web.common.qingshuru'),
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="moreType"
          initialValue={moreType}
          label={translate('web.resource.shop.loucengtiaozhuan')}
          rules={[
            {
              required: true,
              message: translate('web.common.qingxuanze'),
            },
          ]}
        >
          <Select options={getNavOption()} onChange={() => componentForm.resetFields(['moreValue', 'moreValueText'])} />
        </Form.Item>
        <Form.Item noStyle shouldUpdate={(prevValues, curValues) => prevValues.moreType !== curValues.moreType}>
          {({ getFieldValue }) => {
            const type: NAV_TYPE = getFieldValue('moreType')
            switch (type) {
              case NAV_TYPE.customLink:
                return (
                  <Form.Item
                    label={translate('web.resource.shop.lianjiedizhi')}
                    name="moreValue"
                    initialValue={moreValue}
                    rules={[
                      {
                        required: true,
                        message: translate('web.common.qingshuru'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                )
              case NAV_TYPE.keyword:
                return (
                  <Form.Item
                    label={translate('web.resource.mall.sousuoguanjiazi')}
                    name="moreValue"
                    initialValue={moreValue}
                    rules={[
                      {
                        required: true,
                        message: translate('web.common.qingshuru'),
                      },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                )
              case NAV_TYPE.category:
                return (
                  <Form.Item
                    label={translate('web.resource.commodity.category')}
                    name="moreValue"
                    initialValue={moreValue}
                    rules={[
                      {
                        required: true,
                        message: translate('web.common.qingxuanze'),
                      },
                    ]}
                  >
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder={translate('web.common.qingxuanze')}
                      allowClear
                      treeDefaultExpandAll
                      treeData={categoryOptions}
                    />
                  </Form.Item>
                )
              case NAV_TYPE.commodityDetail:
                return (
                  <Fragment>
                    <Form.Item name="moreValue" initialValue={moreValue} hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={translate('web.resource.mall.commodity')}
                      initialValue={moreValueText}
                      name="moreValueText"
                      rules={[
                        {
                          required: true,
                          message: translate('web.common.qingxuanze'),
                        },
                      ]}
                    >
                      <Input
                        disabled
                        addonAfter={
                          <Button
                            type="primary"
                            className={styles['connect-button']}
                            onClick={() => setCommodityDrawerVisible(true)}
                          >
                            {translate('web.resource.shop.guanlian')}
                          </Button>
                        }
                      />
                    </Form.Item>
                  </Fragment>
                )
              case NAV_TYPE.marketing:
                return (
                  <Fragment>
                    <Form.Item name="moreValue" initialValue={moreValue} hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={translate('web.resource.shop.yingxiaohuodong')}
                      initialValue={moreValueText}
                      name="moreValueText"
                      rules={[
                        {
                          required: true,
                          message: translate('web.common.qingxuanze'),
                        },
                      ]}
                    >
                      <Input
                        disabled
                        addonAfter={
                          <Button
                            type="primary"
                            className={styles['connect-button']}
                            onClick={() => setActivityDrawerVisible(true)}
                          >
                            {translate('web.resource.shop.guanlian')}
                          </Button>
                        }
                      />
                    </Form.Item>
                  </Fragment>
                )
              case NAV_TYPE.cpecialPage:
                return (
                  <Fragment>
                    <Form.Item name="moreValue" hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={translate('web.resource.marketing.zhuantiye')}
                      name="moreValueText"
                      rules={[
                        {
                          required: true,
                          message: translate('web.common.qingxuanze'),
                        },
                      ]}
                    >
                      <Input
                        disabled
                        addonAfter={
                          <Button
                            type="primary"
                            className={styles['connect-button']}
                            onClick={() => setMixDrawerVisible(true)}
                          >
                            {translate('web.resource.shop.guanlian')}
                          </Button>
                        }
                      />
                    </Form.Item>
                  </Fragment>
                )
              default:
                return null
            }
          }}
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
        <Form.Item
          label={translate('web.resource.shop.shangpinshuliang')}
          name="showCount"
          initialValue={showCount}
          rules={[
            {
              required: true,
              message: translate('web.common.qingxuanze'),
            },
          ]}
        >
          <RadioGroup>
            <Radio value={8}>8{translate('web.common.ge')}</Radio>
            <Radio value={4}>4{translate('web.common.ge')}</Radio>
          </RadioGroup>
        </Form.Item>
        <Form.Item
          name="floorImg"
          label={translate('web.resource.shop.loucengtupian')}
          initialValue={floorImg}
          rules={[
            {
              required: true,
              message: translate('web.resource.shop.qingshangchuantupian'),
            },
          ]}
        >
          <SingleCardUpload maxSize={2} tips />
        </Form.Item>
      </Form>
      <LineTitle
        extra={
          <Button
            type="primary"
            icon={<PlusIcon />}
            onClick={() => {
              setOptionType('add')
              setNavModalVisible(true)
            }}
          >
            {translate('web.common.addResource')}
          </Button>
        }
      >
        <span>{translate('web.resource.shop.erjirukoupeizhi')}</span>
      </LineTitle>
      <DndContextProvider {...dndProps} handleDragEnd={handleNavDragEnd} items={navList.map((item) => item.sort)}>
        <Table
          rowKey="sort"
          columns={columns}
          dataSource={navList}
          pagination={false}
          components={{
            body: {
              row: TableRow,
            },
          }}
        />
      </DndContextProvider>
      <LineTitle
        style={{ marginTop: 24 }}
        extra={
          <Button
            type="primary"
            icon={<PlusIcon />}
            onClick={() => {
              setModalVisible(true)
            }}
          >
            {translate('web.common.addResource')}
          </Button>
        }
      >
        <span>{translate('web.resource.shop.tuijianshangpinpeizhi')}</span>
      </LineTitle>
      <DndContextProvider {...dndProps} handleDragEnd={handleDragEnd} items={list.map((item) => item.commodityId)}>
        <Table
          rowKey="commodityId"
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
      <CommonItemModal
        title={optionType === 'add' ? translate('web.common.addResource') : translate('web.common.edit')}
        visible={navModalVisible}
        layoutType={layoutType}
        formSchema={[
          {
            type: ModalFormType.Input,
            name: 'sort',
            hidden: true,
          },
          {
            type: ModalFormType.Input,
            name: 'name',
            label: translate('web.resource.shop.daohangmingcheng'),
            rules: [
              {
                required: true,
                message: translate('web.common.qingshuru'),
              },
            ],
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
        form={navForm}
        onOk={handleModalConfirm}
        onCancel={() => {
          setNavModalVisible(false)
          navForm.resetFields()
        }}
      />
      <CommodityDrawer
        selectId={componentForm.getFieldValue('moreValue')}
        layoutType={layoutType}
        visible={commodityDrawerVisible}
        onClose={() => setCommodityDrawerVisible(false)}
        onConfirm={onChooseConfirm}
        selectType="radio"
        showActivity={false}
      />
      <ActivityDrawer
        selectId={componentForm.getFieldValue('moreValue')}
        visible={activityDrawerVisible}
        onClose={() => setActivityDrawerVisible(false)}
        onConfirm={onChooseActivityConfirm}
      />
      <CommodityDrawer
        selectId={list.map((item) => item.commodityId)}
        layoutType={layoutType}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={onChooseCommodityConfirm}
        selectType="checkbox"
        showActivity={false}
      />
      <MixDrawer
        selectId={componentForm.getFieldValue('moreValue')}
        visible={mixDrawerVisible}
        onClose={() => setMixDrawerVisible(false)}
        onConfirm={onChooseCpecialPageConfirm}
        type={7}
        environment={1}
        property={1}
        layoutType={LAYOUT_TYPE.cpecialPage}
      />
    </SettingPanel>
  )
}

export default CommodityFloor
