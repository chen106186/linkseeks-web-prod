import React from 'react'
import classNames from 'classnames'
import { View } from '@apps/mobile-ui'
import { TabsProps } from './Tabs'

interface TabsPaneProps {
  className?: string
  index: number
  current: number
}

const TabsPane: React.FC<TabsPaneProps> = (props) => {
  const { className, index, current, children } = props
  return (
    <View
      className={classNames(
        {
          'tabs-pane': true,
          'tabs-pane--active': index === current,
          'tabs-pane--inactive': index !== current,
        },
        className,
      )}
    >
      {children}
    </View>
  )
}

TabsPane.defaultProps = {
  className: '',
  index: 0,
  current: 0,
}
export default TabsPane
