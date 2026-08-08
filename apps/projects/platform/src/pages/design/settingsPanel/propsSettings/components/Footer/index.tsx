import { useEffect, useState } from 'react'
import SettingPanel from '@/pages/design/components/SettingPanel'
import { changeProps, clearSelectedStatus, produce } from '@apps/design-core'
import { Form, Input, Modal, Popconfirm, Space } from 'antd'
import { ImageBox, LineTitle, MultipleCardUpload } from '@apps/components'
import { getWebIntl } from '@apps/locales'
import { ConnectItemType } from '@apps/design-ui/src/Web/Footer'
import { SketchPicker } from 'react-color'
import { Button, Table } from '@linkseeks/ui'
import { PlusIcon, DragIcon } from '@linkseeks/icons'
import cloneDeep from 'lodash/cloneDeep'
import { ColumnsType } from 'antd/lib/table'
import { arrayMove } from '@linkseeks/tools'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import CommonItemModal, { ModalFormType } from '../CommonItemModal'
import { DndContextProvider, useDnd } from '../MallNav/useDnd'
import TableRow from '../MallNav/TableRow'
import styles from './index.less'

interface FooterProps {
  shopId: number
  backgroundColor?: string
  fontColor?: string
  linkdisable?: boolean
  title?: string
  connectList?: ConnectItemType[]
  imageList?: { url: string }[]
}

interface ColorFormItemProps {
  value?: string
  onChange?: (value: string) => void
}

const ColorFormItem: React.FC<ColorFormItemProps> = (props) => {
  const { value, onChange } = props

  const handleColorChange = ({ hex }) => {
    onChange?.(hex)
  }

  return (
    <div className={styles['color-picker-container']}>
      <div className={styles['select-color']}>
        <div className={styles['active-color']} style={{ background: value }}></div>
        <span className={styles['active-color-text']}>{value}</span>
      </div>
      <div className={styles.picker}>
        <SketchPicker color={value} onChangeComplete={handleColorChange} />
      </div>
    </div>
  )
}

const Footer: React.FC<FooterProps> = (props) => {
  const { shopId, backgroundColor = '#646A78', fontColor = '#FFFFFF', title, connectList, imageList } = props
  const [list, setList] = useState<ConnectItemType[]>([])
  const [changeState, setChangeState] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [modalVisible, setModalVisible] = useState<boolean>(false)
  const [optionType, setOptionType] = useState<'add' | 'edit'>('add')
  const [componentForm] = Form.useForm()
  const translate = getWebIntl()
  const dndProps = useDnd()

  useEffect(() => {
    if (connectList && connectList.length > 0) {
      const newList: ConnectItemType[] = cloneDeep(connectList)
      setList(newList)
    }
  }, [connectList])

  const updateList = (list: ConnectItemType[]) => {
    setList(list)
    setChangeState(true)
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
      console.log(values, 'values')
      changeProps({
        props: {
          ...values,
          connectList: list,
          shopId,
          linkdisable: true,
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

  const handleDeleteItem = (sort: number) => {
    updateList(list.filter((item) => item.sort !== sort))
  }

  const handleEdit = (record: ConnectItemType) => {
    setOptionType('edit')
    setModalVisible(true)
    form.setFieldsValue({
      ...record,
    })
  }

  const columns: ColumnsType<ConnectItemType> = [
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
      title: translate('web.resource.mall.tubiao'),
      dataIndex: 'icon',
      render: (icon) => <ImageBox width={24} height={24} src={icon} />,
    },
    {
      title: translate('web.resource.mall.xiaobiaoti'),
      dataIndex: 'title',
    },
    {
      title: translate('web.resource.mall.neirong'),
      dataIndex: 'content',
    },
    {
      title: translate('web.common.control'),
      dataIndex: 'option',
      width: 140,
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

  const handleModalConfirm = () => {
    form.validateFields().then((values) => {
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
          },
        ])
      } else {
        const newList = produce(list, (oldList) => {
          oldList.map((listItem) => {
            if (listItem.sort === values.sort) {
              listItem.title = values.title
              listItem.content = values.content
              listItem.icon = values.icon
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

  return (
    <SettingPanel onCancel={handleCancel} onOK={handleConfirmSave}>
      <Form
        form={componentForm}
        labelAlign="left"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
        onValuesChange={() => setChangeState(true)}
      >
        <Form.Item label="底色" name="backgroundColor" initialValue={backgroundColor} required>
          <ColorFormItem />
        </Form.Item>
        <Form.Item label="文字颜色" name="fontColor" initialValue={fontColor} required>
          <ColorFormItem />
        </Form.Item>
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
          <span>{translate('web.resource.mall.lianxifangshi')}</span>
          <label className={styles['line-subtitle']}>{translate('web.resource.mall.zuiduotianjiawutiao')}</label>
        </LineTitle>
        <Form.Item
          label={translate('web.resource.mall.biaotimingzi')}
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

        <LineTitle style={{ marginTop: 16 }}>
          <span>{translate('web.resource.mall.youcetupian')}</span>
          <label className={styles['line-subtitle']}>{translate('web.resource.mall.zuiduotianjialiangzhang')}</label>
        </LineTitle>
        <Form.Item name="imageList" initialValue={imageList}>
          <MultipleCardUpload />
        </Form.Item>
      </Form>
      <CommonItemModal
        title={optionType === 'add' ? translate('web.common.addResource') : translate('web.common.edit')}
        visible={modalVisible}
        layoutType={LAYOUT_TYPE.joint}
        formSchema={[
          {
            type: ModalFormType.Input,
            name: 'sort',
            hidden: true,
          },
          {
            type: ModalFormType.Upload,
            label: translate('web.resource.mall.tubiao'),
            name: 'icon',
            rules: [
              {
                required: true,
                message: translate('web.resource.shop.qingshangchuantupian'),
              },
            ],
          },
          {
            type: ModalFormType.Input,
            name: 'title',
            label: translate('web.resource.mall.xiaobiaoti'),
            rules: [
              {
                required: true,
                message: translate('web.common.qingshuru'),
              },
            ],
          },
          {
            type: ModalFormType.Input,
            name: 'content',
            label: translate('web.resource.mall.neirong'),
            rules: [
              {
                required: true,
                message: translate('web.common.qingshuru'),
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

export default Footer
