import React, { useState, useEffect } from "react";
import { Layout, Menu, Slider, Select } from "antd";
import {
  ShopOutlined,
  FilterOutlined,
  SortAscendingOutlined,
  DollarOutlined,
  ManOutlined,
} from "@ant-design/icons";

import productServices from '../../services/productServices';
import { useSearchParams, useNavigate } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;
const { Option } = Select;

const FilterSidebar = (props) => {
  const [subCategories, setSubCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState(null);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const subCategoryIdFromURL = searchParams.get("category_id");
    if (subCategoryIdFromURL) {
      setCategoryId(parseInt(subCategoryIdFromURL));
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        const response = await productServices.getSubCategoriesByCategoryId(categoryId);
        if (response.statusCode === 200 && response.data) {
          setSubCategories(response.data.subCategories);
          setCategoryName(response.data.categoryName);
        } else {
          console.error("Invalid subcategories data format:", response);
        }
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  const updateUrlParams = (query) => {
    const params = new URLSearchParams();
    params.set("sub_categories_id", query.SubCategoryId.toString());
    params.set("searchText", query.ProductName);
    params.set("productObjectId", query.ProductObjectId.toString());
    params.set("minPrice", query.MinPrice.toString());
    params.set("maxPrice", query.MaxPrice.toString());
    params.set("IsSortAscending", query.IsSortAscending.toString());
    params.set("page", query.Page.toString());
    navigate(`?${params.toString()}`, { replace: true });
  };

  return (
    <Sider width={250} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <SubMenu key="sub1" icon={<ShopOutlined />} title={categoryName}>
          {Array.isArray(subCategories) && subCategories.map((subCategory) => (
            <Menu.Item
              key={subCategory.subCategoryId}
              onClick={() => {
                const newQuery = {
                  ...props.objectQuery,
                  SubCategoryId: subCategory.subCategoryId,
                  Page: 1,
                };
                props.setObjectQuery(newQuery);
                updateUrlParams(newQuery);
              }}
            >
              {subCategory.subCategoryName}
            </Menu.Item>
          ))}
        </SubMenu>

        <SubMenu key="sub2" icon={<DollarOutlined />} title="Price">
          <div style={{ padding: "0 16px" }}>
            <Slider
              range
              defaultValue={[0, 2500000]}
              min={0}
              max={9000000}
              step={500000}
              value={[props.objectQuery.MinPrice, props.objectQuery.MaxPrice]}
              onChange={(value) => {
                const newQuery = {
                  ...props.objectQuery,
                  MinPrice: value[0],
                  MaxPrice: value[1],
                };
                props.setObjectQuery(newQuery);
                updateUrlParams(newQuery);
              }}
            />
          </div>
        </SubMenu>
        <SubMenu key="sub3" icon={<ManOutlined />} title="Gender">
          <div style={{ padding: "0 16px" }}>
            <Select
              defaultValue="1"
              style={{ width: 120 }}
              value={props.objectQuery.ProductObjectId}
              onChange={(value) => {
                const newQuery = {
                  ...props.objectQuery,
                  ProductObjectId: parseInt(value),
                };
                props.setObjectQuery(newQuery);
                updateUrlParams(newQuery);
              }}
            >
              <Option value="1">Men</Option>
              <Option value="2">Women</Option>
            </Select>
          </div>
        </SubMenu>

        <SubMenu key="sub4" icon={<SortAscendingOutlined />} title="Sort By">
           {/* Sắp xếp theo Tên */}
           <Menu.Item
            key="sortByName"
            onClick={() =>
              props.setObjectQuery({
                ...props.objectQuery,
                SortBy: "productName",
                IsSortAscending: !props.objectQuery.IsSortAscending, 
              })
            }
          >
            By Name {props.objectQuery.SortBy === "productName" && (props.objectQuery.IsSortAscending ? "(Tăng dần)" : "(Giảm dần)")}
          </Menu.Item>

          <Menu.Item
            key="sortByPrice"
            onClick={() => {
              const newQuery = {
                ...props.objectQuery,
                SortBy: "price",
                IsSortAscending: !props.objectQuery.IsSortAscending,
              };
              props.setObjectQuery(newQuery);
              updateUrlParams(newQuery);
            }}
          >
            By Price {props.objectQuery.SortBy === "price" && (props.objectQuery.IsSortAscending ? "(Tăng dần)" : "(Giảm dần)")}
          </Menu.Item>

          {/* Sắp xếp theo Ngày tạo */}
          <Menu.Item
            key="sortByCreatedAt"
            onClick={() =>
              props.setObjectQuery({
                ...props.objectQuery,
                SortBy: "createAt",
                IsSortAscending: !props.objectQuery.IsSortAscending,
              })
            }
          >
            By DayCreate {props.objectQuery.SortBy === "createAt" && (props.objectQuery.IsSortAscending ? "(Tăng dần)" : "(Giảm dần)")}
          </Menu.Item>
        </SubMenu>

      </Menu>
    </Sider>
  );
};

export default FilterSidebar;
