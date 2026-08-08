/*
 * @Author: XieZhiXiong
 * @Date: 2021-06-01 16:13:35
 * @LastEditors: XieZhiXiong
 * @LastEditTime: 2021-12-04 16:16:13
 * @Description: 资质证明上传组件
 */
import React from 'react'
import { getIntl } from '@linkseeks/i18n'
import { Row, Col, Button } from 'antd'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { ArrayList } from '@apps/formily'
import { Schema, SchemaField } from '@apps/formily'
import { toArr, FormPath } from '@apps/formily'
import { UPLOAD_TYPE } from '@/constants'
import styles from './index.less'
import { getWebIntl } from '@apps/locales'
import { FILE_PREFIX_ENUM } from '@apps/constants/file'

const intl = getIntl()
const translate = getWebIntl()
const expireDayTitle = (
  <span style={{ marginTop: 40 }}>
    {intl.formatMessage({ id: 'member.components.QualitiesUploadFormItem.endTime' })}
  </span>
)

const schema = new Schema({
  type: 'object',
  properties: {
    MEGA_LAYOUT1: {
      type: 'object',
      'x-component': 'Mega-Layout',
      'x-component-props': {
        grid: true,
        full: true,
        columns: 2,
      },
      properties: {
        file: {
          type: 'string',
          'x-component': 'QualitiesUpload',
          'x-component-props': {
            action: '/api/support/file/upload/prefix',
            data: {
              fileType: UPLOAD_TYPE,
              prefix: FILE_PREFIX_ENUM.MEMBER_SERVICE,
            },
            accept: '.doc, .docx, .xls, .xlsx, .pot, .pps, .vsd, .wps, .dps, .pdf, .txt, .png, .jpg, .rar, .zip',
          },
          'x-rules': [
            {
              required: true,
              message: intl.formatMessage({
                id: 'member.components.QualitiesUploadFormItem.file.placeholder',
              }),
            },
          ],
        },
        MEGA_LAYOUT2: {
          type: 'object',
          'x-component': 'Mega-Layout',
          properties: {
            expireDay: {
              type: 'string',
              title: expireDayTitle,
              'x-component': 'DatePicker',
              'x-component-props': {
                style: {
                  marginTop: 20,
                },
                placeholder: translate.formatFormSelectTip(
                  intl.formatMessage({
                    id: 'member.components.MemberDocQualification.expireDay',
                  }),
                ),
              },
            },
            permanent: {
              type: 'string',
              title: intl.formatMessage({
                id: 'member.components.QualitiesUploadFormItem.permanent',
              }),
              'x-component': 'CheckboxGroup',
              // default: [1],
              enum: [
                {
                  label: intl.formatMessage({
                    id: 'member.components.QualitiesUploadFormItem.permanent.infinite',
                  }),
                  value: 1,
                },
              ],
            },
          },
        },
      },
    },
  },
})

const QualitiesUploadFormItem = (props) => {
  const {
    value,
    // className,
    editable,
    path,
    mutators,
    // schema,
  } = props
  const { colSpan } = props.props['x-component-props'] || {}

  // 手动添加 ”是否长期有效“ 的默认值
  const onAdd = () => mutators.push({ ...schema.getEmptyValue(), permanent: [1] })
  const onRemove = (index) => mutators.remove(index)

  const span = colSpan
    ? {
        span: colSpan,
      }
    : {
        xs: 24,
        sm: 24,
        md: 24,
        lg: 24,
        xl: 12,
        xxl: 8,
      }

  return (
    <div style={{ width: '100%' }}>
      <ArrayList value={value}>
        <Row gutter={[25, 25]}>
          {toArr(value).map((item, index) => (
            <Col key={index} {...span}>
              <Row gutter={25} align="middle">
                <Col flex={1} className={styles['lineage-cell']}>
                  <SchemaField path={FormPath.parse(path).concat(index)} schema={schema} />
                </Col>
                {editable && (
                  <Col>
                    <Button
                      onClick={() => onRemove(index)}
                      type="link"
                      icon={<CloseCircleOutlined style={{ fontSize: 20 }} />}
                      className={styles['del-btn']}
                    />
                  </Col>
                )}
              </Row>
            </Col>
          ))}
          {editable && (
            <Col {...span}>
              <Button onClick={onAdd} type="dashed" className={styles['add-btn']}>
                <PlusOutlined />
              </Button>
            </Col>
          )}
        </Row>
      </ArrayList>
    </div>
  )
}

QualitiesUploadFormItem.isFieldComponent = true

export default QualitiesUploadFormItem
