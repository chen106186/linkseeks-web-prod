import bronze from './bronze.svg'
import diamonds from './diamonds.svg'
import gold from './gold.svg'
import silver from './silver.svg'
import logo from './logo.png'
import quality from './img/quality.png'
import authentication from './authentication.png'
import Satisfaction from '../Satisfaction'
import { AppstoreOutlined } from '@ant-design/icons'
import styles from './index.module.less'

interface Props {
  cardTitle?: string
  cardAddress?: string
  business?: string
  identification?: string
  cardImg?: string
  registerYears?: string
  creditPoint?: string
  plantArea?: any
  yearProcessAmount?: any
  staffNum?: any
  levelTag?: any
}

function EnterprisesLeft(props: Props) {
  const {
    cardTitle = '-', // 公司名称
    cardImg = logo, // 公司图片
    cardAddress = '-', // 公司地址
    business = '-', // 主营
    identification = '4.9', // 满意程度
    registerYears = '1',
    creditPoint = '0',
    plantArea = '0',
    yearProcessAmount = '0',
    staffNum = '0',
    levelTag = '青铜会员',
  } = props

  const yearProcessAmountList = [
    '50万以下',
    '50万以下',
    '50万-100万',
    '101万-500万',
    '501万-1000万',
    '1001万-2000万',
    '2000万以上',
  ]

  const plantAreaList = [
    '100平以下',
    '100平以下',
    '100平-200平',
    '201平-500平',
    '501平-1000平',
    '1001平-5000平',
    '5000平以上',
  ]

  const staffNumList = ['10人以下', '10人以下', '10-50人', '51-100人', '101-500人', '501-1000人', '1000人以上']

  const fnGetGradeImg = () => {
    switch (levelTag) {
      case '青铜会员':
        return bronze
      case '白银会员':
        return silver
      case '黄金会员':
        return gold
      case '钻石会员':
        return diamonds
      default:
        return silver
    }
  }

  return (
    <ul className={styles['enterprises-left']}>
      <li className={styles['enterprises-title']}>
        <div className={styles['enterprises-title-left']}>
          <div className={styles['enterprises-logo']} style={{ backgroundImage: `url(${cardImg})` }}></div>
          <div className={styles['enterprises-name']}>
            <div className={styles['grad-warp']}>
              <span className={`${styles['has-hover']} ${styles['card-title']}`}>{cardTitle}</span>
              <img className={styles['grad-img']} src={fnGetGradeImg()} alt="" style={{ marginLeft: '8px' }} />
            </div>
            <div className={styles['company-second-title']}>
              <div className={styles['company-quality']}>
                <img src={quality} alt="" />
                <span> {creditPoint} </span>
              </div>
              <div className={styles['company-time']}>入驻 {registerYears ? registerYears : '1'} 年</div>
            </div>
          </div>
        </div>
        <div className={styles['enterprises-address']}>{cardAddress}</div>
      </li>
      <li className={styles['enterprises-identification']}>
        <div className={styles['enterprises-identification-item']}>
          <Satisfaction identification={identification}></Satisfaction>
        </div>
        <div className={styles['enterprises-item']}>
          <span className={styles['enterprises-key']}>厂房面积：</span>
          <span className={styles['enterprises-value']}>{plantAreaList[plantArea]}</span>
        </div>
        <div className={styles['enterprises-item']}>
          <span className={styles['enterprises-key']}>员工人数：</span>
          <span className={styles['enterprises-value']}>{staffNumList[staffNum]}</span>
        </div>
        <div className={styles['enterprises-item']}>
          <span className={styles['enterprises-key']}>年加工额：</span>
          <span className={styles['enterprises-value']}>{yearProcessAmountList[yearProcessAmount]}</span>
        </div>
      </li>
      <li className={styles['business-warp']}>
        <AppstoreOutlined
          translate={undefined}
          className={styles['enterprises-key']}
          style={{ fontSize: '16px', marginRight: '6px' }}
        />
        <span className={styles['enterprises-key']}>主营：</span>
        <span className={`${styles['enterprises-value']} ${styles['has-hover']}`}>{business}</span>
      </li>
      <li style={{ display: 'flex' }}>
        <img src={authentication} alt="" style={{ marginRight: '3px' }} />
        <span className={styles['enterprises-key']}>以上信息已通过会员认证｜</span>
        <div className={styles['enterprises-value']}>
          <span className={styles['has-hover']}>资质证书 &gt;</span>
          <span className={styles['has-hover']}>公司信息 &gt;</span>
        </div>
      </li>
    </ul>
  )
}

export default EnterprisesLeft
