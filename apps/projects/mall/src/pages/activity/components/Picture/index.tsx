import React from 'react'

interface Iprops {
  /** 广告图 */
  imageUrl: string
}

const Picture: React.FC<Iprops> = (props: Iprops) => {
  const { imageUrl } = props
  return (
    <div style={{ height: '300px', width: '100%', display: 'flex', justifyContent: 'center' }}>
      <div style={{ height: '300px', width: '1200px' }}>
        <img src={imageUrl} style={{ width: '100%', height: '100%' }} />
      </div>
    </div>
  )
}

export default Picture
