interface ChildrenProps {
  children?: React.ReactNode
}
const Children = (props: ChildrenProps) => {
  return props.children
}

Children.defaultProps = {}

Children.isFieldComponent = true

export default Children
