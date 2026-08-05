import { useState, useCallback, memo, forwardRef, useImperativeHandle } from 'react'
import { Button, Checkbox, Col, Modal, Row, message } from 'antd'
import update from 'immutability-helper'
import { BaseInfo } from '@/components/BaseInfo'
import type { HandleType } from './LifecycleItem'
import LifecycleItem from './LifecycleItem'
import styles from './index.less'
import { ExclamationCircleFilled } from '@ant-design/icons'
import { getIntl } from '@linkseeks/i18n'
import { isArray } from 'lodash'
import { DndContextProvider, useDnd } from './useDnd'
import { arrayMove } from '@linkseeks/tools'

interface propsType {
  lifecycleType: 'SUPPLIER' | 'CUSTOMER'
  onChange?: (value?: any) => void
  value?: any
}
const intl = getIntl()
const getConfirmContent = (type: 'SUPPLIER' | 'CUSTOMER', name?: string) => {
  return {
    0: `${intl.formatMessage({
      id: 'lifecycle.confirmDeleteTips',
      defaultMessage: '确定要删除',
    })} ${intl.formatMessage({
      id: 'lifecycle.lifecycle',
      defaultMessage: '生命周期',
    })}-${name} ？`,
    1:
      type === 'SUPPLIER'
        ? intl.formatMessage({
            id: 'lifecycle.supplierCannotDeleteTips',
            defaultMessage: '当前供应商生命周期阶段存在供应商，无法删除！',
          })
        : intl.formatMessage({
            id: 'lifecycle.customerCannotDeleteTips',
            defaultMessage: '当前客户生命周期阶段存在客户，无法删除！',
          }),
  }
}
const LifecycleSortList = (props: propsType, ref) => {
  const { lifecycleType, value, onChange } = props
  const [activeKey, setActiveKey] = useState<any>()
  const [stagesRuleIds, setStagesRuleIds] = useState<any[]>([])
  const [phaseRuleOptions, setPhaseRuleOptions] = useState<any[]>([])
  const dndProps = useDnd()

  // 状态重置
  const resetState = (unCheck = true) => {
    if (unCheck) {
      setActiveKey(null)
    }
  }

  /**
   * 拖拽
   * @param dragIndex 操作块索引
   * @param hoverIndex 目标块索引
   */
  const onMove = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragValue = value[dragIndex]
      const hoverValue = value[hoverIndex]
      const updateValue = update(value, {
        // 拖拽交换位置跟序号
        $splice: [
          [hoverIndex, 1, { ...dragValue, lifecycleStagesNum: hoverValue.lifecycleStagesNum }],
          [dragIndex, 1, { ...hoverValue, lifecycleStagesNum: dragValue.lifecycleStagesNum }],
        ],
      })
      onChange?.(updateValue)
    },
    [value],
  )

  /**
   * 操作
   * @param handleType 操作类型
   * @param handleIndex 索引值
   * @param params 相关参数
   */
  const onHandle = useCallback(
    (
      handleType: HandleType,
      handleIndex: number,
      { lifecycleKey, lifecycleStagesName, lifecycleStagesNum, lifecycleStagesRuleIds, relevance }: any,
    ) => {
      const handleValue = value[handleIndex]
      switch (handleType) {
        // 新增
        case 'add':
          // 拿当前时间戳做自定义Key
          const customKey = new Date().getTime()
          // 序号（lifecycleStagesNum）赋值 -1，标识为非正式数据
          onChange?.(
            update(value, {
              $splice: [
                [
                  handleIndex + 1,
                  0,
                  {
                    lifecycleKey: customKey,
                    lifecycleStagesName: '',
                    lifecycleStagesNum: -1,
                    lifecycleStagesRuleIds: [],
                    isEdit: true,
                    relevance: 0,
                  },
                ],
              ],
            }),
          )
          break

        // 编辑
        case 'edit':
          onChange?.(
            update(value, {
              $splice: [[handleIndex, 1, { ...handleValue, isEdit: true }]],
            }),
          )
          break

        // 删除
        case 'delete':
          Modal.confirm({
            title: intl.formatMessage({ id: 'lifecycle.deleteTips', defaultMessage: '删除提示' }),
            content: getConfirmContent(lifecycleType, lifecycleStagesName)[relevance],
            okText:
              relevance === 1
                ? intl.formatMessage({ id: 'common.button.confirm', defaultMessage: '确定' })
                : intl.formatMessage({
                    id: 'common.button.confirmDelete',
                    defaultMessage: '确定删除',
                  }),
            okType: relevance === 1 ? 'primary' : 'danger',
            className: styles['custom-modalConfirm'],
            icon: <ExclamationCircleFilled style={{ color: '#E34D59' }} />,
            onOk() {
              if (relevance !== 1) {
                let sort = 0
                onChange?.(
                  update(value, { $splice: [[handleIndex, 1]] }).map((item) => {
                    // 非正式数据不加入序号计算
                    if (item.lifecycleStagesNum === -1) {
                      return item
                    }
                    sort++
                    return {
                      ...item,
                      lifecycleStagesNum: sort,
                    }
                  }),
                )
                // 如果当前删除的生命周期是已选中的生命周期，需重置对应的选中信息
                resetState(lifecycleKey === activeKey)
                message.success(
                  intl.formatMessage({
                    id: 'lifecycle.dataDeleteSuccess',
                    defaultMessage: '数据删除成功',
                  }),
                )
              }
            },
          })
          break

        // 保存 - 保存新增或编辑
        case 'save':
          // 校验生命周期名是否重复
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          if (checkNameIsRe(lifecycleStagesName)) {
            return
          }
          let saveValue = update(value, {
            $splice: [[handleIndex, 1, { ...handleValue, lifecycleStagesName, isEdit: false }]],
          })
          // 序号（lifecycleStagesNum）为 -1 表示保存的是非正式数据，即保存新增，所以这里重新整理序号（lifecycleStagesNum）
          // 若序号（lifecycleStagesNum）不为 -1，则表示保存编辑，序号无需重新整理
          if (lifecycleStagesNum === -1) {
            let sort = 0
            saveValue = saveValue.map((item, idx) => {
              // 非正式数据且不为当前操作数据不加入序号计算
              if (item.lifecycleStagesNum === -1 && handleIndex !== idx) {
                return item
              }
              sort++
              return {
                ...item,
                lifecycleStagesNum: sort,
              }
            })
          }
          onChange?.(saveValue)
          break

        // 取消 - 取消新增或编辑
        case 'cancel':
          // 序号（lifecycleStagesNum）为 -1 表示非正式数据，取消的同时直接移除
          onChange?.(
            update(value, {
              $splice: [
                lifecycleStagesNum === -1 ? [handleIndex, 1] : [handleIndex, 1, { ...handleValue, isEdit: false }],
              ],
            }),
          )
          break

        // 点击 - 选中与否
        case 'click':
          setActiveKey((v) => (v === lifecycleKey ? null : lifecycleKey))
          setStagesRuleIds(lifecycleStagesRuleIds || [])
          break
      }
    },
    [value, activeKey],
  )
  /**
   * 新增生命周期
   */
  const onAddLifecycle = () => {
    const customKey = new Date().getTime()
    // 序号（lifecycleStagesNum）赋值 -1，标识为非正式数据
    onChange?.(
      update(value, {
        $push: [
          {
            lifecycleKey: customKey,
            lifecycleStagesName: '',
            lifecycleStagesNum: -1,
            lifecycleStagesRuleIds: [],
            isEdit: true,
            relevance: 0,
          },
        ],
      }),
    )
  }
  /**
   * 阶段规则设置
   */
  const onStagesRule = (checkedValue) => {
    setStagesRuleIds(checkedValue)
    const handleIndex = value?.findIndex((item) => item.lifecycleKey === activeKey)
    onChange?.(
      update(value, {
        $splice: [[handleIndex, 1, { ...value[handleIndex], lifecycleStagesRuleIds: checkedValue }]],
      }),
    )
  }
  /** 校验生命周期名是否重复 */
  const checkNameIsRe = (name: string) => {
    if (value && isArray(value)) {
      const isRepetition = value.some((item) => {
        return item.lifecycleStagesName === name
      })
      if (isRepetition) {
        message.warning(intl.formatMessage({ id: 'lifecycle.lifecycleNoRe', defaultMessage: '生命周期名称不能重复' }))
      }
      return isRepetition
    }
    return false
  }

  useImperativeHandle(ref, () => ({
    resetState,
    setPhaseRuleOptions,
  }))

  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = value.findIndex((v) => v.lifecycleKey === active.id)
      const newIndex = value.findIndex((v) => v.lifecycleKey === over.id)
      onChange?.(arrayMove(value, oldIndex, newIndex))
    }
  }

  return (
    <>
      <BaseInfo
        className="mt-0"
        cols={1}
        title={intl.formatMessage({
          id: 'lifecycle.lifecycleConfig',
          defaultMessage: '生命周期配置',
        })}
        subtitle={
          <Button type="link" onClick={onAddLifecycle}>
            {intl.formatMessage({
              id: 'lifecycle.addLifecycleConfig',
              defaultMessage: '新增生命周期',
            })}
          </Button>
        }
      >
        <DndContextProvider {...dndProps} handleDragEnd={handleDragEnd} items={value.map((item) => item.lifecycleKey)}>
          {value?.map((item, index) => (
            <LifecycleItem
              id={item.lifecycleKey}
              key={item.lifecycleKey}
              index={index}
              dataSource={item}
              active={activeKey === item.lifecycleKey}
              onHandle={onHandle}
            />
          ))}
        </DndContextProvider>
      </BaseInfo>
      {activeKey && (
        <BaseInfo
          className="mt-16"
          title={intl.formatMessage({
            id: 'lifecycle.stageRuleSettings',
            defaultMessage: '阶段规则设置',
          })}
        >
          <Checkbox.Group value={stagesRuleIds} onChange={onStagesRule}>
            <Row gutter={[0, 16]}>
              {phaseRuleOptions?.map((item) => (
                <Col key={item.lifeCycleRuleId} span={24}>
                  <Checkbox value={item.lifeCycleRuleId}>{item.lifeCycleRuleName}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </BaseInfo>
      )}
    </>
  )
}
export default memo(forwardRef(LifecycleSortList))
