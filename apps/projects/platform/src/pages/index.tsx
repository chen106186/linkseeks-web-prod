import React, { Component } from 'react'
import { Link } from '@linkseeks/router-core'
import SchemaForm, { SchemaField, Schema, createControllerBox } from '@apps/formily'
import { getOssUrlPath } from '@apps/constants'
import { Modal } from 'antd'

class Index extends Component<{}, {}> {
  render() {
    return (
      <div
        style={{
          margin: '-24px',
        }}
      >
        <img
          src={getOssUrlPath(`/irregular/a121f49434074532837012acf75e52011601275036112.png`)}
          width="100%"
          height="auto"
        />
      </div>
    )
  }
}

export default Index
