import { useIntl } from '@linkseeks/i18n'
import styles from './index.less'
import React, { useState, useEffect } from 'react'
import { Card } from 'antd'
import MapChart from './mapChart'
import CustomizeRadio, { Options } from '../CustomizeRadio'
import { RecordList } from '../Record'
import useInterval from '../../../common/hooks/useIntertal'

const WarningArea = () => {
  const [mapData, setMapData] = useState(undefined)
  const intl = useIntl()
  const [warningOptions, setWarningOptions] = useState<Options[]>([
    {
      label: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.all' })}`,
      dataIndex: 'all',
      value: 0,
      count: 6,
    },
    {
      label: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.firstLevel' })}`,
      dataIndex: 'first',
      value: 1,
      count: 6,
    },
    {
      label: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.secondLevel' })}`,
      dataIndex: 'second',
      value: 2,
      count: 6,
    },
    {
      label: `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.thirdLevel' })}`,
      dataIndex: 'second',
      value: 3,
      count: 6,
    },
  ])
  const [activeProvince, setActiveProvince] = useState<string>(
    `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.guangdong' })}`,
  )

  useEffect(() => {
    const dataUrl = 'https://gw.alipayobjects.com/os/bmw-prod/d4652bc5-e971-4bca-a48c-5d8ad10b3d91.json'

    fetch(dataUrl)
      .then((res) => res.json())
      .then((d) => {
        const feas = d.features
          .filter((feat) => feat.properties.name)
          .map((v) => {
            return {
              ...v,
              properties: {
                ...v.properties,
                size: Math.floor(Math.random() * 300),
              },
            }
          })
        const res = { ...d, features: feas }
        setMapData(res)
      })
  }, [])

  const handleChangeProvince = (name: string) => {
    setActiveProvince(name)
  }

  useInterval(() => {
    const randomList = [
      `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.guangdong' })}`,
      `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.shanghai' })}`,
      `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.beijing' })}`,
      `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.sichuan' })}`,
      `${intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.zhejiang' })}`,
    ]
    const key = Math.floor(Math.random() * randomList.length)
    setActiveProvince(randomList[key])
  }, 10000)

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <div className={styles.card}>
        <div className={styles.chartContainer}>
          <header className={styles.header}>
            <div className={styles.title}>
              {intl.formatMessage({ id: 'member.memberWarning.dashboard.components.WarningArea.index.warnArea' })}
            </div>
          </header>
          <div className={styles.chart}>
            <div className={styles.selectData}>
              <span className={styles.province}>{activeProvince}</span>
              <span className={styles.count}>12</span>
            </div>
            <MapChart mapData={mapData} activeProvince={activeProvince} onChangeProvince={handleChangeProvince} />
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.radioContainer}>
            <CustomizeRadio options={warningOptions} />
          </div>
          <RecordList height={384} dataSource={[]} />
        </div>
      </div>
    </Card>
  )
}

export default WarningArea
