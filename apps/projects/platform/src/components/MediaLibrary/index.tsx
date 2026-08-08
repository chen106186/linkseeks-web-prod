import React, { useState, useRef, useEffect, ReactNode } from 'react'
import { Button, Form, Input, Row, Col, Modal, Alert, Upload, Select, DatePicker, Pagination } from 'antd'
import { PlusOutlined, DeleteOutlined, FormOutlined, UploadOutlined } from '@ant-design/icons'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'
export interface IProps {
  visibleMedias: boolean
  clickOkAddMedias: (selectedArray: ILists[]) => void
  clickCancelAddMedias: () => void
}

export interface ILists {
  id: string
  image: string
  title: string
  isCheck: boolean
}

export interface Iparams {
  current: number
  pageSize: number
  name: string
  canal: number
  group: number
  tag: number
  rangeDate: string[]
}

const { Option } = Select
const { RangePicker } = DatePicker

let _imgLists: ILists[] = [
  {
    id: '10',
    image: 'http://10.0.0.28:88/group1/M00/00/01/CgAAHF8XthCALPjtAAAcmV_QYOE360.jpg',
    title: '商品主图10086',
    isCheck: false,
  },
  {
    id: '11',
    image: 'http://10.0.0.28:88/group1/M00/00/01/CgAAHF8XthCALPjtAAAcmV_QYOE360.jpg',
    title: '商品主图10086',
    isCheck: false,
  },
  {
    id: '12',
    image: 'http://10.0.0.28:88/group1/M00/00/01/CgAAHF8XthCALPjtAAAcmV_QYOE360.jpg',
    title: '商品主图10086',
    isCheck: false,
  },
  {
    id: '13',
    image: 'http://10.0.0.28:88/group1/M00/00/01/CgAAHF8XthCALPjtAAAcmV_QYOE360.jpg',
    title: '商品主图10086',
    isCheck: false,
  },
  {
    id: '14',
    image: 'http://10.0.0.28:88/group1/M00/00/01/CgAAHF8XthCALPjtAAAcmV_QYOE360.jpg',
    title: '商品主图10086',
    isCheck: false,
  },
  {
    id: '15',
    image: 'http://10.0.0.28:88/group1/M00/00/01/CgAAHF8XthCALPjtAAAcmV_QYOE360.jpg',
    title: '商品主图10086',
    isCheck: false,
  },
]

const CustomMediaLibrary: React.FC<IProps> = (props) => {
  const { visibleMedias, clickOkAddMedias, clickCancelAddMedias } = props
  const intl = useIntl()

  const [searchParams, setSearchParams] = useState<Iparams>({
    current: 1,
    pageSize: 10,
    name: '',
    canal: null,
    group: null,
    tag: null,
    rangeDate: [],
  })
  let [imgLists, setImgLists] = useState<ILists[]>(_imgLists)

  const clickCheck = (id: any, index: any) => {
    console.log('选中', id, index)
    for (let item of imgLists) {
      let bool = item.isCheck
      if (item.id === id) {
        item.isCheck = !bool
      }
    }
    let newArr = [...imgLists]
    setImgLists(newArr)
  }

  const confirmClickOk = () => {
    console.log('内部确定选择')
    let selectedArray = imgLists.filter((item) => item.isCheck)
    clickOkAddMedias(selectedArray)
  }

  const confirmCancel = () => {
    console.log('内部取消选择')
    for (let item of imgLists) {
      item.isCheck = false
    }
    setImgLists([...imgLists])
    clickCancelAddMedias()
  }

  const clickSearch = (value?: string) => {
    if (value) {
      searchParams['current'] = 1
      searchParams['name'] = value
    }
    setSearchParams({ ...searchParams })
    console.log(searchParams)
    // ...搜索
  }

  const onChange = (value: any, type: string) => {
    searchParams[type] = value
    setSearchParams({ ...searchParams })
  }

  const pageChange = (page, pageSize) => {
    searchParams['current'] = page
    setSearchParams({ ...searchParams })
    clickSearch()
  }

  return (
    <div className={styles.mediaLibraryBox}>
      <Modal
        width={960}
        title={intl.formatMessage({ id: 'components.tianjiameiti' })}
        visible={visibleMedias}
        onOk={confirmClickOk}
        onCancel={confirmCancel}
        okText={intl.formatMessage({ id: 'components.queding' })}
        cancelText={intl.formatMessage({ id: 'components.quxiao' })}
        forceRender={true}
      >
        <div className={styles.modalFitllerBox}>
          <Row gutter={[16, 16]} justify="space-between">
            <Col span={12}>
              <Upload
                name="file"
                action="/api/support/file/upload"
                headers={{
                  authorization: 'authorization-text',
                }}
              >
                <Button type="primary">
                  <UploadOutlined /> {intl.formatMessage({ id: 'components.shangchuanwenjian' })}
                </Button>
              </Upload>
            </Col>
            <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Input.Search
                placeholder={intl.formatMessage({ id: 'components.sousu' })}
                onSearch={(value) => clickSearch(value)}
                style={{ width: 200 }}
              />
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({ id: 'components.shiyongqudao' })}
                onChange={(v) => onChange(v, 'canal')}
              >
                <Option value={0}>Jack</Option>
                <Option value={1}>Lucy</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({ id: 'components.fenzu' })}
                onChange={(v) => onChange(v, 'group')}
              >
                <Option value={10}>Jack</Option>
                <Option value={11}>Lucy</Option>
              </Select>
            </Col>
            <Col span={6}>
              <Select
                allowClear
                style={{ width: '100%' }}
                placeholder={intl.formatMessage({ id: 'components.biaoqian' })}
                onChange={(v) => onChange(v, 'tag')}
              >
                <Option value={20}>Jack</Option>
                <Option value={21}>Lucy</Option>
              </Select>
            </Col>
            <Col span={6}>
              <RangePicker
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                placeholder={[
                  intl.formatMessage({ id: 'components.kaishishijian' }),
                  intl.formatMessage({ id: 'components.jieshushijian' }),
                ]}
                onChange={(v) => onChange(v, 'rangeDate')}
              />
            </Col>
          </Row>
        </div>
        <div className={styles.modalMainContentBox}>
          <ul>
            {imgLists.length > 0 &&
              imgLists.map((item, index) => (
                <li key={item.id} className={item.isCheck ? styles.isCheckedCss : ''}>
                  <a onClick={() => clickCheck(item.id, index)}>
                    <img src={item.image} alt={item.title} />
                  </a>
                  <p>{item.title}</p>
                </li>
              ))}
          </ul>
        </div>
        <div className={styles.footerPage}>
          <Pagination current={searchParams?.current} total={50} onChange={pageChange} />
        </div>
      </Modal>
    </div>
  )
}

export default CustomMediaLibrary
