import React, { useState, useEffect } from "react";
import { Layout, Menu, Checkbox } from "antd";
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

    if (query.ProductObjectId && query.ProductObjectId !== "-1") {
      params.set("productObjectId", query.ProductObjectId);
    } else {
      params.delete("productObjectId");
    }

    if (query.MinPrice != null && query.MaxPrice != null) {
      params.set("minPrice", query.MinPrice.toString());
      params.set("maxPrice", query.MaxPrice.toString());
    }

    params.set("IsSortAscending", query.IsSortAscending.toString());
    params.set("page", query.Page.toString());
    navigate(`?${params.toString()}`, { replace: true });
  };

  const [genders, setGenders] = useState([]);

  useEffect(() => {
    const newQuery = { ...props.objectQuery };
    if (genders.length === 0) {
      newQuery.ProductObjectId = "-1"; // Set to -1 when no gender is selected
    } else {
      newQuery.ProductObjectId = genders.join(",");
    }
    props.setObjectQuery(newQuery);
    updateUrlParams(newQuery);
  }, [genders]);

  const [selectedPrice, setSelectedPrice] = useState(null);

  useEffect(() => {
    const newQuery = { ...props.objectQuery };
    if (selectedPrice) {
      newQuery.MinPrice = selectedPrice.min;
      newQuery.MaxPrice = selectedPrice.max;
    } else {
      newQuery.MinPrice = null;
      newQuery.MaxPrice = null;
    }
    props.setObjectQuery(newQuery);
    updateUrlParams(newQuery);
  }, [selectedPrice]);

  const priceRanges = [
    { label: "Under 1,000,000 đ", min: 0, max: 1000000 },
    { label: "1,000,000 đ - 2,500,000 đ", min: 1000000, max: 2500000 },
    { label: "2,500,000 đ - 5,000,000 đ", min: 2500000, max: 5000000 },
    { label: "5,000,000 đ - 10,000,000 đ", min: 5000000, max: 9999999 },
    { label: "Over 10,000,000 đ", min: 10000000, max: Number.MAX_SAFE_INTEGER },
  ];

  const handleGenderChange = (genderId) => {
    setGenders((prevGenders) => {
      if (prevGenders.includes(genderId)) {
        return prevGenders.filter((id) => id !== genderId);
      } else {
        return [...prevGenders, genderId];
      }
    });
  };

  return (
    <Sider width={250} className="site-layout-background">
      <Menu mode="inline" defaultSelectedKeys={["1"]} style={{ height: "100%", borderRight: 0 }}>
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
            {priceRanges.map((range) => (
              <div key={range.label}>
                <Checkbox
                  checked={selectedPrice && selectedPrice.min === range.min && selectedPrice.max === range.max}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedPrice(range);
                    } else {
                      setSelectedPrice(null);
                    }
                  }}
                >
                  {range.label}
                </Checkbox>
              </div>
            ))}
          </div>
        </SubMenu>

        <SubMenu key="sub3" icon={<ManOutlined />} title="Gender">
          <div style={{ padding: "0 16px" }}>
            <div>
              <Checkbox
                checked={genders.includes(1)}
                onChange={() => handleGenderChange(1)}
              >
                Men
              </Checkbox>
            </div>
            <div>
              <Checkbox
                checked={genders.includes(2)}
                onChange={() => handleGenderChange(2)}
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
