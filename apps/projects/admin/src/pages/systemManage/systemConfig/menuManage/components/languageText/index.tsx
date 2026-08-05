import { Tooltip } from 'antd'

const LanguageText = ({ buttonNameList, path }) => {
  return (
    <Tooltip
      title={buttonNameList?.map((v) => (
        <p key={v.language}>
          {v.language}: {v.value}
        </p>
      ))}
    >
      <div>{buttonNameList?.[0].value}</div>

      <div>{path}</div>
    </Tooltip>
  )
}

export default LanguageText
