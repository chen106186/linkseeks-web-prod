import { getIntl } from '@linkseeks/i18n'
import { FORM_FILTER_PATH } from '@/formSchema/const'
import { ISchema } from '@apps/formily'
import React from 'react'

const intl = getIntl()

export const querySchema: ISchema = {
  type: 'object',
  properties: {
    megaLayout: {
      type: 'object',
      'x-component': 'mega-layout',
      properties: {
        name: {
          type: 'string',
          'x-component': 'Search',
          'x-component-props': {
            placeholder: `${intl.formatMessage({
              id: 'supplier.supplierInspection.common.schema.add.searchsupplierName',
            })}`,
            align: 'flex-left',
            tip: `${intl.formatMessage({ id: 'supplier.supplierEvaluate.allQuery.schema.searchForsupplierName' })}`,
          },
        },
        [FORM_FILTER_PATH]: {
          type: 'object',
          'x-component': 'mega-layout',
          'x-component-props': {
            grid: true,
            full: true,
            autoRow: true,
            columns: 6,
          },
          properties: {
            subject: {
              type: 'string',
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyTopic',
                })}`,
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            '[rectifyDayStart,rectifyDayEnd]': {
              type: 'daterange',
              'x-component-props': {
                placeholder: [
                  `${intl.formatMessage({ id: 'member.memberRectification.common.schema.index.rectifyBeginTime' })}`,
                  `${intl.formatMessage({
                    id: 'member.memberRectification.tobeConfirmRectification.schema.rectifyCompleteTime',
                  })}`,
                ],
                allowClear: true,
                style: {
                  width: 240,
                },
              },
            },
            outerStatus: {
              type: 'string',
              enum: [],
              'x-component-props': {
                placeholder: `${intl.formatMessage({
                  id: 'member.memberRectification.common.columns.queryColumns.outState',
                })}`,
                allowClear: true,
                style: {
                  width: 160,
                },
              },
            },
            submit: {
              'x-component': 'Submit',
              'x-mega-props': {
                span: 1,
              },
              'x-component-props': {
                children: `${intl.formatMessage({ id: 'member.memberInspection.common.schema.add.query' })}`,
              },
            },
          },
        },
      },
    },
  },
}

export const rectificationReportSchema: ISchema = {
  type: 'object',
  properties: {
    layout: {
      type: 'object',
      'x-component': 'mega-layout',
      'x-component-props': {
        labelCol: 5,
        labelAlign: 'left',
        full: true,
      },
      properties: {
        reportDigest: {
          title: `${intl.formatMessage({ id: 'member.memberRectification.common.hooks.useGetDetailCommon.summary' })}`,
          type: 'textarea',
          'x-rules': [
            {
              limitByte: true, // 自定义校验规则
              maxByte: 120,
            },
          ],
          'x-component-props': {
            placeholder: `${intl.formatMessage({
              id: 'member.complaintsAndSuggests.common.schema.add.noMore120CharOr60ChineseChar',
            })}`,
          },
        },
        reportAttachments: {
          title: `${intl.formatMessage({
            id: 'member.memberRectification.common.hooks.useGetDetailCommon.rectifyReportFile',
          })}`,
          type: 'array',
          'x-component': 'FormilyUploadFiles',
          'x-rules': [
            {
              required: true, // 自定义校验规则
              message: `${intl.formatMessage({
                id: 'member.memberQuery.rectificationQuery.schema.plzUploadAppendix',
              })}`,
            },
          ],
        },
      },
    },
  },
}
