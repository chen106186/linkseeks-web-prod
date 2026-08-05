import LogisticsCompanySelect, { CooperateType } from "./LogisticsCompanySelect"

function LogisticsCompanyMerchantsSelect(props) {
  const { onChange, value, disabled = false } = props;
  return (
    <LogisticsCompanySelect formProp={props.formProp} id={props.id} disabled={disabled} value={value} onChange={onChange} cooperateType={CooperateType.Merchants} />
  )
}

export default LogisticsCompanyMerchantsSelect