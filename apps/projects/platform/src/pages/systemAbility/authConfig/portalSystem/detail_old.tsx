import React, { Fragment, useEffect, useState } from 'react'
import { Col, Empty, Form, message, Radio, Row, Skeleton } from 'antd'
import { useQuery } from '@linkseeks/router-core'
import { getIntl } from '@linkseeks/i18n'
import { PageHeaderWrapper } from '@apps/components'
import { getMemberOrgTree, getMemberStoreDetail } from '@apps/apis'
import { addressInfo, layout, sunmitVal, Tablink } from './add'
import { Card as CardLayout } from '@linkseeks/ui'
import { UploadImage } from '@apps/components'
import { isEmpty } from 'lodash'
import { getParentTreeTitles } from '@/utils'
import style from './components/index.less'

const intl = getIntl()

const ProtalSystemDetail: React.FC<{}> = (props: any) => {
  const { id } = useQuery()
  const [dataSource, setDataSource] = useState<sunmitVal & addressInfo>(null)
  const [getTree, setGetTree] = useState<boolean>(true)

  useEffect(() => {
    getMemberStoreDetail({ id } as any).then((res) => {
      if (res.code !== 1000) {
        message.error(res.message)
        return
      }
      setDataSource(res.data)
    })
  }, [])

  const fetchOriginTreeData = async (params?) => {
    // 平台后台树
    const res = await getMemberOrgTree({}, { ttl: 10, useCache: true })
    return res
  }

  useEffect(() => {
    if (!isEmpty(dataSource) && getTree) {
      fetchOriginTreeData().then(({ data: fieldSource }) => {
        dataSource.org.title = getParentTreeTitles(fieldSource, dataSource.org.id)
        setGetTree(false)
        setDataSource({ ...dataSource })
      })
    }
  }, [dataSource])

  /** 地址拼合 */
  const handleMosaic = (provinceName, cityName, districtName, address, streetName?) => {
    const mosaic = streetName
      ? provinceName + cityName + districtName + streetName + address
      : provinceName + cityName + districtName + address
    return mosaic
  }

  return (
    <PageHeaderWrapper
      title={intl.formatMessage({ id: 'portalSystem.menhuguanlixiangqing', defaultMessage: '门户管理详情' })}
      items={Tablink}
      // hideBreak
    >
      <Fragment>
        {!isEmpty(dataSource) ? (
          <Form {...layout}>
            <CardLayout
              id="basicLayout"
              title={intl.formatMessage({ id: 'portalSystem.jibenxinxi', defaultMessage: '基本信息' })}
            >
              <Row gutter={[48, 24]}>
                <Col span={12}>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.mendiandaima', defaultMessage: '门店代码' })}
                    name="code"
                  >
                    <span>{dataSource?.code}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.mendianmingcheng', defaultMessage: '门店名称' })}
                    name="name"
                  >
                    <span>{dataSource?.name}</span>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.mendianLOGO', defaultMessage: '门店LOGO' })}
                    name="logo"
                  >
                    <UploadImage
                      disabled
                      imgUrl={dataSource?.logo}
                      fileMaxSize={50}
                      size="275*50"
                      onChange={undefined}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </CardLayout>
            <CardLayout
              id="contactLayout"
              title={intl.formatMessage({ id: 'portalSystem.lianxixinxi', defaultMessage: '联系信息' })}
            >
              <Row gutter={[48, 24]}>
                <Col span={12}>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.mendiandizhi', defaultMessage: '门店地址' })}
                    name="areaSelect"
                  >
                    <span>
                      {dataSource?.provinceName}-{dataSource?.cityName}-{dataSource?.districtName}
                      {`${dataSource?.streetName ? '-' + dataSource?.streetName : null}`}
                    </span>
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.xiangxidizhi', defaultMessage: '详细地址' })}
                    name="address"
                  >
                    <span>{dataSource?.address}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.lianxirenxingming', defaultMessage: '联系人姓名' })}
                    name="contactName"
                  >
                    <span>{dataSource?.contactName}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.lianxidianhua', defaultMessage: '联系电话' })}
                  >
                    <span>
                      +{dataSource?.countryCode}&nbsp;{dataSource?.phone}
                    </span>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.youxiang', defaultMessage: '邮箱' })}
                    name="email"
                  >
                    <span>{dataSource?.email}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.youbian', defaultMessage: '邮编' })}
                    name="postalCode"
                  >
                    <span>{dataSource?.postalCode}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({ id: 'portalSystem.zhiwei', defaultMessage: '职位' })}
                    name="position"
                  >
                    <span>{dataSource?.position}</span>
                  </Form.Item>
                  <Form.Item
                    label={intl.formatMessage({
                      id: 'portalSystem.suoshuzuzhijigou',
                      defaultMessage: '所属组织机构',
                    })}
                    name="orgName"
                  >
                    <span>{dataSource?.org.title}</span>
                  </Form.Item>
                </Col>
              </Row>
            </CardLayout>
            <CardLayout
              id="address1"
              title={intl.formatMessage({ id: 'portalSystem.shouhuodizhi', defaultMessage: '收货地址' })}
            >
              <div className={style.addressList}>
                {dataSource?.receiveAddress ? (
                  <Radio.Group style={{ display: 'block' }}>
                    <Row gutter={[48, 24]}>
                      <Col span={12}>
                        <div className={style.addressLayout}>
                          <Radio checked disabled>
                            <div className={style.addressInfo}>
                              <div className={style.info}>
                                <div className={style.name}>
                                  {dataSource?.receiveAddress?.receiverName}&nbsp;{dataSource?.receiveAddress?.phone}
                                </div>
                                {dataSource?.receiveAddress?.isDefault ? (
                                  <div className={style.default}>
                                    {intl.formatMessage({
                                      id: 'portalSystem.morendizhi',
                                      defaultMessage: '默认地址',
                                    })}
                                  </div>
                                ) : null}
                              </div>
                              <div className={style.address}>
                                {handleMosaic(
                                  dataSource?.receiveAddress?.provinceName,
                                  dataSource?.receiveAddress?.cityName,
                                  dataSource?.receiveAddress?.districtName,
                                  dataSource?.receiveAddress?.address,
                                  dataSource?.receiveAddress?.streetName,
                                )}
                              </div>
                            </div>
                          </Radio>
                        </div>
                      </Col>
                    </Row>
                  </Radio.Group>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </CardLayout>
            <CardLayout
              id="address2"
              title={intl.formatMessage({ id: 'portalSystem.fahuozitidizhi', defaultMessage: '发货(自提)地址' })}
            >
              <div className={style.addressList}>
                {dataSource?.deliverAddress ? (
                  <Radio.Group style={{ display: 'block' }}>
                    <Row gutter={[48, 24]}>
                      <Col span={12}>
                        <div className={style.addressLayout}>
                          <Radio checked disabled>
                            <div className={style.addressInfo}>
                              <div className={style.info}>
                                <div className={style.name}>
                                  {dataSource?.deliverAddress?.deliverName}&nbsp;{dataSource?.deliverAddress?.phone}
                                </div>
                                {dataSource?.deliverAddress?.isDefault ? (
                                  <div className={style.default}>
                                    {intl.formatMessage({
                                      id: 'portalSystem.morendizhi',
                                      defaultMessage: '默认地址',
                                    })}
                                  </div>
                                ) : null}
                              </div>
                              <div className={style.address}>
                                {handleMosaic(
                                  dataSource?.deliverAddress?.provinceName,
                                  dataSource?.deliverAddress?.cityName,
                                  dataSource?.deliverAddress?.districtName,
                                  dataSource?.deliverAddress?.address,
                                  dataSource?.deliverAddress?.streetName,
                                )}
                              </div>
                            </div>
                          </Radio>
                        </div>
                      </Col>
                    </Row>
                  </Radio.Group>
                ) : (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )}
              </div>
            </CardLayout>
          </Form>
        ) : (
          <Skeleton />
        )}
      </Fragment>
    </PageHeaderWrapper>
  )
}
export default ProtalSystemDetail
