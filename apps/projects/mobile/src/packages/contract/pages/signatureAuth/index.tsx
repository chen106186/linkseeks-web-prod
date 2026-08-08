import GlobalWrapper from '@/components/GlobalWrapper'
import React, { useState } from 'react'
import { showToast, preload } from '@apps/mobile-services/utils/taro'
import Router from '@/utils/router'
import { View, Input, Radio } from '@apps/mobile-ui'
import { postContractSignatureAuthOrgAuth, PostContractSignatureAuthOrgAuthRequest } from '@apps/apis'
import { useMobileIntl } from '@apps/locales'
import CardList from './cardList/cardList'
import './index.scss'
interface ParamType extends PostContractSignatureAuthOrgAuthRequest {}
const SignatureAuth = () => {
  const [param, setParam] = useState<Partial<ParamType>>({
    authType: 1,
  })
  const translate = useMobileIntl()
  const upData = <T extends keyof ParamType>(key: T, value: ParamType[T]) => {
    setParam((old) => ({
      ...old,
      [key]: value,
    }))
  }
  const basicInfo = {
    title: translate('mobile.resource.contract.jichuxinxi'),
    dataSource: [
      {
        label: translate('mobile.resource.contract.gongsimingcheng'),
        extra: (
          <Input
            placeholder={translate('mobile.resource.contract.qingshurugongsimingcheng')}
            value={param?.orgName}
            onChange={(e) => upData('orgName', String(e))}
          />
        ),
      },
      {
        label: translate('mobile.resource.contract.tongyishehuixinyongdaima'),
        extra: (
          <Input
            placeholder={translate('mobile.resource.contract.qingshurutongyishehuixinyongdaima')}
            value={param?.orgIDCardNum}
            onChange={(e) => upData('orgIDCardNum', String(e))}
          />
        ),
      },
    ],
  }
  const legalRepInfo = {
    title: translate('mobile.resource.contract.farenxinxi'),
    dataSource: [
      {
        label: translate('mobile.resource.contract.farenxingming'),
        extra: (
          <Input
            placeholder={translate('mobile.resource.contract.qingshurufarenxingming')}
            value={param?.legalRepName}
            onChange={(e) => upData('legalRepName', String(e))}
          />
        ),
      },
      {
        label: translate('mobile.resource.contract.farenshenfenzhenghao'),
        extra: (
          <Input
            placeholder={translate('mobile.resource.contract.qingshurufarenshenfenzhenghao')}
            value={param?.legalRepIdCardNum}
            onChange={(e) => upData('legalRepIdCardNum', String(e))}
          />
        ),
      },
      {
        label: translate('mobile.resource.contract.farenshoujihao'),
        extra: (
          <Input
            placeholder={translate('mobile.resource.contract.qingshurufarenshoujihao')}
            value={param?.legalRepMobile}
            onChange={(e) => upData('legalRepMobile', String(e))}
          />
        ),
      },
    ],
  }
  // 认证类型 1-法人认证 2-经办人认证
  const authTypeInfo = {
    dataSource: [
      {
        label: translate('mobile.resource.contract.renzhengleixing'),
        extra: (
          <Radio.Group value={param?.authType} onChange={(e) => upData('authType', e)}>
            {[
              {
                label: translate('mobile.resource.contract.farenrenzheng'),
                value: 1,
              },
              {
                label: translate('mobile.resource.contract.jinbanrenrenzheng'),
                value: 2,
              },
            ].map((item) => (
              <View
                key={item.value}
                style={{
                  display: 'flex',
                  margin: '0 4px',
                }}
              >
                <Radio value={item.value} size={18}>
                  <View
                    style={{
                      margin: '0 6px',
                    }}
                  >
                    {item.label}
                  </View>
                </Radio>
              </View>
            ))}
          </Radio.Group>
        ),
      },
    ],
  }
  const transactorInfo = {
    title: translate('mobile.resource.contract.jinbanrenxinxi'),
    dataSource: [
      {
        label: translate('mobile.resource.contract.jinbanrenxingming'),
        extra: (
          <Input
            placeholder={translate('mobile.resource.contract.qingshurujinbanrenxingming')}
            value={param?.transactorName}
            onChange={(e) => upData('transactorName', String(e))}
          />
        ),
      },
      {
        label: translate('mobile.resource.contract.jinbanrenshenfenzhenghao'),
        extra: (
          <Input
            placeholder={translate('mobile.resource.contract.qingshurujinbanrenshenfenzhenghao')}
            value={param?.transactorIdCardNum}
            onChange={(e) => upData('transactorIdCardNum', String(e))}
          />
        ),
      },
      {
        label: translate('mobile.resource.contract.jinbanrenshoujihao'),
        extra: (
          <Input
            placeholder={translate('mobile.resource.contract.qingshurujinbanrenshoujihao')}
            value={param?.transactorMobile}
            onChange={(e) => upData('transactorMobile', String(e))}
          />
        ),
      },
    ],
  }
  const onSubmit = () => {
    if (!param.orgName) {
      showToast({
        title: translate('mobile.resource.contract.qingshurugongsimingcheng'),
        icon: 'none',
      })
      return
    }
    if (!param.orgIDCardNum) {
      showToast({
        title: translate('mobile.resource.contract.qingshurutongyishehuixinyongdaima'),
        icon: 'none',
      })
      return
    }
    if (!param.legalRepName) {
      showToast({
        title: translate('mobile.resource.contract.qingshurufarenxingming'),
        icon: 'none',
      })
      return
    }
    if (!param.legalRepIdCardNum) {
      showToast({
        title: translate('mobile.resource.contract.qingshurufarenshenfenzhenghao'),
        icon: 'none',
      })
      return
    }
    if (!param.legalRepMobile) {
      showToast({
        title: translate('mobile.resource.contract.qingshurufarenshoujihao'),
        icon: 'none',
      })
      return
    }
    if (!param.authType) {
      showToast({
        title: translate('mobile.resource.contract.qingxuanzerenzhengleixing'),
        icon: 'none',
      })
      return
    }
    if (param.authType === 2) {
      if (!param.transactorName) {
        showToast({
          title: translate('mobile.resource.contract.qingshurujinbanrenxingming'),
          icon: 'none',
        })
        return
      }
      if (!param.transactorIdCardNum) {
        showToast({
          title: translate('mobile.resource.contract.qingshurujinbanrenshenfenzhenghao'),
          icon: 'none',
        })
        return
      }
      if (!param.transactorMobile) {
        showToast({
          title: translate('mobile.resource.contract.qingshurujinbanrenshoujihao'),
          icon: 'none',
        })
        return
      }
    }
    const newParam = {
      ...param,
    }
    if (param.authType === 1) {
      newParam.transactorName = param.legalRepName
      newParam.transactorIdCardNum = param.legalRepIdCardNum
      newParam.transactorMobile = param.legalRepMobile
    }
    postContractSignatureAuthOrgAuth(newParam as ParamType).then((res) => {
      if (res.code === 1000) {
        preload({
          url: res.data,
        })
        Router.redirectTo('contract/submitSucceed')
      } else {
        showToast({
          title: res.message,
          icon: 'none',
        })
      }
    })
  }
  return (
    <>
      <View className="main-box">
        <CardList data={basicInfo} />
        <CardList data={legalRepInfo} />
        <CardList data={authTypeInfo} />
        {param?.authType === 2 && <CardList data={transactorInfo} />}
      </View>
      <View className="btn-operates">
        <View
          className="btn-operate"
          children={translate('mobile.resource.contract.lijishenqing')}
          onClick={onSubmit}
        />
      </View>
    </>
  )
}
export default GlobalWrapper(SignatureAuth)
