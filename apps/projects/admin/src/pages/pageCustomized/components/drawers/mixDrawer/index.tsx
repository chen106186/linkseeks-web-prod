import React, { useState, useEffect, useMemo } from 'react'
import { Drawer, Input, Table, Button, Row, Col, message } from '@linkseeks/ui'
import { TableRowSelection } from 'antd/es/table/interface'
import { SearchOutlined } from '@ant-design/icons'
import { formatTimeString } from '@/utils'
import { ImageBox } from '@apps/components'
import { priceFormat } from '@/utils/numberFomat'
import {
  getCommodityShopListAdorn,
  getManageContentInformationListAdorn,
  getCommodityAdornTopicPagePageList,
  getProductCommodityPlatformGetPlatformCommodityList,
  postProductCommodityTemplateSearchCommodityList,
  getProductCommodityTemplateGetBrandList,
  getCommodityWebStoreWebMemberShopListAdorn,
} from '@apps/apis'
import styles from './index.less'

interface MixDrawerProps {
  visible: boolean
  // 1商城，3积分商品，4店铺，5资讯, 6品牌,7专题页
  type: 1 | 3 | 4 | 5 | 6 | 7
  shopId?: number
  // 1.B端 2.C端 3.SRM
  property: 1 | 2 | 3
  onConfirm: (record: any) => void
  onClose?: () => void
  selectId?: string | number[]
  selectType?: 'radio' | 'checkbox'
  filterParam?: { [key: string]: any } | undefined
  disabledKeys?: number[]
  environment: number
}

const EnvironmentMAPS = {
  1: 'web',
  2: 'H5',
  3: '小程序',
  4: 'APP',
}

const PropertyMAPS = {
  1: 'B端商城',
  2: 'C端商城',
  3: 'SRM商城',
}

const TitleMAPS = {
  1: '选择商城',
  3: '选择积分商品',
  4: '选择店铺',
  5: '选择资讯',
}

