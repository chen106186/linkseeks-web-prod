import { UploadAction } from '.'

export const useControl = (action: UploadAction, props) => {
  const { fileList } = action
  const { onEdit } = props
  const findIndex = (file) => {
    const index = fileList.indexOf(file)
    if (index === -1) {
      throw '未找到对应的file在fileList中'
    }

    return index
  }

  const handleEdit = (file) => {
    const index = findIndex(file)

    onEdit && onEdit(file, index, action)
  }

  return {
    handleEdit,
  }
}
