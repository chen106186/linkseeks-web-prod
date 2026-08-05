import React from 'react'
import { Row, Col, Card, Spin, Badge } from 'antd'
import MemberStatistics from '.'
import useViewRequest from '../../common/hooks/useViewRequest'
import {
  getReportPlatformHomeGetMemberRegisterList,
  GetReportPlatformHomeGetMemberRegisterListResponse,
  // getReportPlatformHomeGetMemberTally,
  // GetReportPlatformHomeGetMemberTallyResponse,
} from '@apps/apis'
import { Link } from '@linkseeks/router-core'
import { RightCircleFilled, RightOutlined } from '@ant-design/icons'
import sideIcon from '@/assets/home-icon-28.png'
import styles from './index.less'

const PROCESS_STATUS = ['default', 'warning', 'warning', 'processing']

// TODO
const MemberStatisticsContainer = () => {
  const { loading, responseData, ref } = useViewRequest<GetReportPlatformHomeGetMemberRegisterListResponse, any>(
    getReportPlatformHomeGetMemberRegisterList,
    {},
  )
  const {
    loading: processingMemberLoading,
    responseData: processingMembers,
    ref: processRef,
  } = useViewRequest<any, any>(() => {}, {})
  // bugID=55957 看后续如何重新设计，现先手动替换对应的链接
  const MEMBER_TALLY_LINKS = {
    待提交审核: '/memberManage/memberPrSubmit',
    待一级审核: '/memberManage/memberPr1',
    待二级审核: '/memberManage/memberPr2',
    待确认审核结果: '/memberManage/memberPrConfirm',
  }

  return (
    <Row gutter={[24, 12]}>
      <Col xxl={24} xl={24} lg={24} ref={ref}>
        <MemberStatistics memberData={responseData} loading={loading} />
      </Col>
      {/* TODO暂时隐藏 */}
      {/* <Col xxl={6} xl={24} lg={24}>
        <Card
          headStyle={{ borderBottom: 'none' }}
          bodyStyle={{ padding: '0px' }}
          title="待处理会员"
          bordered={false}
          loading={processingMemberLoading}
        >
          <Row ref={processRef}>
            {processingMembers &&
              processingMembers.map((item, key: number) => {
                return (
                  <Col xxl={24} xl={12} md={12} sm={24} xs={24} key={key}>
                    <div className={styles.members}>
                      <div className={styles.numbers}>
                        <div className={styles.text}>{item.count || 0}</div>
                        <div className={styles.desc}>
                          <Badge status={PROCESS_STATUS[key] as 'processing'} text={item.name}></Badge>
                        </div>
                      </div>
                      <div>
                        {(item?.link && (
                          <Link to={MEMBER_TALLY_LINKS[item.name]}>
                            查看&nbsp;
                            <RightOutlined />
                          </Link>
                        )) || (
                          <a>
                            查看 <RightOutlined />
                          </a>
                        )}
                      </div>
                    </div>
                  </Col>
                )
              })}
            <Col span={24} style={{ padding: '0 24px' }}>
              <div className={styles.sideAdBox}>
                <a href="">
                  <span>
                    会员维护&nbsp;
                    <RightCircleFilled />
                  </span>
                </a>
                <img src={sideIcon} alt="" />
              </div>
            </Col>
          </Row>
        </Card>
      </Col> */}
    </Row>
  )
}

export default MemberStatisticsContainer
