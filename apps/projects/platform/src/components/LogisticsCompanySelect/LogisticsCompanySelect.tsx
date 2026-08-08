import { getLogisticsSelectListCompany } from "@apps/apis";
import { FormInstance, Select } from "antd";
import { useEffect, useState } from "react";

export enum CooperateType {
  Platform = "1",
  Merchants = "2"
}

interface LogisticsCompanySelectProps {
  onChange?: (value) => void
  cooperateType: CooperateType.Platform | CooperateType.Merchants
  value?: any
  disabled?: boolean,
  formProp?: FormInstance
  id?: string
}

function LogisticsCompanySelect(props: LogisticsCompanySelectProps) {

  const { onChange, cooperateType, value, disabled = false, formProp, id } = props;
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    getLogisticsSelectListCompany({
      cooperateType
    }).then(res => {
      const options =
        res.data ?
          res.data.map(item => ({
            label: item.name,
            value: item.id,
          })) :
          [];

      setOptions(options)
      if (!value) {
        const d: any[] = JSON.parse(JSON.stringify(options))
        if (undefined != formProp) {
          formProp.setFieldsValue({
            [id]: d.shift()
          })
        }
      }
    })
  }

  return (
    <Select
      placeholder={`请选择送样类型`}
      disabled={disabled} value={value} options={options} onChange={(v) => {
        const option = options.find(o => {
          return o.value == v
        })
        onChange(option)
      }} />
  )
}

export default LogisticsCompanySelect
