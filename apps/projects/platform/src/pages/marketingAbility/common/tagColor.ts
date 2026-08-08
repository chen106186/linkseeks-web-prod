export const OuterStatusColor = (type) => {
  switch (type) {
    case 1:
    case 2:
    case 3:
    case 6:
      return 'warning'
    case 4:
      return 'success'
    case 5:
      return 'error'
    case 7:
      return 'processing'
    default:
      return 'default'
  }
}

export const InnerStatusColor = (type) => {
  switch (type) {
    case 1:
    case 2:
    case 4:
    case 6:
      return 'warning'
    case 3:
    case 5:
      return 'error'
    case 7:
      return 'processing'
    case 9:
      return 'success'
    default:
      return 'default'
  }
}
