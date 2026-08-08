/*
 * @Author: XieZhiXiong
 * @Date: 2021-05-21 17:14:39
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 14:46:55
 * @Description: 会员入库信息
 */
import React from 'react'
import { Tooltip } from 'antd'
import { useIntl } from '@linkseeks/i18n'
import CustomizeColumn, { IProps as CustomizeColumnProps, DataItem } from '@/components/CustomizeColumn'
import { renderFieldTypeContent } from '../../utils'
import styles from './index.less'
import { ElementsItemType } from '../MemberProfile'

interface IProps extends Omit<CustomizeColumnProps, 'data' | 'columns'> {
  /**
   * 是否展示 new
   */
  showNew?: boolean
  /**
   * 组数据
   */
  groupData: {
    /**
     * 分组名
     */
    groupName: string
    /**
     *
     */
    elements: {
      /**
       * 分组内的字段顺序
       */
      fieldOrder?: number
      /**
       * 字段中文名称
       */
      fieldLocalName?: string
      /**
       * 字段值
       */
      fieldValue?: string | []
      /**
       * 修改之前的值，如果没有为空字符串
       */
      lastValue?: string | []
      /**
       * 类型
       */
      fieldType?: string
      /**
       * fieldType为list时，当前数据
       */
      registers?: ElementsItemType[]
      /**
       * fieldType为list时，旧数据
       */
      lastRegisters?: ElementsItemType[]
    }[]
  }
}

const MemberDocIncomingInfo: React.FC<IProps> = (props: IProps) => {
  const { showNew = false, groupData, ...rest } = props

  const intl = useIntl()

  return (
    <CustomizeColumn
      title={groupData.groupName}
      data={groupData.elements.map((ele) => ({
        title: ele.fieldLocalName,
        value: (
          <div className={styles.changed}>
            {/* {ele.fieldValue} */}
            {renderFieldTypeContent(
              ele.fieldType,
              ele.fieldType === 'list' ? ele.registers : ele.fieldValue,
              showNew && ele.lastRegisters.length > 0 ? ele.lastRegisters : null,
            )}
            {showNew && ele.fieldType !== 'list' && ele.lastValue && ele.lastValue !== ele.fieldValue && (
              <Tooltip
                title={`${intl.formatMessage({ id: 'member.components.MemberDocIncomingInfo.before' })}：${
                  ele.lastValue
                }`}
              >
                <span className={styles.new}>
                  {intl.formatMessage({ id: 'member.components.MemberDocIncomingInfo.new' })}
                </span>
              </Tooltip>
            )}
          </div>
        ),
        columnProps: {
          span: ele.fieldType === 'list' ? 3 : 1,
        },
      }))}
      {...rest}
    />
  )
}

export default MemberDocIncomingInfo
