/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-27 10:51:52
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 18:16:10
 * @Description: 注册信息
 */
import React, { useState, useEffect } from 'react'
import { Spin } from 'antd'
import { getMemberSupplierAbilityInfoApplyDetail, GetMemberSupplierAbilityInfoApplyDetailResponse } from '@apps/apis'
import CustomizeColumn from '@/components/CustomizeColumn'
import { renderFieldTypeContent } from '../../../../../utils'
import styles from './index.less'

interface IProps {
  /**
   * 上级会员id
   */
  upperMemberId: number
  /**
   * 上级会员角色Id
   */
  upperRoleId: number
}

const RegisterInfo: React.FC<IProps> = (props: IProps) => {
  const { upperMemberId, upperRoleId } = props
  const [registerInfo, setRegisterInfo] = useState<GetMemberSupplierAbilityInfoApplyDetailResponse>()
  const [loading, setLoading] = useState(false)

  const getRegisterInfo = async () => {
    if (!upperMemberId || !upperRoleId) {
      return
    }
    setLoading(true)
    const res = await getMemberSupplierAbilityInfoApplyDetail({
      upperMemberId: `${upperMemberId}`,
      upperRoleId: `${upperRoleId}`,
    })
    if (res.code === 1000) {
      setRegisterInfo(res.data)
    }
    setLoading(false)
  }

  useEffect(() => {
    getRegisterInfo()
  }, [props.upperMemberId, props.upperRoleId])

  return (
    <Spin spinning={loading}>
      <div className={styles['register-info']}>
        {registerInfo?.registerDetails.map((item) => (
          <CustomizeColumn
            key={item.groupName}
            title={<div className={styles['card-box-title']}>{item.groupName}</div>}
            data={item.elements.map((ele) => ({
              title: ele.fieldLocalName,
              value: (
                <div className={styles['changed']}>
                  {/* {renderFieldTypeContent(ele.fieldType, ele.fieldValue, ele.lastValue)} */}
                  {renderFieldTypeContent(ele.fieldType, ele.fieldType === 'list' ? ele.registers : ele.fieldValue)}
                </div>
              ),
            }))}
          />
        ))}
      </div>
    </Spin>
  )
}

export default RegisterInfo
