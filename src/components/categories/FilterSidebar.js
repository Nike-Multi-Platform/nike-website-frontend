import React, { useState, useEffect } from "react";
import { Layout, Menu, Card, Row, Col, Pagination, Slider, Select } from "antd";
import {
  ShopOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  DollarOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";

const { Meta } = Card;
const { Sider, Content } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

const FilterSidebar = (props) => {
  return (
    <Sider width={250} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <SubMenu key="sub1" icon={<ShopOutlined />} title="Shoes">
          {/* api */}
          <Menu.Item key="all">All</Menu.Item>
          <Menu.Item key="lifestyle">Lifestyle</Menu.Item>
          <Menu.Item key="jordan">Jordan</Menu.Item>
          <Menu.Item key="running">Running</Menu.Item>
          <Menu.Item key="basketball">Basketball</Menu.Item>
          <Menu.Item key="football">Football</Menu.Item>
          <Menu.Item key="training">Training & Gym</Menu.Item>
          <Menu.Item key="skateboarding">Skateboarding</Menu.Item>
          <Menu.Item key="golf">Golf</Menu.Item>
          <Menu.Item key="tennis">Tennis</Menu.Item>
          <Menu.Item key="athletics">Athletics</Menu.Item>
          <Menu.Item key="walking">Walking</Menu.Item>
        </SubMenu>

        <SubMenu key="sub2" icon={<DollarOutlined />} title="Price">
          <div style={{ padding: "0 16px" }}>
            <Slider
              range
              defaultValue={[0, 2500000]}
              min={0}
              max={5000000}
              step={10}
              value={[props.objectQuery.MinPrice, props.objectQuery.MaxPrice]}
              onChange={(value) =>
                props.setObjectQuery({
                  ...props.objectQuery,
                  MinPrice: value[0], // Cập nhật MinPrice
                  MaxPrice: value[1], // Cập nhật MaxPrice
                })
              }
            />
          </div>
        </SubMenu>
        <SubMenu key="sub3" icon={<ManOutlined />} title="Gender">
          <div style={{ padding: "0 16px" }}>
            <Select defaultValue="men" style={{ width: 120 }}
            value={props.objectQuery.ProductObjectId}
            onChange={(value) => props.setObjectQuery({
              ...props.objectQuery,
              ProductObjectId: parseInt(value)
            })}
            >
              <Option value="1">Men</Option>
              <Option value="2">Women</Option>
            </Select>
          </div>
        </SubMenu>

        <Menu.Item key="sortBy" icon={<SortAscendingOutlined />}>
          Sort By
        </Menu.Item>
        <Menu.Item key="hideFilters" icon={<FilterOutlined />}>
          Hide Filters
        </Menu.Item>
      </Menu>
    </Sider>
  );
};

export default FilterSidebar;
