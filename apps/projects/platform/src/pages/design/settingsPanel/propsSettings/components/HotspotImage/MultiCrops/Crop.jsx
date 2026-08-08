import { Component, Fragment } from 'react'
import interact from 'interactjs'
import PropTypes from 'prop-types'
import { equals, is, update, remove } from 'ramda'
import { CloseCircleOutlined } from '@ant-design/icons'
import { getWebIntl } from '@apps/locales'
import { getTypeName } from '../../MallNav/constants'
import styles from './index.less'

const translate = getWebIntl()

class Crop extends Component {
  lastClick = null
  clickTime = null
  static cropStyle = (coordinate) => {
    const { x, y, width, height } = coordinate

    return {
      position: 'absolute',
      width,
      height,
      top: y,
      left: x,
    }
  }

  componentDidMount() {
    interact(this.crop)
      .draggable({
        modifiers: [
          interact.modifiers.restrictRect({
            restriction: 'parent',
          }),
        ],
      })
      .resizable({
        edges: {
          left: true,
          right: true,
          bottom: true,
          top: true,
        },
        modifiers: [
          interact.modifiers.restrict({
            restriction: 'parent',
            endOnly: true,
          }),
          interact.modifiers.restrictSize({
            min: { width: 60, height: 40 },
          }),
        ],
      })
      .on('dragmove', this.handleDragMove)
      .on('resizemove', this.handleResizeMove)
  }
  shouldComponentUpdate(nextProps) {
    return (
      !equals(nextProps.coordinate, this.props.coordinate) ||
      !equals(nextProps.coordinates, this.props.coordinates) ||
      nextProps.index !== this.props.index
    )
  }

  handleResizeMove = (e) => {
    const {
      index,
      coordinate,
      coordinate: { x, y },
      coordinates,
      onResize,
      onChange,
    } = this.props
    const { width, height } = e.rect
    const { left, top } = e.deltaRect

    const nextCoordinate = {
      ...coordinate,
      x: x + left,
      y: y + top,
      width,
      height,
    }
    const nextCoordinates = update(index, nextCoordinate)(coordinates)
    if (is(Function, onResize)) {
      onResize(nextCoordinate, index, nextCoordinates)
    }
    if (is(Function, onChange)) {
      onChange(nextCoordinate, index, nextCoordinates)
    }
  }
  handleDragMove = (e) => {
    const {
      index,
      coordinate,
      coordinate: { x, y },
      coordinates,
      onDrag,
      onChange,
    } = this.props
    const { dx, dy } = e
    const nextCoordinate = { ...coordinate, x: x + dx, y: y + dy }
    const nextCoordinates = update(index, nextCoordinate)(coordinates)
    if (is(Function, onDrag)) {
      onDrag(nextCoordinate, index, nextCoordinates)
    }

    if (is(Function, onChange)) {
      onChange(nextCoordinate, index, nextCoordinates)
    }
  }

  handleDelete = (e) => {
    e.stopPropagation()
    const { index, coordinate, onDelete, coordinates } = this.props
    const nextCoordinates = remove(index, 1)(coordinates)
    if (is(Function, onDelete)) {
      onDelete(coordinate, index, nextCoordinates)
    }
  }

  componentWillUnmount() {
    interact(this.crop).unset()
  }

  renderHotAreaText = (itemInfo) => {
    return getTypeName(itemInfo.type, itemInfo.valueText)
  }

  render() {
    const { coordinate, changeDropdownMenu } = this.props

    return (
      <div
        className={styles.crop_item}
        style={Crop.cropStyle(coordinate)}
        ref={(crop) => (this.crop = crop)}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          const clickTime = new Date().getTime()
          if (this.lastClick && clickTime - this.lastClick < 300) {
            //第二次及以上点击
            if (!coordinate.type) {
              console.log('double click')
              clearTimeout(this.clickTimer)
              this.props.onItemChooseMenu(coordinate)
            }
          } else {
            //第一次点击
            this.clickTimer = setTimeout(() => {
              console.log('single click')
            }, 300)
          }
          this.lastClick = clickTime
        }}
      >
        <Fragment>
          <div className={styles.hotarea}>
            {coordinate.type ? (
              <div className={styles.hotarea_text}>{this.renderHotAreaText(coordinate)}</div>
            ) : (
              <div className={styles.hotarea_text}>
                <div>{translate('web.resource.shop.dianjishezhi')}</div>
                <div>{translate('web.resource.shop.daohangleixing')}</div>
              </div>
            )}
          </div>
          <div className={styles.delete_icon_box} onClick={this.handleDelete}>
            <CloseCircleOutlined className={styles.delete_icon} />
          </div>
          {coordinate?.type && (
            <div
              className={styles.hotarea_edit}
              onClick={(e) => {
                e.stopPropagation()
                this.props.onItemChooseMenu(coordinate)
              }}
            >
              {translate('web.common.change')}
            </div>
          )}
        </Fragment>
      </div>
    )
  }
}

export const coordinateType = PropTypes.shape({
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
})

Crop.propTypes = {
  coordinate: coordinateType.isRequired,
  index: PropTypes.number.isRequired,
  onResize: PropTypes.func, // eslint-disable-line
  onDrag: PropTypes.func, // eslint-disable-line
  onDelete: PropTypes.func, // eslint-disable-line
  onChange: PropTypes.func, // eslint-disable-line
  coordinates: PropTypes.array, // eslint-disable-line
}

export default Crop
