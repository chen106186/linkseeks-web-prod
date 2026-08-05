import { Carousel } from '@linkseeks/ui'
import { useEffect, useState } from 'react'
import { ImageBox } from '@apps/components'
import style from './index.less'

const SceneList = ({ sceneList }) => {
  return (
    <div className={style['scene-container']}>
      <Carousel autoplay>
        {sceneList &&
          sceneList.map((item) => (
            <ImageBox
              key={item.id}
              style={{ width: '100%' }}
              width={410}
              height={512}
              src={item.imageUrl}
              resizeMode="cover"
            />
          ))}
      </Carousel>
    </div>
  )
}

export default SceneList
