import { useCallback } from "react"

interface ControlTableOptions {
  update?: any,
  remove?: any,
  preview?: any,
  changeStatus?: any,
}

const emptyFn = () => {}

const useControlTable = (options: ControlTableOptions) => {
  const { update = emptyFn, remove = emptyFn, preview = emptyFn, changeStatus = emptyFn } = options

  const handleUpdate = useCallback(() => {

  }, [])

  const handleRemove = useCallback(() => {

  }, [])

  const handlePreview = useCallback(() => {

  }, [])

  const handleChangeStatus = useCallback(() => {

  }, [])

  return {
    handleUpdate,
    handleRemove,
    handlePreview,
    handleChangeStatus
  }
}
