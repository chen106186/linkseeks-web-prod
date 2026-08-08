/*
 * @Description: 供应商入库信息
 */
import React from 'react'
import { pxTransform } from '@apps/mobile-services/utils/taro'
import { View, Text } from '@apps/mobile-ui'
import { themeLayout } from '@/constants/theme'
import { renderFieldTypeContent } from '../../common/utils/createMemberSchemaUtil'
import CellListCard from '../CellListCard'
import RegisterDataList from '../RegisterDataList'
import { SupplierDetailsType } from '../SupplierProfile/interface'
import './index.scss'

export interface SupplierDepositInfoProps {
  /**
   * 是否展示 new，默认 false
   */
  showNew?: boolean
  /**
   * 入库资料数据
   */
  groupData: SupplierDetailsType['depositDetailTexts']
}

const SupplierDepositInfo: React.FC<SupplierDepositInfoProps> = (props: SupplierDepositInfoProps) => {
  const { showNew = false, groupData } = props

  return (
    <View className="supplier-deposit">
      {groupData?.map((item, index) => (
        <CellListCard
          key={index}
          title={item.groupName}
          dataItemBgc={'#FAFBFC'}
          dataSource={item.elements?.map((element) => ({
            title: element.fieldLocalName,
            value:
              element.fieldType !== 'list' ? (
                <View className="supplier-deposit-current-data">
                  {showNew && element.lastValue !== element.fieldValue && (
                    <Text className="supplier-deposit-current-data-title">(变更后)</Text>
                  )}
                  {renderFieldTypeContent(element.fieldType!, element.fieldValue)}
                </View>
              ) : undefined,
            label: (
              <>
                {showNew && element.fieldType !== 'list' ? (
                  <>
                    {element.lastValue && element.lastValue !== element.fieldValue ? (
                      <View className="supplier-deposit-modify supplier-deposit-cell-label">
                        <Text className="supplier-deposit-modify-txt">(变更前)</Text>
                        {element.lastValue}
                      </View>
                    ) : null}
                    {/* 如果字段值，之前是未填，则显示 (变更前)无 */}
                    {!element.lastValue || !Object.keys(element.lastValue).length ? (
                      <View className="supplier-deposit-modify supplier-deposit-cell-label">
                        <Text className="supplier-deposit-modify-txt">(变更前)无</Text>
                      </View>
                    ) : null}
                  </>
                ) : null}
                {showNew && element.fieldType === 'list' ? (
                  <View className="supplier-deposit-cell-label">
                    {element?.registers?.length && <Text className="supplier-deposit-cell-label-text">(变更后)</Text>}
                    <RegisterDataList
                      title={element.fieldLocalName!}
                      configs={[]}
                      registers={element.registers}
                      editable={false}
                      showTitle={false}
                      customStyle={{
                        backgroundColor: '#FAFBFC',
                      }}
                    />
                    {element.lastRegisters?.length ? (
                      <View className="supplier-deposit-modify-last">
                        <Text className="supplier-deposit-modify-txt">(变更前)</Text>
                        <RegisterDataList
                          title={element.fieldLocalName!}
                          configs={[]}
                          registers={element.lastRegisters}
                          editable={false}
                          showTitle={false}
                          customStyle={{
                            backgroundColor: '#FAFBFC',
                          }}
                        />
                      </View>
                    ) : null}
                    {/* 如果字段值，之前是未填，则显示 (变更前)无 */}
                    {!element.lastRegisters?.length ? (
                      <Text className="supplier-deposit-modify-txt">(变更前)无</Text>
                    ) : null}
                  </View>
                ) : null}
                {!showNew && element.fieldType === 'list' ? (
                  <View className="supplier-deposit-cell-label">
                    <RegisterDataList
                      title={element.fieldLocalName!}
                      configs={[]}
                      registers={element.registers}
                      editable={false}
                      showTitle={false}
                      customStyle={{
                        backgroundColor: '#FAFBFC',
                      }}
                    />
                  </View>
                ) : null}
              </>
            ),
          }))}
          style={{
            marginTop: pxTransform(themeLayout['padding-xs']),
          }}
        />
      ))}
    </View>
  )
}

export default SupplierDepositInfo
