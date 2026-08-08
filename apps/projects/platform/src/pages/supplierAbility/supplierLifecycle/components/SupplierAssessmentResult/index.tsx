/*
 * @Description: 考评结果
 */
import React, { useMemo } from 'react'
import { normalizeFiledata } from '@/utils'
import CustomizeColumn from '@/components/CustomizeColumn'
import UploadFiles from '@/components/UploadFiles/UploadFiles'
import { useWebIntl } from '@apps/locales'

interface SupplierAssessmentResultProps {
  /**
   * 数据
   */
  data: {
    /**
     * 最终得分
     */
    totalScore: number
    /**
     * 通知会员考评结果0-否1-是
     */
    notifyMember: number
    /**
     * 考评结果
     */
    scoringResultContent: string
    /**
     * 附件
     */
    resultAttachments: {
      name: string
      url: string
    }[]
  }
}

const SupplierAssessmentResult: React.FC<SupplierAssessmentResultProps> = (props) => {
  const { data } = props
  const translate = useWebIntl()
  const result = useMemo(
    () => [
      {
        title: translate('web.resource.member.kaopingzuizhongfenshu'),
        value: data?.totalScore,
      },
      {
        title: translate('web.resource.member.tongzhigongyingshangbiangeng'),
        value:
          data?.notifyMember !== undefined
            ? data?.notifyMember
              ? translate('web.common.shi')
              : translate('web.common.fou')
            : '',
        columnProps: {
          labelStyle: {
            width: 136,
          },
        },
      },
      {
        title: translate('web.resource.member.kaopinjieguo'),
        value: data?.scoringResultContent,
      },
      {
        title: translate('web.resource.member.fujian'),
        value: (
          <UploadFiles fileList={data?.resultAttachments?.map((item) => normalizeFiledata(item.url)) || []} disable />
        ),
        columnProps: {
          contentStyle: {
            display: 'block',
            overflow: 'hidden',
          },
        },
      },
    ],
    [data],
  )

  return <CustomizeColumn title={translate('web.resource.member.kaopinjieguo')} column={2} data={result} />
}

export default SupplierAssessmentResult
