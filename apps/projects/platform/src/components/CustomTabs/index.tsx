import React, { useState, useRef, useEffect, ReactNode } from "react";
import { Button, Form, Input, Row, Col, Modal, Alert } from "antd";
import { PlusOutlined, DeleteOutlined, FormOutlined } from "@ant-design/icons";
import styles from "./index.less";

export interface ItemPane {
  key: string;
  title: string;
  content: string | ReactNode | null;
  isDelete: boolean;
}
export interface ITabsProps {
  renderTabs: ItemPane[]; // tabs列表
  defaultChecked: number;
  isShowAddButton: boolean;
  clickAddButton: () => void;
  clickItemTab: (_index:number) => void;
  clickDeleteItemTab: (_index:number) => void;
}

const CustomTabs: React.FC<ITabsProps> = props => {
  const { renderTabs, defaultChecked, isShowAddButton, clickAddButton, clickItemTab, clickDeleteItemTab } = props;

  const handleDelete = (e: any,_i: number) => {
    e.stopPropagation()
    e.preventDefault()
    clickDeleteItemTab(_i)
  }

  return (
    <div>
      <Row>
        <Col span={4} className={styles.colBox}>
          <ul>
            {
              renderTabs && renderTabs.length>0 && renderTabs.map(
                (item, index) => <>
                  <li key={item.key} className={defaultChecked == index ? styles.activedLi : ""} onClick={()=>clickItemTab(index)}>
                    <span>{item.title}</span>
                    {item.isDelete && <a onClick={(e)=>handleDelete(e, index)}><DeleteOutlined /></a>}
                  </li>
                </>
              )
            }
          </ul>
          { isShowAddButton && 
            <Button
              type="dashed"
              icon={<PlusOutlined />}
              onClick={clickAddButton}
              className={styles.addBtn}
            >
              添加特定属性图片
            </Button>
          }
        </Col>
        <Col span={20} style={{ padding: 24 }}>
          {
            renderTabs && renderTabs.length>0 && renderTabs.map(
              (item, index) => <div key={item.key} style={defaultChecked == index ? {display: 'block'} : {display: 'none'}}>
                { item.content }
              </div>
            )
          }
        </Col>
      </Row>
    </div>
  );
};

export default CustomTabs;
