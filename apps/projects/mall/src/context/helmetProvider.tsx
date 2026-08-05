import React, { useState } from 'react'
import { Helmet } from 'react-helmet-async'

const helmetContext = React.createContext({})

interface IProps {
  title?: string
  keyword?: string
  description?: string
}

const HelmetProvider: React.FC<React.PropsWithChildren<IProps>> = (props) => {
  const [title, setTitle] = useState<string>(props?.title || '')
  const [keyword, setKeyword] = useState<string>(props?.keyword || '')
  const [description, setDescription] = useState<string>(props?.description || '')

  return (
    <helmetContext.Provider
      value={{
        title,
        keyword,
        description,
        setTitle,
        setKeyword,
        setDescription,
      }}
    >
      <Helmet>
        {title && <title>{title}</title>}
        {keyword && <meta name="keyword" content={keyword} />}
        {description && <meta name="description" content={description} />}
      </Helmet>
      {props.children}
    </helmetContext.Provider>
  )
}

export { helmetContext }
export default HelmetProvider
