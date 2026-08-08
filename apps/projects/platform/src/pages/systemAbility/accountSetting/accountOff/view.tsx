import { Button, Checkbox, Modal, message } from '@linkseeks/ui'
import style from './index.less'
import accountOff from '@/assets/imgs/accountOff.png'
import { PageHeaderWrapper } from '@apps/components'
import { useEffect, useRef } from 'react'
import useLogoff from '@apps/services/safety/useLogoff'
import useNotice, { NoticeColumnType } from '@apps/services/notice/useNotice'
import { useWebIntl } from '@apps/locales'
import LogoffModal from './components/logoffModal'
const AccountOff = () => {
  const { isRead, handleSubmitCheck, toggleReadStatus, formatTips, failKeyList, checkLoading, validateMaps, phone } =
    useLogoff()
  const { noticeContent } = useNotice(NoticeColumnType.LOGOFF)
  const logoffModalRef = useRef<any>({})
  const translate = useWebIntl()

  useEffect(() => {
    if (failKeyList) {
      if (failKeyList.length > 0) {
        Modal.warn({
          title: translate('web.resource.system.zhanghaozhuxiaoxuzhi'),
          content: failKeyList.map((v, i) => <p key={i}>{validateMaps[v]}</p>),
          width: 1024,
          okText: translate('web.common.fanhui'),
        })
      } else {
        // 当账号满足所有注销条件时
        // 唤起注销弹窗
        logoffModalRef.current.logoffToggle(true)
      }
    }
  }, [failKeyList])
  const handleSubmit = async () => {
    if (!isRead) {
      message.warn(translate('web.common.qingxianyuedubingtongyixieyi'))
      return
    }

    handleSubmitCheck()
  }

  const openAgreement = () => {
    Modal.info({
      title: translate('web.resource.system.zhanghaozhuxiaoxuzhi'),
      content: <div dangerouslySetInnerHTML={{ __html: noticeContent }}></div>,
      width: 1024,
      okText: translate('web.common.fanhui'),
    })
  }
  return (
    <PageHeaderWrapper backDom title={translate('web.resource.system.zhanghuzhuxiao')}>
      <div className={style['container']}>
        <div className={style['inset']}>
          <img src={accountOff} />
          <h4>{translate('web.resource.system.henyihanwufaweinintigongfuwu')}</h4>
          <div>
            <div className={style['off-tip-container']}>
              <h6>{translate('web.resource.system.zhuxiaozhanghuqian')}：</h6>
              <div className={style['off-tip-inset']}>
                {formatTips.map((v, i) => {
                  return <p key={i}>{v}</p>
                })}
              </div>
            </div>
            <div className={style['check-container']}>
              <Checkbox checked={isRead} onChange={toggleReadStatus}></Checkbox>
              <span className={style['desc']}>
                {translate('web.resource.system.shenqingzhuxiaojibiaoshi')}
                <Button type="link" onClick={openAgreement}>
                  《{translate('web.resource.system.zhanghaozhuxiaoxuzhi')}》
                </Button>
              </span>
            </div>
          </div>
          <Button type="primary" className={style['btn']} onClick={handleSubmit} loading={checkLoading}>
            {translate('web.resource.system.shenqingzhuxiao')}
          </Button>
        </div>
      </div>
      <LogoffModal ref={logoffModalRef} phone={phone} />
    </PageHeaderWrapper>
  )
}

export default AccountOff
