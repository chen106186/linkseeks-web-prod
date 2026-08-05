/*
 * @Author: Crayon
 * @Date: 2021-11-15 14:20:49
 * @LastEditTime: 2021-11-15 18:41:51
 * @LastEditors: Crayon
 * @Description: 授权方式接入网易七鱼客服配置基础信息(暂时用不上了)
 * @FilePath: \lingxi-mobile\src\hooks\useSessionFrom.tsx
 */
import { useEffect } from 'react'
import { useStores } from '@/store/useStores'

interface useSessionFromType {
  title?: string
}

function useSessionFrom(props?: useSessionFromType) {
  const {
    userStore: { userInfo },
  } = useStores()

  const getSessionFrom = () => {
    const ysf = {
      title: props?.title || '公司介绍',
      config: JSON.stringify({
        uid: userInfo?.userId, // 用户唯一标识
        data: JSON.stringify([
          { key: 'real_name', value: userInfo?.userName },
          { key: 'mobile_phone', value: userInfo?.phone },
          { key: 'email', value: userInfo?.email },
        ]),
      }),
    }

    // groupid 客服组ID
    return `nickName=${userInfo?.userName}|avatarUrl=${userInfo?.logo}|groupid=${481477599}|referrerTitle=${
      ysf.title
    }|ysf.config=${ysf.config}`
  }

  const sessionFrom = getSessionFrom()

  return { sessionFrom }
}

export default useSessionFrom
