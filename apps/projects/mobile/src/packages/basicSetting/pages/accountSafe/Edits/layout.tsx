import React from 'react';
import { useIntl } from '@linkseeks/i18n';
import { View, Text, Button } from '@apps/mobile-ui';
import styles from './style.module.scss';


interface Iprops {
  onSubmit?: null | ((data?: any) => void),
  children: () => React.ReactNode,
  title: string,
}

const Layout: React.FC<Iprops> = (props: Iprops) => {
  const { onSubmit, children, title } = props;
  const intl = useIntl()
  const formSubmit = (data?: any) => {
    if (onSubmit) {
      onSubmit(data)
    }
  };

  return (
    <View className={styles['page']}>
      <View className={styles['scroll-view']}>
        <Text className={styles['password-text']}>{title}</Text>
        {children && children()}
        <Button onClick={formSubmit} className={styles['btn']}>
          <Text style={{ color: '#fff' }}>{intl.formatMessage({id: 'user.queding', defaultMessage: '确定'})}</Text>
        </Button>
      </View>
    </View>
  )
}

Layout.defaultProps = {
  onSubmit: null,
}

export default Layout;
