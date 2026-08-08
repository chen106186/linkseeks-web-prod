import { useCallback, useState } from "react";

/**
 * 批量列表页审核hook
 * @returns
 */
 function useSingleActionSubmit() {
  const [submitLoadingID, setSubmitLoadingID] = useState<number[]>([]);

  const onSingleAction = async <T,>(api: (params: {id: number}) => Promise<T>, params: { id: number }) => {
    setSubmitLoadingID((prev) => {
      prev.push(params.id);
      return prev;
    })
    let res;
    try {
      res = await api(params)
    } finally {
      setSubmitLoadingID((prev: number[]) => prev.filter((_item) => _item !== params.id))
    }
    return res
  }
  return { submitLoadingID, onSingleAction }
}

export default useSingleActionSubmit
