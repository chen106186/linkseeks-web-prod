/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-21 18:18:44
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:01:17
 * @Description: 会员变更信息详情
 */
import React, { useContext, useEffect } from 'react'
import { useIntl } from '@linkseeks/i18n'
import { Row, Col } from 'antd'
import { getMemberSupplierAbilityMaintenanceDetailDepositHistoryPage } from '@apps/apis'
import MemberDetailsContext from '../../../memberDetailsContext'
import ChangedInfo, { FetchParamsType, ReponseType } from '../../../components/MemberChangedInfo'

const MemberChangedInfo = (props) => {
  const { validateId } = props

  const contenxt = useContext(MemberDetailsContext)

  const intl = useIntl()

  const getInspectList = (params: FetchParamsType): Promise<ReponseType> => {
    return new Promise((resolve, reject) => {
      getMemberSupplierAbilityMaintenanceDetailDepositHistoryPage({
        validateId,
        ...params,
      })
        .then((res) => {
          if (res.code === 1000) {
            resolve(res.data)
          }
          reject(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  useEffect(() => {
    const anchors = [
      {
        key: 'changedInfo',
        name: intl.formatMessage({ id: 'member.management.maintain.detail.changedInfo' }),
      },
    ]
    contenxt.onAnchorsReady(anchors)
  }, [])

  return (
    <Row gutter={[16, 16]}>
      {/* 分类信息 */}
      <Col span={24}>
        <div id="changedInfo">
          <ChangedInfo fetchList={getInspectList} />
        </div>
      </Col>
    </Row>
  )
}

export default MemberChangedInfo
