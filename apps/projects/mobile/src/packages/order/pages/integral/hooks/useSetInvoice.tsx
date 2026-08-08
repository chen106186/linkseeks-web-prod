import React, { useCallback, useMemo, useState } from 'react';

type InvoiceType = {
  account: string | null,
  address: string | null,
  bankOfDeposit: string | null,
  createRoleId: number,
  createTime: number,
  id: number,
  /** 发票台头 */
  invoiceTitle: string,
  isDefault: number
  /** 发票种类，1-企业，2-个人 */
  kind: 1 | 2 | number | {},
  memberId: number,
  taxNo: string
  tel: null | string
  /** 发票类型，1-增值税普通发票，2-增值税专用发票 */
  type: 1 | 2 | number | {}
  updateTime: number
}

/**
 * 设置发票
 */
function useSetInvoice( options: { invoiceInfo: InvoiceType | null } ) {
  // const [invoice, setInvoice] = useState<null | InvoiceType>(null);

  // const handleChoiceInvoice = useCallback((invoiceData: InvoiceType) => {
  //   setInvoice(invoiceData)
  // }, [])

  const cacheInvoice = useMemo(() => {
    return options.invoiceInfo
  }, [options.invoiceInfo])

  return { invoice: cacheInvoice }
}

export default useSetInvoice;
