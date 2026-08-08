import { getPayAllInPayGetMemberInfo } from '@apps/apis'
import { useEffect } from 'react'
import { useEAccountContext } from './context'

export const useInitAccount = () => {
  const { setFormItems, setbankName } = useEAccountContext()
  /* 请求数据 */
  useEffect(() => {
    getMemberInfo()
  }, [])

  const transformInfo = (data) => {
    const fieldMapping = {
      企业名称: 'companyName',
      法人姓名: 'name',
      法人身份证号码: 'cardNo',
      统一社会信用代码: 'uniCredit',
      // 可以根据实际情况添加其他字段映射
    }

    const obj = {}

    data?.forEach((item) => {
      for (let key of item?.elements) {
        const fieldLocalName = key?.fieldLocalName
        const fieldValue = key?.fieldValue

        if (fieldMapping[fieldLocalName]) {
          obj[fieldMapping[fieldLocalName]] = fieldValue
        }
      }
    })

    return obj as any
  }

  const getMemberInfo = async () => {
    const { code, data } = await getPayAllInPayGetMemberInfo()
    if (code === 1000) {
      if (data) {
        const from = {
          companyName: data?.companyName,
          name: data?.name,
          cardType: data?.cardType,
          cardNo: data?.cardNo,
          phone: data?.phone,
          accountNo: data?.accountNo,
          bankNo: data?.bankNo,
          branchName: data?.branchName,
          ContractNo: data?.ContractNo,
          picUrl: data?.picUrl,
          memberType: data?.memberType,
        }
        setbankName(data?.bankName)
        setFormItems((prev) => {
          return { ...prev, ...from }
        })
      }
    }
  }
}
