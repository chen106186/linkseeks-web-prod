import React, { useState, useEffect } from 'react'
import styles from '../index.less'
import selfStyles from './index.less'
import { Button, Row, Col, Card, Space } from 'antd'
import cx from 'classnames'
import { QuestionCircleOutlined } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'

interface queryProps {
  authTypeEdit: string
  authTypeFn: Function
  data: any
  currentRef?: any
}
const intl = getIntl()
const EnterpriseInfoCheck: React.FC<queryProps> = (props) => {
  const { authTypeEdit, authTypeFn, data, currentRef } = props
  const [authTypeBtn, setAuthTypeBtn] = useState<number>(1) // 认证方式
  // 切换认证方式
  const checkAuthType = (type: number) => {
    setAuthTypeBtn(type)
  }

  useEffect(() => {
    currentRef.current.authType = authTypeBtn
  })

  return data ? (
    <>
      {/* 企业展示 */}
      {
        (authTypeEdit === '1' || authTypeEdit === '2') && (
          <>
            <Card title={intl.formatMessage({ id: 'contract.renzhengfangshi' })} className={selfStyles.cardBottom}>
              <div style={{ color: '#91959B', fontSize: 12, marginBottom: 14 }}>
                {intl.formatMessage({ id: 'contract.enterpriseInfoCheck.mes' })}
              </div>
              <Space>
                <Button
                  style={authTypeBtn === 1 ? { background: 'rgba(0, 169, 143, 0.04)' } : {}}
                  type={authTypeBtn === 1 ? 'primary' : 'default'}
                  ghost={authTypeBtn === 1}
                  onClick={() => checkAuthType(1)}
                >
                  {intl.formatMessage({ id: 'contract.farenrenzheng' })}
                </Button>
                <Button
                  style={authTypeBtn === 2 ? { background: 'rgba(0, 169, 143, 0.04)' } : {}}
                  type={authTypeBtn === 2 ? 'primary' : 'default'}
                  ghost={authTypeBtn === 2}
                  onClick={() => checkAuthType(2)}
                >
                  {intl.formatMessage({ id: 'contract.jingbanrenrenzheng' })}
                </Button>
              </Space>
            </Card>
            <Card title={intl.formatMessage({ id: 'contract.qiyexinxiheyan' })} className={selfStyles.cardBottom}>
              <div className={selfStyles.itemBox}>
                <div className={selfStyles.item}>
                  <div className={selfStyles.item_label}>
                    {intl.formatMessage({ id: 'contract.gongsimingcheng' })}：
                  </div>
                  <div className={selfStyles.item_text}>{data.orgName}</div>
                </div>
                <div className={selfStyles.item}>
                  <div className={selfStyles.item_label}>
                    {intl.formatMessage({ id: 'contract.tongyishehuixinyongdaima' })}：
                  </div>
                  <div className={selfStyles.item_text}>{data.orgCode}</div>
                </div>
              </div>
            </Card>
            <Card title={intl.formatMessage({ id: 'contract.farenxinxiheyan' })} className={selfStyles.cardBottom}>
              <div className={selfStyles.itemBox}>
                <div className={selfStyles.item}>
                  <div className={selfStyles.item_label}>{intl.formatMessage({ id: 'contract.farenxingming' })}：</div>
                  <div className={selfStyles.item_text}>{data.legalRepName}</div>
                </div>
                <div className={selfStyles.item}>
                  <div className={selfStyles.item_label}>{intl.formatMessage({ id: 'contract.farenshoujihao' })}：</div>
                  <div className={selfStyles.item_text}>
                    {data?.code?.value || '86'} {data.legalRepMobile}
                  </div>
                </div>
                <div className={selfStyles.item}>
                  <div className={selfStyles.item_label}>
                    {intl.formatMessage({ id: 'contract.farenshenfenzhenghao' })}：
                  </div>
                  <div className={selfStyles.item_text}>{data.legalRepIdNo}</div>
                </div>
              </div>
            </Card>
          </>
        )
        // <div className={styles.info_wrap}>
        //   <div className={styles.info_item}>
        //     <div className={styles.info_item_title}>{intl.formatMessage({id: 'contract.qiyexinxiheyan'})}</div>
        //     <div className={styles.info_item_con}>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}>{intl.formatMessage({id: 'contract.gongsimingcheng'})}：</div>
        //         <div className={styles.item_control}>{data.orgName}</div>
        //       </div>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}>{intl.formatMessage({id: 'contract.tongyishehuixinyongdaima'})}：</div>
        //         <div className={styles.item_control}>{data.orgCode}</div>
        //       </div>
        //     </div>
        //   </div>
        //   <div className={styles.info_item}>
        //     <div className={styles.info_item_title}>{intl.formatMessage({id: 'contract.farenxinxiheyan'})}</div>
        //     <div className={styles.info_item_con}>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}>{intl.formatMessage({id: 'contract.farenxingming'})}：</div>
        //         <div className={styles.item_control}>{data.legalRepName}</div>
        //       </div>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}>{intl.formatMessage({id: 'contract.farenshoujihao'})}：</div>
        //         <div className={styles.item_control}>+{data.code} {data.legalRepMobile}</div>
        //       </div>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}>{intl.formatMessage({id: 'contract.farenshenfenzhenghao'})}：</div>
        //         <div className={styles.item_control}>{data.legalRepIdNo}</div>
        //       </div>
        //     </div>
        //   </div>
        //   <div className={cx(styles.info_item, styles.info_dashed)}>
        //     <div className={styles.info_item_con}>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}>{intl.formatMessage({id: 'contract.renzhengfangshi'})} <QuestionCircleOutlined style={{ color: '#C0C4CC' }} /></div>
        //         <div className={styles.item_control}>
        //           <Row className={styles.card_checkbox}>
        //             <Col className={cx(styles.card_checkbox_item, authTypeBtn===1&&styles.active)} onClick={()=>checkAuthType(1)}>{intl.formatMessage({id: 'contract.farenrenzheng'})}</Col>
        //             <Col className={cx(styles.card_checkbox_item, authTypeBtn===2&&styles.active)} onClick={()=>checkAuthType(2)}>{intl.formatMessage({id: 'contract.jingbanrenrenzheng'})}</Col>
        //           </Row>
        //         </div>
        //       </div>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}></div>
        //         <div className={styles.item_control}>
        //           <Button type='primary' onClick={()=>authTypeFn(authTypeBtn, 1, 'company')}>{intl.formatMessage({id: 'contract.xiayibu'})}</Button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
      }
      {/* 个人展示 */}
      {
        authTypeEdit === '3' && (
          <Card title={intl.formatMessage({ id: 'contract.gerenxinxiheyan' })} className={selfStyles.cardBottom}>
            <div className={selfStyles.itemBox}>
              <div className={styles.item}>
                <div className={styles.item_label}>{intl.formatMessage({ id: 'contract.xingming' })}：</div>
                <div className={styles.item_text}>{data.transactorName}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.item_label}>{intl.formatMessage({ id: 'contract.shoujihao' })}：</div>
                <div className={styles.item_text}>+86 {data.transactorMobile}</div>
              </div>
              <div className={styles.item}>
                <div className={styles.item_label}>{intl.formatMessage({ id: 'contract.shenfenzhenghao' })}：</div>
                <div className={styles.item_text}>{data.transactorIdNumber}</div>
              </div>
            </div>
          </Card>
        )
        // <div className={styles.info_wrap}>
        //   <div className={styles.info_item}>
        //     <div className={styles.info_item_title}>{intl.formatMessage({ id: 'contract.gerenxinxiheyan' })}</div>
        //     <div className={styles.info_item_con}>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}>{intl.formatMessage({ id: 'contract.xingming' })}：</div>
        //         <div className={styles.item_control}>{data.transactorName}</div>
        //       </div>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}>{intl.formatMessage({ id: 'contract.shoujihao' })}：</div>
        //         <div className={styles.item_control}>+86 {data.transactorMobile}</div>
        //       </div>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}>{intl.formatMessage({ id: 'contract.shenfenzhenghao' })}：</div>
        //         <div className={styles.item_control}>{data.transactorIdNumber}</div>
        //       </div>
        //       <div className={styles.item_con}>
        //         <div className={styles.item_label}></div>
        //         <div className={styles.item_control}>
        //           <Button type='primary' onClick={() => authTypeFn(3, 1, 'personal')}>{intl.formatMessage({ id: 'contract.xiayibu' })}</Button>
        //         </div>
        //       </div>
        //     </div>
        //   </div>
        // </div>
      }
    </>
  ) : null
}

export default EnterpriseInfoCheck
