import React from 'react';
import { View, Icons } from '@apps/mobile-ui';
import classNames from 'classnames';
import { useIntl } from '@linkseeks/i18n';
import './index.scss';

interface FilterShelfProps {
  /**
   * 标题
   */
  title: React.ReactNode,
  /**
   * 是否显示更多按钮，默认 true
   */
  more?: boolean,
  /**
   * 描述
   */
  description?: string,
  /**
   * 点击更多触发事件
   */
  onMore?: () => void,

  children?: React.ReactNode,
}

const FilterShelf: React.FC<FilterShelfProps> = (props: FilterShelfProps) => {
  const { title, more, description, onMore, children } = props;
  const intl = useIntl()
  const handleClickMore = () => {
    onMore?.();
  };

  return (
    <View className='filter-shelf'>
      <View className={classNames('filter-shelf-head', { 'filter-shelf-head__chubby': !description })}>
        {
          title && (
            <View className='filter-shelf-title'>
              {title}
            </View>
          )
        }
        {more && (
          <View className='filter-shelf-more' onClick={handleClickMore}>
            <View className='filter-shelf-more-text'>{intl.formatMessage({id: 'search.gengduo', defaultMessage: '更多'})}</View>
            <Icons name='ChevronRight' color='#999999' size={12} className='filter-shelf-more-icon' />
          </View>
        )}
      </View>
      {description && (
        <View className='filter-shelf-chain'>
          {description}
        </View>
      )}
      <View className='filter-shelf-body'>
        {children}
      </View>
    </View>
  );
};

FilterShelf.defaultProps = {
  more: true,
  children: null,
};

export default FilterShelf;
