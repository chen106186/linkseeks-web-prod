import React, { useMemo, useState, useEffect } from 'react'
import { inject, observer } from 'mobx-react'

interface AuthComponentPropsType {
  children: any
}

const GetSiteConfig: React.FC<AuthComponentPropsType> = (props) => {
  const [loading, setLoading] = useState<boolean>(false)
  // useMemo(() => {
  //   console.log('当前使用模板', themeName)
  //   document.body.className = `theme-${themeName}`;
  // }, [themeName])

  useEffect(() => {
    // 根据当前网站域名加载站点配置和商城配置
    // const domainName = location.href
    // setTimeout(() => {
    //   setLoading(false)
    //   console.log('当前使用模板', themeName)
    //   // document.body.className = `theme-${themeName}`;
    //   let body = document.getElementsByTagName('body')[0];
    //   let styleLink = document.createElement('link');
    //   styleLink.type = 'text/css';
    //   styleLink.rel = 'stylesheet';
    //   styleLink.id = 'theme-style';
    //   styleLink.href = `/theme/${themeName}.css`;
    //   body.className = `theme-mall-${themeName}`;
    //   document.body.append(styleLink);
    // }, 100);
  }, [])

  return !loading ? <>{props.children}</> : null
}

export default GetSiteConfig