const MixDrawer: React.FC<MixDrawerProps> = (props: MixDrawerProps) => {
  const {
    visible,
    type,
    property,
    onConfirm,
    onClose,
    filterParam,
    environment,
    disabledKeys,
    selectId,
    shopId,
    selectType = 'radio',
  } = props
  const [dataSource, setDataSource] = useState<any>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [keyWord, setKeyWord] = useState<string>('')
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)

  useEffect(() => {
    setSelectedRowKeys(selectId ? [selectId] : [])
  }, [selectId])

  const _search = async (current: number, pageSize: number, keyWord?: string) => {
    setCurrent(current)
    setPageSize(pageSize)
    const _params: any = {
      current,
      pageSize,
      ...filterParam,
    }
    let _fetch
    switch (type) {
      case 1:
        _params.type = 1
        _params.environment = environment
        _params.property = property
        _params.isSelf = false
        if (keyWord) {
          _params.name = keyWord
        }
        _fetch = getCommodityShopListAdorn
        break
      case 3:
        if (keyWord) {
          _params.name = keyWord
        }
        if (property === 2) {
          _params.priceType = 3
          _params.status = 5

          _fetch = getProductCommodityPlatformGetPlatformCommodityList
        } else {
          _params.priceTypeList = [3]
          if (selectId) {
            _params.idNotInList = Array.isArray(selectId) && selectId.length > 0 ? selectId : [selectId]
          }
          _params.shopId = _params.shopId = shopId
          _fetch = postProductCommodityTemplateSearchCommodityList
        }

        break
      case 4:
        if (keyWord) {
          _params.memberName = keyWord
        }
        _fetch = getCommodityWebStoreWebMemberShopListAdorn
        break
      // 资讯
      case 5:
        if (keyWord) {
          _params.title = keyWord
        }
        if (property === 1) {
          _params.shopId = shopId
          _params.idNotInList = Array.isArray(selectId) ? selectId.join(',') : selectId
        }
        _fetch = getManageContentInformationListAdorn
        break
      // 品牌
      case 6:
        if (keyWord) {
          _params.name = keyWord
        }
        _params.shopId = shopId
        _params.idNotInList = Array.isArray(selectId) ? selectId.join(',') : selectId
        _fetch = getProductCommodityTemplateGetBrandList
        break
      // 专题页
      case 7:
        if (keyWord) {
          _params.name = keyWord
        }
        _params.shopId = shopId
        _fetch = getCommodityAdornTopicPagePageList
        break
    }
    _fetch &&
      _fetch(_params)
        .then((res) => {
          message.destroy()
          if (res.code === 1000) {
            if (type === 1) {
              setDataSource(res.data || [])
            } else {
              setDataSource(res.data?.data ? res.data?.data : [])
            }
            setTotalCount(res.data?.totalCount ?? res.data.length)
          } else {
            setDataSource([])
            setTotalCount(0)
          }
        })
        .catch((err) => console.log(err))
  }

  const _onInputChange = (e) => {
    const _val = e.target.value
    setKeyWord(_val)
  }

  const _onPageChange = (page, pageSize) => {
    _search(page, pageSize)
  }

  const _onConfirm = () => {
    if (selectedRows.length > 0) {
      if (selectType === 'radio') {
        onConfirm(selectedRows[0])
      } else {
        onConfirm(selectedRows)
      }
    } else {
      message.warning('请选择一条记录')
    }
  }
  /*eslint-disable*/
  const columns = useMemo(() => {
    if (type === 1) {
      return [
        {
          title: 'logoUrl',
          dataIndex: 'logoUrl',
          width: 64,
          render: (text: string) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ImageBox src={text} width={64} height={64} />
              </div>
            )
          },
        },
        {
          title: 'name',
          dataIndex: 'name',
          render: (text: string, record: any) => {
            return (
              <div className={styles['shopName']}>
                <div className={styles['shopName-top']}>
                  {text}
                  <div className={styles['shopName-top-tag']}>{PropertyMAPS[record?.property]}</div>
                </div>
                <div className={styles['shopName-bottom']}>{record?.describe}</div>
              </div>
            )
          },
        },
        {
          title: 'environment',
          dataIndex: 'environment',
          render: (text: any) => {
            return (
              <span
                style={{
                  color: '#007BFC',
                  background: '#E9F3FF',
                  borderRadius: 2,
                  display: 'inline-block',
                  padding: '2px 4px',
                }}
              >
                {EnvironmentMAPS[text]}
              </span>
            )
          },
        },
      ]
    }
    if (type === 3) {
      return [
        {
          title: 'mainPic',
          dataIndex: 'mainPic',
          render: (text: string) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ImageBox src={text} width={40} height={40} />
              </div>
            )
          },
        },
        {
          title: 'name',
          dataIndex: 'name',
        },
        {
          title: 'min',
          dataIndex: 'min',
          render: (_: any, record: any) => {
            return <span style={{ color: '#EA8000' }}>{priceFormat(record?.min)} 积分</span>
          },
        },
      ]
    }
    if (type === 4) {
      return [
        {
          title: 'logo',
          dataIndex: 'logo',
          render: (text: string) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ImageBox src={text} width={40} height={40} />
              </div>
            )
          },
        },
        {
          title: 'name',
          dataIndex: 'name',
        },
      ]
    }
    if (type === 5) {
      return [
        {
          title: 'imageUrl',
          dataIndex: 'imageUrl',
          width: 72,
          render: (text: string) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ImageBox src={text} width={72} height={48} />
              </div>
            )
          },
        },
        {
          title: 'title',
          dataIndex: 'title',
          render: (text: string, record: any) => {
            return (
              <div className={styles['info']}>
                <div className={styles['info-title']}>{text}</div>
                <div className={styles['info-bottom']}>
                  <div className={styles['info-bottom-tag']}>{record?.columnName}</div>
                  <div className={styles['info-bottom-time']}>{formatTimeString(record?.createTime, 'YYYY-MM-DD')}</div>
                </div>
              </div>
            )
          },
        },
      ]
    }
    if (type === 6) {
      return [
        {
          title: 'logoUrl',
          dataIndex: 'logoUrl',
          render: (text: string) => {
            return (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <ImageBox src={text} width={40} height={40} />
              </div>
            )
          },
        },
        {
          title: 'name',
          dataIndex: 'name',
        },
      ]
    }
    if (type === 7) {
      return [
        {
          title: 'name',
          dataIndex: 'name',
        },
      ]
    }
  }, [type])

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
    type: selectType,
    getCheckboxProps: (record: any) => ({
      disabled: disabledKeys?.includes(record.id), // Column configuration not to be checked
    }),
  }

  useEffect(() => {
    setDataSource([])
    setKeyWord('')
  }, [type])

  useEffect(() => {
    if (visible) {
      _search(current, pageSize)
    }
  }, [visible])

  const _showTotal = (total) => {
    return `共 ${total} 条`
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
      width={800}
      title={TitleMAPS[type]}
      open={visible}
      onClose={onClose}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={_onConfirm} type="primary">
            确定
          </Button>
        </div>
      }
    >
      <div style={{ padding: 24 }}>
        <Row style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              onChange={_onInputChange}
              placeholder="搜索"
              suffix={
                <SearchOutlined
                  onClick={() => {
                    _search(1, pageSize, keyWord)
                  }}
                />
              }
              allowClear={true}
              onPressEnter={() => {
                _search(1, pageSize, keyWord)
              }}
            />
          </Col>
        </Row>
        <Table
          rowKey={'id'}
          columns={columns}
          showHeader={false}
          rowSelection={rowSelection}
          dataSource={dataSource}
          pagination={{
            total: totalCount,
            pageSize: pageSize,
            current: current,
            onChange: _onPageChange,
            showTotal: _showTotal,
            showSizeChanger: true,
            showQuickJumper: true,
            size: 'small',
          }}
        />
      </div>
    </Drawer>
  )
}

export default MixDrawer
