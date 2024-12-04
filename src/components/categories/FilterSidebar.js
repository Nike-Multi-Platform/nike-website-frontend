import React, { useState, useEffect } from "react";
import { Layout, Menu, Slider, Checkbox } from "antd";
import { ShopOutlined, DollarOutlined, ManOutlined } from "@ant-design/icons";
import productServices from "../../services/productServices";
import { useSearchParams, useNavigate } from "react-router-dom";

const { Sider } = Layout;
const { SubMenu } = Menu;

const FilterSidebar = (props) => {
  const [subCategories, setSubCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryId, setCategoryId] = useState(2);
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
    if (Array.isArray(query.ProductObjectId)) {
      params.set("productObjectId", query.ProductObjectId.join(","));
    } else {
      params.set("productObjectId", query.ProductObjectId.toString());
    }
    params.set("minPrice", query.MinPrice.toString());
    params.set("maxPrice", query.MaxPrice.toString());
    params.set("IsSortAscending", query.IsSortAscending.toString());
    params.set("page", query.Page.toString());
    navigate(`?${params.toString()}`, { replace: true });
  };

  const [genders, setGenders] = useState([]); // Mỗi lúc chọn checkBox sẽ lấy id bỏ vào mảng genders nếu genders.length=2

  useEffect(() => {
    console.log(genders);

    const newQuery = { ...props.objectQuery };
    if (genders.length === 0) {
      newQuery.ProductObjectId = -1; // Lấy hết
    } else {
      newQuery.ProductObjectId = genders; // Chọn các giới tính
    }
    props.setObjectQuery(newQuery);
    updateUrlParams(newQuery);
  }, [genders]);

  return (
    <Sider width={250} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <SubMenu key="sub1" icon={<ShopOutlined />} title={categoryName}>
          {Array.isArray(subCategories) &&
            subCategories.map((subCategory) => (
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
            <div>
              <Checkbox
                checked={genders.includes(1)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setGenders([...genders, 1]);
                  } else {
                    setGenders(genders.filter((number) => number !== 1));
                  }
                }}
              >
                Men
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={genders.includes(2)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setGenders([...genders, 2]);
                  } else {
                    setGenders(genders.filter((number) => number !== 2));
                  }
                }}
              >
                Women
              </Checkbox>
            </div>
          </div>
        </SubMenu>
      </Menu>
    </Sider>
  );
};

export default FilterSidebar;
