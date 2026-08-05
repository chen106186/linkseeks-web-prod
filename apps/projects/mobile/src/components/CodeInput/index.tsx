import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import { View, Input, Text } from '@apps/mobile-ui';
import cx from 'classnames'
import './index.scss';
// import { Input } from 'tar'
// import { AtInput } from 'taro-ui'

interface Iprops {
  password?: string | null,
  /**
   * 表示可填写几个数字
   */
  maxLength?: number,
  /**
  * 是否是明文显示
  */
  isEncrypt?: boolean,
  /**
  * 是否自动获取焦点
  */
  autoFocus?: boolean,
  /**
   * 是否禁用
   */
  disabled?: boolean,
  /**
 * 每个数字的styles
 */
  codeInputClassName?: string,
  /** 完成输入后回调 */
  onFinish?: (code: string, reset: () => void) => void,
  /** onChange */
  onChange?: ((code: string) => void) | null
  /**
   * 高亮
   */
  heigthlightClassName?: string
  /**
   * 键盘弹起时，是否自动上推页面
   */
  adjustPosition?: boolean | undefined
}

const CodeInput: React.FC<Iprops> = (props: Iprops) => {
  const { maxLength, isEncrypt, onFinish, disabled, codeInputClassName, password = null, onChange, heigthlightClassName = '', adjustPosition } = props;
  const [code, setCode] = useState<string>("");
  const { length } = code;

  const padEndCode = useMemo(() => {
    return code.padEnd(maxLength!, " ");
  }, [code, maxLength])

  const reset = () => {
    setCode("")
  }

  const handleInputChange = (value: string) => {
    if (disabled) {
      return
    }
    if (value !== "" && !(/^\d+$/.test(value))) {
      return;
    }
    if (value.length > (maxLength as number)) {
      return;
    }
    onChange?.(value)
    if (password === null) {
      setCode(value);
    }
    if (value.length === maxLength && onFinish) {
      onFinish(value, reset)
    }
  }


  useEffect(() => {
    if (password !== null) {
      setCode(password.substring(0, maxLength));
    }
  }, [password, maxLength])

  /** 将<View>覆盖在 <Input /> 上面 */
  return (
    <View className='codeInput' >
      <View className='code'>
        {
          padEndCode.split("").map((_item, _index) => {
            return (
              <View className='codeItem' key={_index}>
                {
                  length === _index
                    ? <View className={cx('lightHeight', heigthlightClassName)} />
                    : <View
                        className={
                        cx('codeNumber', codeInputClassName)
                      }
                    >
                      {
                        isEncrypt && _item !== ' '
                          ? <View className='encrypt' />
                          : <Text>{_item}</Text>
                      }
                    </View>
                }

              </View>
            )
          })
        }
      </View>
      <View className='password-input'>
        <Input
          type='number'
          adjustPosition={adjustPosition}
          // cursor={-200}
          onChange={handleInputChange}
          focus
          value={code}
          holdKeyboard={false}
          maxlength={maxLength}
        />
      </View>
    </View>
  )
}

CodeInput.defaultProps = {
  maxLength: 6,
  isEncrypt: false,
  codeInputClassName: '',
  disabled: false,
  onChange: null,
  adjustPosition: false,
}

export default CodeInput;
