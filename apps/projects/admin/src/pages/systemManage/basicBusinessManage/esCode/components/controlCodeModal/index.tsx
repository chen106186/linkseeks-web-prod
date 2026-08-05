import { postManageHotWordInsertBatch } from '@apps/apis'
import { LineTitle } from '@apps/components'
import { useMemoizedFn, useRequestApi, useToggle } from '@linkseeks/hooks'
import { Input, Modal, message } from '@linkseeks/ui'
import { forwardRef, useImperativeHandle, useMemo, useState, useEffect } from 'react'
const ControlCodeModal = forwardRef<any, any>(({ tableRef }, ref) => {
  const [visible, toggle] = useToggle(false)
  const [controlStatus, setControlStatus] = useState<'add' | 'edit'>('add')
  const [code, setCode] = useState('')
  const { run, loading } = useRequestApi(postManageHotWordInsertBatch, {
    manual: true,
    onSuccess() {
      toggle(false)
      tableRef.current.reload()
    },
  })

  useEffect(() => {
    // 每次打开的时候 重置值
    if (visible === true) {
      setCode('')
    }
  }, [visible])
  const handleSubmit = () => {
    const parseCode = code.trim()
    if (!parseCode) {
      message.error('词语不得为空')
      return
    }
    run({
      wordList: parseCode.split('\n'),
    })
  }
  useImperativeHandle(ref, () => ({
    toggleModal(type: 'add' | 'edit') {
      setControlStatus(type)
      toggle()
    },
  }))

  const renderTitle = useMemo(() => {
    if (controlStatus === 'add') {
      return '新增词库内容'
    } else if (controlStatus === 'edit') {
      return '编辑词库内容'
    }
  }, [controlStatus])

  const handleSetCode = (e) => {
    setCode(e.target.value)
  }
  return (
    <Modal
      open={visible}
      title={renderTitle}
      onOk={handleSubmit}
      onCancel={toggle}
      confirmLoading={loading}
      destroyOnClose
    >
      <Input.TextArea value={code} onChange={handleSetCode} placeholder="请输入词语" rows={5} />
      <LineTitle style={{ marginTop: 24, color: '#91959b', fontSize: 12 }}>支持批量新增，格式: 每行输入一个</LineTitle>
    </Modal>
  )
})

export default ControlCodeModal
