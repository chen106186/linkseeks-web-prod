import { ClockCircleOutlined } from '@ant-design/icons';
import { Button, Steps } from 'antd';
import react, { useState } from 'react';
import classnames from 'classnames';

const { Step } = Steps;

/**
 * 流转换组件
 * @param param0 
 * showClockIcon true 是否显示时间ICON
 * btnsName ["内部流转","外部流转"]
 * steps [{ 注意这里的 顺序需要和 btnsName 对应
 *  current: 当前的状态
 *  list: title description 
 * }]
 * @returns 
 */
function FlowSwitchSteps({ children, steps, btnsName, showClockIcon = false, id }: {
  children?: JSX.Element,
  btnsName?: string[],
  showClockIcon?: boolean,
  id?: string,
  steps?: {
    current: number,
    list: {
      title: string,
      description: string
    }[]
  }[]
}): JSX.Element {

  const [action, setAction] = useState<number>(0);
  const ActionClass = 'border-green-600 text-green-600';

  function renderSteps(steps) {
    return (
      <Steps progressDot current={steps.current} >
        {steps.list.map(item => {
          return <Step title={item.title} description={item.description} />
        })}
      </Steps >
    )
  }

  return (
    <div className='flow_switch_steps bg-white p-8 rounded'>
      <div className='flex'>
        <div className='flex-1'>
          <h2>流转进度</h2>
        </div>
        <div className=' flex flex-auto flex-row-reverse items-center'>
          <div className='switch_btns'>
            {btnsName.map((name, index) => {
              return (
                <Button
                  size='small'
                  onClick={() => {
                    setAction(index)
                  }}
                  className={classnames(
                    {
                      [ActionClass]: action === index
                    },
                    'mr-3'
                  )}>
                  {name}
                </Button>
              )
            })}
          </div>
          {showClockIcon && <div className='time mr-3'><ClockCircleOutlined /></div>}
        </div>
      </div>

      <div className='flow_body mt-20'>
        {children ? children : renderSteps(steps[action])}
      </div>

    </div>
  );
}


export default FlowSwitchSteps;