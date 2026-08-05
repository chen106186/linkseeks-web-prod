import style from './index.less'
const SringField = (props: any) => {
  const { styles, text, required } = props
  return (
    <span style={styles ? styles : {}} className={style['string-field']}>
      {text}
      {required ? <>:</> : null}
    </span>
  )
}

export default SringField
