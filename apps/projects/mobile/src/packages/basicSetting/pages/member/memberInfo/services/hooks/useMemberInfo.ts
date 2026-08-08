import React, { useEffect, useState } from 'react'
import { useDidShow, setNavigationBarTitle, previewImage, pxTransform } from '@apps/mobile-services/utils/taro'
import { Text, View, Image, Icons, ScrollView } from '@apps/mobile-ui'
import Router from '@/utils/router'
import { getAsyncStorage } from '@apps/mobile-services/utils/storage'
import { useIntl } from '@linkseeks/i18n'
import useStores from '@/store/useStores'
import { USER_INFO } from '@/constants/storage'
import {
  getMemberAreaCity,
  getMemberAreaDistrict,
  getMemberAreaProvince,
  getMemberMobileInfoDetailBasic,
} from '@apps/apis'

const useMemberInfo = () => {
  const intl = useIntl()
  const {
    userStore: { shopAndSite },
  } = useStores()

  const [userInfo, setUserInfo] = useState<any>({
    groups: [
      {
        elements: [],
      },
    ],
  })
  const handleChooseAvatar = (e) => {
    console.log(e)
  }
  const [basic, setBasic] = useState<any>([])
  const [groups, setgroups] = useState<any>([])
  const [memberType, setMemberType] = useState(0)
  const [showModify, setShowModify] = useState(false)

  const Jump = () => {
    // TODO:
    Router.navigateTo('basicSetting/memberInfoEdit')
  }
  useDidShow(() => {
    setNavigationBarTitle({ title: intl.formatMessage({ id: 'user.huiyuanxinxi', defaultMessage: '会员信息' }) })
    getMemberType()
    getData()
  })
  /* 处理下拉框的数据 */
  const getSelect = (item: any) => {
    let val = ''
    item.fieldEnum.find((key: any) => {
      if (item.fieldValue === key.value) {
        val = key.label
      }
    })
    const obj = {
      name: item.fieldLocalName,
      fieldType: item.fieldType,
      fieldValue: val,
    }
    return obj
  }

  const getCheckbox = (item: any) => {
    let val = ''
    for (let i = 0; i < item.fieldValue.length; i++) {
      for (let j = 0; j < item.fieldEnum.length; j++) {
        if (item.fieldValue[i] === item.fieldEnum[j].value) {
          val += item.fieldEnum[j].label + ','
        }
      }
    }
    val = val.substring(0, val.length - 1)
    const obj = {
      name: item.fieldLocalName,
      fieldType: item.fieldType,
      fieldValue: val,
    }
    return obj
  }
  const getRadio = (item: any) => {
    let val = ''
    for (var i = 0; i < item.fieldEnum.length; i++) {
      if (item.fieldEnum[i].value === item.fieldValue) {
        val = item.fieldEnum[i].label
        break
      }
    }
    const obj = {
      name: item.fieldLocalName,
      fieldType: item.fieldType,
      fieldValue: val,
    }
    return obj
  }
  /* 根据返回区号过滤回显地址 */
  const address = async (element: any) => {
    const { provinceCode, cityCode, districtCode } = element.fieldValue
    if (!provinceCode) {
      return {
        name: element.fieldLocalName,
        fieldType: element.fieldType,
        fieldValue: '',
      }
    }
    const provinceRes = await getMemberAreaProvince()
    const cityRes = await getMemberAreaCity({ code: provinceCode })
    const distrRes = await getMemberAreaDistrict({ code: cityCode })
    let provinceName = ''
    provinceRes.data.forEach((ele: any) => {
      if (ele.code === provinceCode) {
        provinceName = ele.name
      }
    })
    let cityName = ''
    cityRes.data.forEach((item: any) => {
      if (item.code === cityCode) {
        cityName = item.name
      }
    })
    let districtName = ''
    distrRes.data.forEach((ele: any) => {
      if (ele.code === districtCode) {
        districtName = ele.name
      }
    })
    const obj = {
      name: element.fieldLocalName,
      fieldType: element.fieldType,
      fieldValue: provinceName + cityName + districtName,
    }
    return obj
  }
  const getData = () => {
    const data: any = {
      shopType: 1,
      self: shopAndSite?.isSelf ? 1 : 0,
      isSelf: shopAndSite?.isSelf,
      upperMemberId: shopAndSite?.memberId ? shopAndSite?.memberId : '',
      upperRoleId: shopAndSite?.memberRoleId ? shopAndSite?.memberRoleId : '',
    }

    getMemberMobileInfoDetailBasic(data).then(async (res: any) => {
      if (res.code === 1000) {
        setUserInfo(res.data)
        setShowModify(res.data.showModify)
        const basicInfo = [
          // {
          //   name: '会员角色',
          //   key: '采购商',
          // },
          {
            name: intl.formatMessage({ id: 'user.dengluzhanghao', defaultMessage: '登录账号' }),
            key: res.data.account,
          },
          {
            name: intl.formatMessage({ id: 'user.zhuceshoujihao', defaultMessage: '注册手机号' }),
            key: res.data.phone,
          },
          {
            name: intl.formatMessage({ id: 'user.zhuceyouxiang', defaultMessage: '注册邮箱' }),
            key: res.data.email,
          },
          {
            name: intl.formatMessage({ id: 'user.shenqingshijian', defaultMessage: '申请时间' }),
            key: res.data.createTime,
          },
        ]
        setBasic(basicInfo)
        setShowModify(res.data.groups.length !== 0)
        const groupsList: any = []
        for (let element of res.data.groups) {
          const $data: any = {
            name: element.groupName,
            list: [],
          }
          for (let i of element.elements) {
            const _item = i
            switch (_item.fieldType) {
              case 'string':
              case 'number':
              case 'file':
                $data.list.push({
                  name: _item.fieldLocalName,
                  fieldValue: _item.fieldValue,
                  fieldType: _item.fieldType,
                })
                break
              case 'select':
                $data.list.push(getSelect(_item))
                break
              case 'checkbox':
                $data.list.push(getCheckbox(_item))
                break
              case 'radio':
                $data.list.push(getRadio(_item))
                break
              case 'area':
                const _data = await address(_item)
                $data.list.push(_data)
                break
              default:
                break
            }
          }
          groupsList.push($data)
        }
        setgroups(groupsList)
      }
    })
  }
  const getMemberType = async () => {
    const res = await getAsyncStorage(USER_INFO)
    if (res) {
      setMemberType(res.memberType)
    }
  }
  const previewImageFunc = (url) => {
    const previewImgArr: any = []
    previewImgArr.push(url)
    previewImage({
      current: url, // 当前显示图片的http链接
      urls: previewImgArr, // 需要预览的图片http链接列表
    })
  }

  return {
    userInfo,
    showModify,
    basic,
    groups,
    Jump,
    previewImageFunc,
    getMemberType,
    getData,
    handleChooseAvatar,
  }
}

export default useMemberInfo
