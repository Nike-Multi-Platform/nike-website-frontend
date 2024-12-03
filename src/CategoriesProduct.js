import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout, Row, Pagination, Button } from "antd";
import { FilterOutlined } from "@ant-design/icons";
import "./CategoriesProduct.css";
import ProductCard from './components/products/ProductCard';
import productServices from './services/productServices';
import FilterSidebar from './components/categories/FilterSidebar';

const { Content } = Layout;

const CategoriesProduct = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);

  const [productParents, setProductParents] = useState([]);
  const [objectQuery, setObjectQuery] = useState({
    SubCategoryId: 1,
    ProductName: "-1",
    ProductObjectId: -1,
    MinPrice: 0,
    MaxPrice: 10000000,
    SortBy: "price",
    IsSortAscending: true,
    Page: 1,
    PageSize: 10,
  });

  useEffect(() => {
    const subCategoryId = parseInt(searchParams.get("sub_categories_id") || "1", 10);
  
    const updatedQuery = {
      ProductName: searchParams.get("searchText") || "-1",
      ProductObjectId: parseInt(searchParams.get("productObjectId") || "-1", 10),
      MinPrice: parseInt(searchParams.get("minPrice") || "0", 10),
      MaxPrice: parseInt(searchParams.get("maxPrice") || "10000000", 10),
      IsSortAscending: searchParams.get("IsSortAscending") === "true",
      Page: parseInt(searchParams.get("page") || "1", 10),
      PageSize: 10, 
    };
  
    setObjectQuery((prev) => ({ ...prev, SubCategoryId: subCategoryId, ...updatedQuery }));
  
    const params = new URLSearchParams();
    params.set("sub_categories_id", subCategoryId.toString());
    params.set("searchText", updatedQuery.ProductName);
    params.set("productObjectId", updatedQuery.ProductObjectId.toString());
    params.set("minPrice", updatedQuery.MinPrice.toString());
    params.set("maxPrice", updatedQuery.MaxPrice.toString());
    params.set("IsSortAscending", updatedQuery.IsSortAscending.toString());
    params.set("page", updatedQuery.Page.toString());
  
    navigate(`?${params.toString()}`, { replace: true });
  }, [searchParams, navigate]);
  


  const onChange = (page) => {
    setObjectQuery((prev) => ({ ...prev, Page: page }));
  };

  const handleSubCategoryChange = (subCategoryId) => {
    navigate(`/categories?sub_categories_id=${subCategoryId}`);
    setObjectQuery((prev) => ({ ...prev, SubCategoryId: subCategoryId, Page: 1 }));
  };

  useEffect(() => {
    const fetchProductParents = async () => {
      try {
        const response = await productServices.getProductParents(objectQuery.SubCategoryId, objectQuery);
        setProductParents(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchProductParents();
  }, [objectQuery]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {isSidebarVisible && (
        <FilterSidebar objectQuery={objectQuery} setObjectQuery={setObjectQuery} />
      )}

      <Layout style={{ padding: "0 24px 24px" }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <div className="header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h1 
              className="text-center" 
              style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}
            >
              Product Categories
            </h1>
            <Button 
              type="primary" 
              icon={<FilterOutlined />} 
              onClick={() => setIsSidebarVisible(!isSidebarVisible)}
              style={{ marginLeft: "auto" }}
            >
              {isSidebarVisible ? "Hide Filters" : "Show Filters"}
            </Button>
          </div>
          
          <Row gutter={[20, 20]} className='grid grid-cols-12 gap-4'>
            {productParents.map((product, index) => (
              <ProductCard 
                product={product} 
                key={index} 
              />
            ))}
          </Row>

          {/* Phân trang */}
          <div className="pagination-container">
            <Pagination
              current={objectQuery.Page}
              pageSize={objectQuery.PageSize}
              total={productParents?.length}
              onChange={onChange}
              style={{ marginTop: 24 }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CategoriesProduct;
