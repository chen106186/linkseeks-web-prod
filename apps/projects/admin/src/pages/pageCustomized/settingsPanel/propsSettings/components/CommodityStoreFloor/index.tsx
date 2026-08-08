import SettingPanel from '@/pages/pageCustomized/components/SettingPanel'
import { LineTitle, SingleCardUpload } from '@apps/components'
import { changeProps, clearSelectedStatus, produce } from '@apps/design-core'
import { DragIcon, PlusIcon } from '@linkseeks/icons'
import { Button, Table } from '@linkseeks/ui'
import { Col, Form, Input, Popconfirm, Row, Select, Slider, Space, Switch, TreeSelect } from 'antd'
import { Fragment, useEffect, useRef, useState } from 'react'
import { getWebIntl } from '@apps/locales'
import cloneDeep from 'lodash/cloneDeep'
import { NAV_TYPE } from '@apps/design-ui'
import { ColumnsType } from 'antd/lib/table'
import { arrayMove } from '@linkseeks/tools'
import CommodityDrawer from '@/pages/pageCustomized/components/drawers/commodityDrawer'
import MixDrawer from '@/pages/pageCustomized/components/drawers/mixDrawer'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import ActivityDrawer from '@/pages/pageCustomized/components/drawers/activityDrawer'
import { CommodityItemType } from '@apps/design-ui/src/Web/CommodityStoreFloor/goods'
import { BrandItemType } from '@apps/design-ui/src/Web/CommodityStoreFloor/brand'
import { ShopsItemType } from '@apps/design-ui/src/Web/CommodityStoreFloor/shops'
import { SubNavItemType } from '@apps/design-ui/src/Web/CommodityFloor'
import { DndContextProvider, useDnd } from '../MallNav/useDnd'
import useSelectOptions from '../CommonItemModal/useSelectOption'
import { NAV_TYPE_OPTION, getTypeName } from '../MallNav/constants'
import TableRow from '../MallNav/TableRow'
import CommonItemModal, { ModalFormType } from '../CommonItemModal'
import Goods, { GoodsActionType } from './goods'
import Store, { StoreActionType } from './store'
import Brand, { BrandActionType } from './brand'
import styles from '../AdvertSetting/index.less'
import { resetListSort } from '@/pages/pageCustomized/utils'

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
  showBrand?: boolean
  /** 二级入口配置 */
  subNavList?: SubNavItemType[]
  commodityList: CommodityItemType[]
  brandList: BrandItemType[]
  storeList: ShopsItemType[]
  layoutType: LAYOUT_TYPE
}

const CommodityStoreFloor: React.FC<IProps> = (props) => {
  const {
    commodityList,
    brandList,
    storeList,
    moreType,
    moreValueText,
    moreValue,
    floorImg,
    subNavList,
    title,
    verticalMargin = 8,
    showBrand = false,
    layoutType,
  } = props
  const [optionType, setOptionType] = useState<'add' | 'edit'>('add')
  const [navList, setNavList] = useState<SubNavItemType[]>([])
  const [navModalVisible, setNavModalVisible] = useState<boolean>(false)
  const [commodityDrawerVisible, setCommodityDrawerVisible] = useState<boolean>(false)
  const [activityDrawerVisible, setActivityDrawerVisible] = useState<boolean>(false)
  const [mixDrawerVisible, setMixDrawerVisible] = useState<boolean>(false)
  const { categoryOptions } = useSelectOptions()
  const [changeState, setChangeState] = useState<boolean>(false)
  const [tempVerticalMargin, setTempVerticalMargin] = useState<number>(verticalMargin)
  const [showBrandConfig, setShowBrandConfig] = useState<boolean>(showBrand)
  const translate = getWebIntl()
  const [componentForm] = Form.useForm()
  const [navForm] = Form.useForm()
  const dndProps = useDnd()
  const commodityRef = useRef<GoodsActionType>(null)
  const storeRef = useRef<StoreActionType>(null)
  const brandRef = useRef<BrandActionType>(null)

  useEffect(() => {
    if (subNavList && subNavList.length > 0) {
      console.log(subNavList, 'subNavList')
      setNavList(cloneDeep(subNavList))
    }
  }, [subNavList])

  const updateList = (list: any[]) => {
    setNavList(list)
    setChangeState(true)
  }

  const handleDeleteItem = (sort: number) => {
    updateList(navList.filter((item) => item.sort !== sort))
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
          commodityList: resetListSort(commodityRef.current?.getList()),
          storeList: resetListSort(storeRef.current?.getList()),
          brandList: resetListSort(brandRef.current?.getList()),
          subNavList: resetListSort(navList),
          canDelete: true,
        },
      })
      clearSelectedStatus()
    })
  }

  const handleNavDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = navList.findIndex((v) => v.sort === active.id)
      const newIndex = navList.findIndex((v) => v.sort === over.id)
      updateList(arrayMove(navList, oldIndex, newIndex))
    }
  }

  const handleModalConfirm = () => {
    navForm.validateFields().then((values) => {
      if (optionType === 'add') {
        const sortList = navList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
        const newSort = sortList.length > 0 ? sortList[sortList.length - 1].sort + 1 : 1
        updateList([
          ...navList,
          {
            ...values,
            sort: newSort,
          },
        ])
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

        updateList(newList)
      }
      setNavModalVisible(false)
      navForm.resetFields()
    })
  }

  const handleEdit = (record: any) => {
    setOptionType('edit')
    setNavModalVisible(true)
    navForm.setFieldsValue({
      ...record,
    })
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
                    <Form.Item name="moreValue" initialValue={moreValue} hidden>
                      <Input />
                    </Form.Item>
                    <Form.Item
                      label={translate('web.resource.marketing.zhuantiye')}
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
          name="showBrand"
          label={translate('web.resource.shop.pinpaituijian')}
          initialValue={showBrand}
          valuePropName="checked"
        >
          <Switch onChange={(checked) => setShowBrandConfig(checked)} />
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
      <Goods commodityList={commodityList} actionRef={commodityRef} onChange={() => setChangeState(true)} />
      <Store storeList={storeList} actionRef={storeRef} onChange={() => setChangeState(true)} />
      {showBrandConfig && <Brand brandList={brandList} actionRef={brandRef} onChange={() => setChangeState(true)} />}
    </SettingPanel>
  )
}

export default CommodityStoreFloor
