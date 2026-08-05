import React, { useState, useRef, memo } from 'react'
import { Button, Input, message, Space, Tooltip } from 'antd'
import { DeleteOutlined, FormOutlined } from '@ant-design/icons'
import addCircle from '@/assets/icons/add_circle.png'
import { useIntl } from '@linkseeks/i18n'
import cs from 'classnames'
import { useSortable, CSS } from '@linkseeks/tools'
import styles from './index.less'

export type HandleType = 'add' | 'edit' | 'delete' | 'save' | 'cancel' | 'click'

export type PropsType = {
  dataSource: any
  id: string
  index: number
  active?: boolean
  onHandle?: (handleType: HandleType, index: number, params?: Object) => void
}

const LifecycleItem: React.FC<PropsType> = (props) => {
  const intl = useIntl()
  const { dataSource = {}, index, active, onHandle } = props
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: props.id })

  const [isMouseDown, setIsMouseDown] = useState<boolean>(false)

  const ref = useRef<HTMLDivElement>(null)
  const inputValueRef = useRef<any>(dataSource?.lifecycleStagesName)

  const _onHandle = (handleType: HandleType, otherParams?: Object) => {
    onHandle?.(handleType, index, { ...dataSource, ...otherParams })
  }

  const style: any = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: 'move',
    position: 'relative',
    zIndex: isDragging ? 999 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      className={cs(styles['lifecycle-item'], active && styles.active)}
      style={style}
      {...attributes}
      {...listeners}
    >
      {!dataSource?.isEdit ? (
        <>
          {!isDragging && (
            <div className={styles['edit-box']}>
              <Tooltip title={intl.formatMessage({ id: 'common.button.edit', defaultMessage: '编辑' })}>
                <div
                  className={styles['box-icon']}
                  onClick={() => {
                    _onHandle('edit')
                  }}
                >
                  <FormOutlined />
                </div>
              </Tooltip>
              <Tooltip title={intl.formatMessage({ id: 'common.button.delete', defaultMessage: '删除' })}>
                <div
                  className={styles['box-icon']}
                  onClick={() => {
                    _onHandle('delete')
                  }}
                >
                  <DeleteOutlined />
                </div>
              </Tooltip>
            </div>
          )}
          <div
            ref={ref}
            style={{ opacity: isDragging ? 0.2 : 1 }}
            className={cs(styles['lifecycle-box'])}
            onClick={() => _onHandle('click')}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMouseDown={(e) => {
              setIsMouseDown(true)
            }}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMouseUp={(e) => {
              setIsMouseDown(false)
            }}
          >
            <div className={styles['box-sort']}>{dataSource?.lifecycleStagesNum}</div>
            <div>{dataSource?.lifecycleStagesName}</div>
          </div>
          {!isDragging && !isMouseDown && (
            <div className={styles['add-box']}>
              <Tooltip title={intl.formatMessage({ id: 'common.button.add', defaultMessage: '新建' })}>
                <div
                  className={styles['box-icon']}
                  onClick={() => {
                    _onHandle('add')
                  }}
                >
                  <img src={addCircle} alt="addCircle" />
                </div>
              </Tooltip>
            </div>
          )}
        </>
      ) : (
        <Space size={16} style={{ marginRight: 8 }}>
          <Input
            defaultValue={dataSource?.lifecycleStagesName}
            maxLength={10}
            style={{ width: 160 }}
            onChange={(e) => {
              inputValueRef.current = e.target.value
            }}
          />
          <Button
            type="primary"
            onClick={() => {
              if (['', null, undefined].includes(inputValueRef.current)) {
                message.warning(
                  intl.formatMessage({
                    id: 'lifecycle.pleaseEnterLifecycle',
                    defaultMessage: '请填写生命周期名称',
                  }),
                )
                return
              }
              const toNum = Number(inputValueRef.current)
              if (!!toNum && toNum < 0) {
                message.warning(
                  intl.formatMessage({ id: 'lifecycle.lifecycleNoFu', defaultMessage: '生命周期名称不能为负数' }),
                )
                return
              }
              _onHandle('save', { lifecycleStagesName: inputValueRef.current })
            }}
          >
            {intl.formatMessage({ id: 'common.button.save', defaultMessage: '保存' })}
          </Button>
          <Button
            onClick={() => {
              _onHandle('cancel')
            }}
          >
            {intl.formatMessage({ id: 'common.button.cancel', defaultMessage: '取消' })}
          </Button>
        </Space>
      )}
    </div>
  )
}

export default memo(LifecycleItem)
