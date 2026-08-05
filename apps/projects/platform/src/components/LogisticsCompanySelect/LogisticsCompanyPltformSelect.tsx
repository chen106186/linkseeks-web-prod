import LogisticsCompanySelect, { CooperateType } from "./LogisticsCompanySelect";

function LogisticsCompanyPltformSelect(props) {
  const { onChange } = props;
  return (
    <LogisticsCompanySelect onChange={onChange} cooperateType={CooperateType.Platform} />
  )
}

export default LogisticsCompanyPltformSelect