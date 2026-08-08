import style from './index.less'
import { useMenuContext } from '../../services/context'
import { useMemoizedFn } from '@linkseeks/hooks'
import memberService from '../../services/member.service'
import LanguageText from '../languageText'
import { Button, Popconfirm, Space } from '@linkseeks/ui'
import { EditFillIcon, EditIcon, TrashFillIcon } from '@linkseeks/icons'
import { postMemberMenuConfigDeleteButton } from '@apps/apis'
import useNodeClick from '../../services/hooks/useNodeClick'
import { useTree } from '@apps/components'

const ButtonList = () => {
  const { buttonList, selectButton, setSelectButton, setInterfaceList, setButtonFormStatus, handleButtonToggle } =
    useMenuContext()
  const { selectNode } = useTree()
  const { handleClick: handleNodeClick } = useNodeClick()
  const handleClick = useMemoizedFn(async (button) => {
    const { data } = await memberService.getInterfaceList(button.id)

    setInterfaceList(data)
    setSelectButton(button)
  })

  const handleDelete = async (id) => {
    await postMemberMenuConfigDeleteButton({
      id,
    })
    handleNodeClick(selectNode)
  }

  const handleEdit = async (data) => {
    handleButtonToggle('edit', data)
  }
  return (
    <div className={style['list']}>
      {buttonList.length === 0 && <div>暂无数据</div>}
      {buttonList.map((v) => (
        <div
          className={`${style['item']} ${selectButton?.path === v.path ? style['active'] : ''}`}
          key={v.path}
          onClick={() => handleClick(v)}
        >
          <LanguageText {...v} />
          <Space>
            <Button type="text" icon={<EditFillIcon />} onClick={() => handleEdit(v)} />
            <Popconfirm title="确认删除吗" onConfirm={() => handleDelete(v.id)}>
              <Button type="text" icon={<TrashFillIcon />}></Button>
            </Popconfirm>
          </Space>
        </div>
      ))}
    </div>
  )
}

export default ButtonList
