import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { Row, Col } from 'antd';
import { getManageContentAdvertFindAllByColumnType } from '@apps/apis';

interface Iprops {
  // title: string,
  urlLink: string,
  // urlText: string,
  // tips: string,
  imageUrl: string
}

const AdvertisementContainer = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    async function getList(params: { columnType: string }) {
      const { data, code } = await getManageContentAdvertFindAllByColumnType(params);
      if (code === 1000) {
        setData(data);
      }
    }
    getList({columnType: '1'})
  }, [])

  return (
    <Row>
      {
        data.map((item, key) => {
          return (
            <Col span={24} key={key}>
              <AdvertisementSpace
                urlLink={item.link}
                imageUrl={item.imageUrl}
              />
            </Col>
          )
        })
      }
    </Row>
  )
}

const AdvertisementSpace: React.FC<Iprops> = (props) => {
  return (
    <div className={styles.advertisementSpace}>
      <a href={props.urlLink} target="__blank">
        <img src={props.imageUrl} className={styles.img} />
      </a>
    </div>
  )
}
export default AdvertisementContainer
