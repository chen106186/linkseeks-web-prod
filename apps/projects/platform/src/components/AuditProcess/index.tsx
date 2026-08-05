/*
 * @Author: XieZhiXiong
 * @Date: 2020-09-15 17:48:36
 * @LastEditors: zwp
 * @LastEditTime: 2021-09-0 11:18:12
 * @Description: 内外部流转记录组件 最后编辑-添加自定义默认的Radio显示类型
 */
import React, { useState, useEffect } from 'react'
import { Button, Drawer, Steps, Tooltip } from 'antd'
import type { ButtonTabsProps } from '../ButtonTabs'
import ButtonTabs from '../ButtonTabs'
import styles from './index.less'
import { useIntl } from '@linkseeks/i18n'
import FlowRecords from '../FlowRecordsTwo'
import { useWebIntl } from '@apps/locales'

export interface StepsItem {
  /**
   * 当前步骤
   */
  step?: number
  /**
   * 步骤名
   */
  stepName?: string
  /**
   * 角色名，也可以作为辅助信息使用
   */
  roleName: string
  /**
   * 当前步骤的状态
   */
  status?: 'wait' | 'process' | 'finish' | 'error'
}

type radioItem = 'inner' | 'outer'

interface AuditProcessProp extends Omit<ButtonTabsProps, 'options'> {
  /**
   * 当前外部流程步骤
   */
  outerVerifyCurrent?: number
  /**
   * 当前内部流程步骤
   */
  innerVerifyCurrent?: number
  /**
   * 当前外部流程
   */
  outerVerifySteps?: StepsItem[]
  /**
   * 当前内部流程
   */
  innerVerifySteps?: StepsItem[]
  /**
   * 自定义item 步骤名键名
   */
  customTitleKey?: string
  /**
   * 自定义item key键名
   */
  customKey?: string
  /**
   * 初始radio值
   */
  initRadioValue?: radioItem

  /**
   * 师傅有流转记录
   */
  circulationIcon?: boolean

  /**
   * 内部流转
   */
  innerColumns?: any
  /**
   * 外部流转
   */
  outerColumns?: any
  /**
   * 外部流转记录数据源，与 fetchOuterList 不能共存
   * 如果两个同时存在 outerDataSource 优先
   */
  outerDataSource?: Record<string, any>[]
  /**
   * 内部流转记录数据源，与 fetchInnerList 不能共存
   * 如果两个同时存在 innerDataSource 优先
   */
  innerDataSource?: Record<string, any>[]
  /**
   * 内部流转记录列数据
   */
  fetchInnerList?: any
  /**
   * 外部流转记录列数据
   */
  fetchOuterList?: any
  /**
   * 是否隐藏tab按钮
   */
  noTab?: boolean
  /**
   * 内部、外部？
   */
  radioValue_?: 'inner' | 'outer'
}
const AuditProcess: React.FC<AuditProcessProp> = ({
  outerVerifyCurrent = 0,
  innerVerifyCurrent = 0,
  outerVerifySteps,
  innerVerifySteps,
  customTitleKey,
  customKey,
  noTab = false,
  initRadioValue = 'inner',
  circulationIcon = false,
  innerColumns,
  outerColumns,
  outerDataSource,
  innerDataSource,
  fetchInnerList,
  fetchOuterList,
  radioValue_,
  ...rest
}) => {
  const intl = useIntl()
  const [radioValue, setRadioValue] = useState<radioItem>(initRadioValue)
  const [showCirculationIcon, setShowCirculationIcon] = useState<boolean>(false)
  const translate = useWebIntl()

  useEffect(() => {
    // 这里判断如果只有外部步骤，没有内部步骤的时候，默认设置 radioValue 为 outer
    if (Array.isArray(outerVerifySteps) && !Array.isArray(innerVerifySteps)) {
      setRadioValue('outer')
    }
  }, [outerVerifySteps])

  const handleRadioChange = (value: 'inner' | 'outer') => {
    setRadioValue(value)
  }

  const options = [
    outerVerifySteps && outerVerifySteps.length
      ? {
          label: intl.formatMessage({ id: 'components.waibuliuzhuan' }),
          value: 'outer',
        }
      : null,
    innerVerifySteps && innerVerifySteps.length
      ? {
          label: intl.formatMessage({ id: 'components.neibuliuzhuan' }),
          value: 'inner',
        }
      : null,
  ].filter(Boolean)

  const titleRender = (stepTitle: string) => {
    return (
      <Tooltip placement="top" title={stepTitle}>
        {stepTitle}
      </Tooltip>
    )
  }

  const onShowCirculation = () => {
    setShowCirculationIcon(true)
  }

  return (
    <div>
      <ButtonTabs
        options={!noTab ? options : []}
        extra={intl.formatMessage({ id: 'components.liuzhuanjindu' })}
        onChange={handleRadioChange}
        value={radioValue}
        circulationIcon={circulationIcon}
        onShowCirculation={onShowCirculation}
        {...rest}
      >
        <ButtonTabs.Item activeKey="outer">
          <div className={styles.steps}>
            <Steps progressDot current={outerVerifyCurrent}>
              {outerVerifySteps &&
                outerVerifySteps.map((item) => (
                  <Steps.Step
                    key={customKey ? item[customKey] : item.step}
                    title={titleRender(customTitleKey ? item[customTitleKey] : item.stepName)}
                    description={item.roleName}
                    status={item.status}
                  />
                ))}
            </Steps>
          </div>
        </ButtonTabs.Item>
        <ButtonTabs.Item activeKey="inner">
          <div className={styles.steps}>
            <Steps progressDot current={innerVerifyCurrent}>
              {innerVerifySteps &&
                innerVerifySteps.map((item) => (
                  <Steps.Step
                    key={customKey ? item[customKey] : item.step}
                    title={titleRender(customTitleKey ? item[customTitleKey] : item.stepName)}
                    description={item.roleName}
                    status={item.status}
                  />
                ))}
            </Steps>
          </div>
        </ButtonTabs.Item>
      </ButtonTabs>

      <Drawer
        title={intl.formatMessage({ id: 'components.liuzhuanjilu' })}
        placement="right"
        width={960}
        onClose={() => {
          setShowCirculationIcon(false)
        }}
        open={showCirculationIcon}
        className={styles.drawer_warp}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              style={{ background: 'rgb(0, 169, 143)', color: '#fff' }}
              onClick={() => setShowCirculationIcon(false)}
            >
              {translate('web.common.close')}
            </Button>
          </div>
        }
      >
        <FlowRecords
          innerRowkey="id"
          innerColumns={innerColumns as any}
          fetchInnerList={fetchInnerList}
          outerRowkey="id"
          outerColumns={outerColumns as any}
          fetchOuterList={fetchOuterList}
          radioValue_={radioValue_}
          outerDataSource={outerDataSource}
          innerDataSource={innerDataSource}
        />
      </Drawer>
    </div>
  )
}

export default AuditProcess
