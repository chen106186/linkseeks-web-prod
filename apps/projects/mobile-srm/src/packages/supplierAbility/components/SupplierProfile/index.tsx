/*
 * @Description: 供应商信息组件
 */
import React, { useMemo, useState } from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Tabs, TabsPane } from '@apps/mobile-ui'
import { TabItem } from '@apps/mobile-ui/packages/types/tabs'
import { themeLayout } from '@/constants/theme'
import { SupplierDetailsType } from './interface'
import { renderFieldTypeContent } from '../../common/utils/createMemberSchemaUtil'
import BasicInfoCellListCard from '../BasicInfoCellListCard'
import CellListCard from '../CellListCard'
import SchoolCard from '../SchoolCard'
import SupplierDepositInfo from '../SupplierDepositInfo'
import DepositQualitiesList from '../DepositQualitiesList'
import SupplierInspectInfo from '../SupplierInspectInfo'
import SupplierClassifyInfo from '../SupplierClassifyInfo'
import './index.scss'

export * from './interface'

export interface SupplierProfileProps {
  /**
   * 详情信息
   */
  details?: SupplierDetailsType
  /**
   * 是否展示入库资料变更前数据，默认 false
   */
  showDepositNew?: boolean
}

const SupplierProfile: React.FC<SupplierProfileProps> = (props: SupplierProfileProps) => {
  const { details, showDepositNew } = props

  const [activeIndex, setActiveIndex] = useState<number>(0)

  const handleTabsChange = (index: number) => {
    setActiveIndex(index)
  }

  const depositDetails = details?.depositDetails || []

  const tabs: TabItem[] = useMemo(
    () =>
      [
        details?.registerDetails && details?.registerDetails.length
          ? {
              title: '注册资料',
            }
          : null,
        depositDetails.length > 0
          ? {
              title: '入库资料',
            }
          : null,
        details?.inspection && details.inspection.inspectDay
          ? {
              title: '考察信息',
            }
          : null,
        details?.classification && details.classification.code
          ? {
              title: '分类信息',
            }
          : null,
      ].filter(Boolean) as TabItem[],
    [details],
  )

  const tabsPanes = useMemo(
    () =>
      [
        details?.registerDetails && details?.registerDetails.length ? (
          <>
            {/* 注册资料 */}
            {details?.registerDetails?.map((item, index) => (
              <CellListCard
                key={index}
                title={item.groupName}
                dataSource={item.elements?.map((element) => ({
                  title: element.fieldLocalName,
                  value:
                    element.fieldType !== 'list'
                      ? renderFieldTypeContent(element.fieldType!, element.fieldValue)
                      : undefined,
                  label:
                    element.fieldType === 'list'
                      ? renderFieldTypeContent(
                          element.fieldType!,
                          element.fieldValue,
                          element.fieldLocalName,
                          element.registers,
                        )
                      : undefined,
                  type: element.fieldType,
                }))}
                style={{
                  marginTop: pxTransform(themeLayout['padding-xs']),
                }}
              />
            ))}
          </>
        ) : null,
        depositDetails.length > 0 ? (
          <>
            {/* 入库资料 */}
            <SupplierDepositInfo groupData={depositDetails} showNew={showDepositNew} />
            {/* 资质证明 */}
            <DepositQualitiesList
              value={details?.qualities}
              customStyle={{
                marginTop: pxTransform(themeLayout['padding-xs']),
              }}
              showNew={showDepositNew}
            />
          </>
        ) : null,
        details?.inspection && details.inspection.inspectDay ? (
          <>
            {/* 考察信息 */}
            <SupplierInspectInfo
              data={details.inspection}
              style={{
                marginTop: pxTransform(themeLayout['padding-xs']),
              }}
            />
          </>
        ) : null,
        details?.classification && details.classification.code ? (
          <>
            {/* 分类信息 */}
            <SupplierClassifyInfo
              data={details.classification}
              style={{
                marginTop: pxTransform(themeLayout['padding-xs']),
              }}
            />
          </>
        ) : null,
      ].filter(Boolean),
    [details, depositDetails],
  )

  return (
    <View className="supplier-profile">
      {/* 校张 */}
      <SchoolCard
        data={{
          name: details?.name,
          memberId: details?.memberId,
        }}
      />
      {/* 基本信息 */}
      <BasicInfoCellListCard
        data={{
          memberId: details?.memberId,
          memberTypeName: details?.memberTypeName,
          account: details?.account,
          name: details?.name,
          roleName: details?.roleName,
          phone: details?.phone,
          outerStatus: details?.outerStatus,
          outerStatusName: details?.outerStatusName,
          levelTag: details?.levelTag,
          email: details?.email,
          createTime: details?.registerTime,
        }}
        style={{
          marginTop: pxTransform(themeLayout['padding-xs']),
        }}
      />
      {/* 渠道信息暂无 */}
      <Tabs current={activeIndex} onClick={handleTabsChange} tabList={tabs} scroll>
        {tabsPanes.map((item, index) => (
          <TabsPane current={activeIndex} index={index}>
            {item}
          </TabsPane>
        ))}
      </Tabs>
    </View>
  )
}

export default SupplierProfile
