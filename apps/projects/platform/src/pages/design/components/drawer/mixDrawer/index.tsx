import React, { useState, useEffect, useMemo } from 'react'
import { Drawer, Input, Table, Button, Row, Col, message } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { useIntl, getIntl } from '@linkseeks/i18n'
import { ImageBox } from '@apps/components'
import moment from 'moment'
import { LAYOUT_TYPE } from '@apps/design-ui/src/Web/constants'
import { priceFormat } from '@/utils/numberFomat'
import { authService } from '@apps/services'
import { getManageContentInformationListAdorn, getManageMemberInformationListAdorn } from '@apps/apis'
import { getProductCommodityPlatformGetPlatformCommodityList, getCommodityAdornTopicPagePageList } from '@apps/apis'
import { getCommodityWebStoreWebMemberShopListAdorn, getCommodityWebShopWebFindSelfShop } from '@apps/apis'
import { getProductCommodityTemplateGetBrandList } from '@apps/apis'
import defaultLogo from '@/assets/imgs/default_logo.jpg'
import styles from './index.less'
import { usePageStatus } from '@/hooks/usePageStatus'

interface MixDrawerProps {
  visible: boolean
  // 1商城，3积分商品，4店铺，5资讯, 6品牌,7专题页
  type: 1 | 3 | 4 | 5 | 6 | 7
  // shopId?: number
  environment: number
  // 1.B端 2.C端 3.SRM
  property: 1 | 2 | 3
  onConfirm: (record: any) => void
  onClose?: () => void
  selectId?: string | number[]
  selectType?: 'radio' | 'checkbox'
  filterParam?: any
  layoutType: LAYOUT_TYPE
}

const Environment_MAPS = {
  1: 'web',
  2: 'H5',
  3: getIntl().formatMessage({ id: 'shop.template.environment.status_3' }),
  4: 'APP',
}

const Property_MAPS = {
  1: getIntl().formatMessage({ id: 'own.mall.property_1' }),
  2: getIntl().formatMessage({ id: 'own.mall.property_2' }),
  3: getIntl().formatMessage({ id: 'own.mall.property_3' }),
  4: getIntl().formatMessage({ id: 'own.mall.property_4' }),
}

const Title_MAPS = {
  1: getIntl().formatMessage({ id: 'editor.drawer.mix.title.map_1' }),
  3: getIntl().formatMessage({ id: 'editor.drawer.mix.title.map_2' }),
  4: getIntl().formatMessage({ id: 'editor.drawer.mix.title.map_3' }),
  5: getIntl().formatMessage({ id: 'editor.drawer.mix.title.map_4' }),
}

const MixDrawer: React.FC<MixDrawerProps> = (props: MixDrawerProps) => {
  const {
    visible,
    type,
    property,
    onConfirm,
    onClose,
    selectId,
    filterParam,
    selectType = 'radio',
    layoutType,
    environment,
  } = props
  const [dataSource, setDataSource] = useState<any>([])
  const [totalCount, setTotalCount] = useState<number>(0)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([])
  const [selectedRows, setSelectedRows] = useState<any>([])
  const [keyWord, setKeyWord] = useState<string>('')
  const [current, setCurrent] = useState<number>(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const { memberId, memberRoleId } = authService.getAuth() || {}
  const { shopId } = usePageStatus()
  const intl = useIntl()

  useEffect(() => {
    setSelectedRowKeys(selectId ? [selectId] : [])
  }, [selectId])

  const _search = (current: number, pageSize: number, keyWord?: string) => {
    setCurrent(current)
    setPageSize(pageSize)
    let _params: any = {
      current,
      pageSize,
      ...filterParam,
    }

    let _fetch
    switch (type) {
      case 1:
        _fetch = getCommodityWebShopWebFindSelfShop
        _params.environment = environment
        if (layoutType !== 'own') {
          _params.type = 1
          _params.property = property
        }

        if (keyWord) {
          _params.shopName = keyWord
        }

        break
      case 3:
        if (keyWord) {
          _params.name = keyWord
        }
        _params.priceType = 3
        _params.status = 5
        _params.memberId = memberId
        _params.memberRoleId = memberRoleId

        if (selectId) {
          _params.idNotList = Array.isArray(selectId) ? selectId : [selectId]
        }

        _fetch = getProductCommodityPlatformGetPlatformCommodityList

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
          _params.idNotInList = selectId
        }
        if (layoutType !== 'own') {
          _fetch = getManageContentInformationListAdorn
        } else {
          _fetch = getManageMemberInformationListAdorn
        }
        break
      // 品牌
      case 6:
        if (keyWord) {
          _params.name = keyWord
        }
        _params.shopId = shopId
        if (layoutType === 'own') {
          _params.memberId = memberId
          _params.memberRoleId = memberRoleId
        }
        if (selectId && Array.isArray(selectId) && selectId.length > 0) {
          _params.idNotInList = selectId.join(',')
        }

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
            if (Array.isArray(res.data)) {
              setDataSource(res.data || [])
              setTotalCount(res.data.length)
            } else {
              setDataSource(res.data?.data || [])
              setTotalCount(res.data?.totalCount)
            }
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
      message.warning(intl.formatMessage({ id: 'common.tip.select.required' }))
    }
  }

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
                <ImageBox src={text || defaultLogo} width={64} height={64} />
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
                  <div className={styles['shopName-top-tag']}>{Property_MAPS[record?.property]}</div>
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
                {Environment_MAPS[text]}
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
            return (
              <span style={{ color: '#EA8000' }}>
                {priceFormat(record?.min)} {intl.formatMessage({ id: 'common.text.interal' })}
              </span>
            )
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
          title: 'memberName',
          dataIndex: 'memberName',
        },
      ]
    }
    if (type === 5) {
      return [
        {
          title: 'imageUrl',
          dataIndex: 'imageUrl',
          width: 72,
          render: (text: string) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ImageBox src={text} width={72} height={48} />
            </div>
          ),
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
                  <div className={styles['info-bottom-time']}>{moment(record?.createTime).format('YYYY-MM-DD')}</div>
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
          render: (text: string) => (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <ImageBox src={text} width={40} height={40} />
            </div>
          ),
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

  const rowSelection: any = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows)
      setSelectedRowKeys(selectedRowKeys)
    },
    type: selectType,
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
    return `${intl.formatMessage({ id: 'common.text.common' })} ${total} ${intl.formatMessage({
      id: 'common.text.unit.strip',
    })}`
  }

  const drawerStyle = { background: '#FAFBFC' }

  return (
    <Drawer
      headerStyle={drawerStyle}
      bodyStyle={drawerStyle}
      footerStyle={drawerStyle}
      width={800}
      title={Title_MAPS[type]}
      open={visible}
      onClose={onClose}
      footer={
        <div style={{ textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            {intl.formatMessage({ id: 'common.button.cancel' })}
          </Button>
          <Button onClick={_onConfirm} type="primary">
            {intl.formatMessage({ id: 'common.button.confirm' })}
          </Button>
        </div>
      }
    >
      <div>
        <Row style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input
              onChange={_onInputChange}
              placeholder={intl.formatMessage({ id: 'common.text.search' })}
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
          dataSource={dataSource || []}
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
