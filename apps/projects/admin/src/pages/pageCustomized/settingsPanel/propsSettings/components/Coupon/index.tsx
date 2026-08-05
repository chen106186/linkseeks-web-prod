import SettingPanel from '@/pages/pageCustomized/components/SettingPanel'
import { ImageBox, LineTitle } from '@apps/components'
import { changeProps, clearSelectedStatus, produce } from '@apps/design-core'
import { DragIcon, PlusIcon } from '@linkseeks/icons'
import { Button, RadioGroup, Table } from '@linkseeks/ui'
import { Col, Form, Input, InputNumber, Popconfirm, Radio, Row, Slider, Space, Switch } from 'antd'
import { useEffect, useState } from 'react'
import { getWebIntl } from '@apps/locales'
import cloneDeep from 'lodash/cloneDeep'
import { ColumnsType } from 'antd/lib/table'
import { arrayMove } from '@linkseeks/tools'
import { formatTimeString } from '@/utils'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { CouponItemType } from '@apps/design-ui/src/Web/Coupon'
import CouponsDrawer from '@/pages/pageCustomized/components/drawers/couponsDrawer'
import { DndContextProvider, useDnd } from '../MallNav/useDnd'
import TableRow from '../MallNav/TableRow'
import styles from '../AdvertSetting/index.less'
import { resetListSort } from '@/pages/pageCustomized/utils'

interface IProps {
  couponList: CouponItemType[]
  showTitle: boolean
  title: string
  verticalMargin: number
  layoutType: LAYOUT_TYPE
}

const Coupon: React.FC<IProps> = (props) => {
  const { couponList, showTitle = true, title, verticalMargin = 0 } = props
  const [list, setList] = useState<CouponItemType[]>([])
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [changeState, setChangeState] = useState<boolean>(false)
  const [tempVerticalMargin, setTempVerticalMargin] = useState<number>(verticalMargin)
  const translate = getWebIntl()
  const [componentForm] = Form.useForm()
  const dndProps = useDnd()

  useEffect(() => {
    if (couponList && couponList.length > 0) {
      const newList: CouponItemType[] = cloneDeep(couponList)
      setList(newList)
    }
  }, [couponList])

  const updateList = (list: CouponItemType[]) => {
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
          couponList: resetListSort(list),
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

  const onChooseCouponsConfirm = (chooseList: any) => {
    const sortList = produce(list, (oldList) => {
      return oldList.sort((a, b) => (b.sort > a.sort ? -1 : 1))
    })
    const newSort = sortList.length > 0 ? sortList[sortList.length - 1].sort : 0

    const newList: CouponItemType[] = chooseList.map((item, index) => ({
      sort: newSort + (index + 1),
      ...item,
    }))

    updateList([...list, ...newList])
    setModalVisible(false)
  }

  const columns: ColumnsType<CouponItemType> = [
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
      width: 60,
    },
    {
      title: translate('web.resource.shop.youhuiquanmingcheng'),
      dataIndex: 'name',
      ellipsis: true,
    },
    {
      title: translate('web.resource.shop.miane'),
      dataIndex: 'denomination',
    },
    {
      title: translate('web.common.leixing'),
      dataIndex: 'getWayName',
    },
    {
      title: translate('web.resource.shop.youxiaoqi'),
      dataIndex: 'effectiveTimeStart',
      key: 'effectiveTimeStart',
      render: (_: any, record: any) =>
        record.effectiveType === 1 ? (
          <>
            <div>&nbsp;{formatTimeString(record.effectiveTimeStart, 'YYYY-MM-DD HH:mm')}</div>
            <div>&nbsp;{formatTimeString(record.effectiveTimeEnd, 'YYYY-MM-DD HH:mm')}</div>
          </>
        ) : (
          <div>{translate('web.resource.shop.zilingqujitianneixiaoxiao', { day: record.invalidDay })}</div>
        ),
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      width: 80,
      render: (_, record) => (
        <Space>
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
            <Col span={21}>
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
              setModalVisible(true)
            }}
          >
            {translate('web.common.addResource')}
          </Button>
        }
      >
        <span>{translate('web.resource.shop.tuijianyouhuiquan')}</span>
        <label className={styles['line-subtitle']}>
          {translate('web.resource.mall.jinzhichilingquanfangshiweiqiantailingquandeyouhuiquan')}
        </label>
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
      <CouponsDrawer
        disabledKeys={list.map((item) => `${item.id}-${item.belongType}`)}
        visible={modalVisible}
        onConfirm={onChooseCouponsConfirm}
        selectType="checkbox"
        onClose={() => {
          setModalVisible(false)
        }}
      />
    </SettingPanel>
  )
}

export default Coupon
