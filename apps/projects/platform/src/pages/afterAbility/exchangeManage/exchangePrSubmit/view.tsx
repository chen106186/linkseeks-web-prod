/*
 * @Author: XieZhiXiong
 * @Date: 2020-11-17 18:07:41
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-11-17 19:51:03
 * @Description: 待提交审核换货申请单
 */

import ExchangeApplyView from '../../components/ExchangeApplyView'

import { getAftersalesReplaceGoodsPageToBeSubmitBySupplier } from '@apps/apis'

const ExchangePrSubmit: React.FC = () => {
  return <ExchangeApplyView request={getAftersalesReplaceGoodsPageToBeSubmitBySupplier} pageType="exchangePrSubmit" />
}

export default ExchangePrSubmit
