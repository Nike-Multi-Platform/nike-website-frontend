import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Layout, Row, Pagination, Button, Dropdown, Menu } from "antd";
import { FilterOutlined } from "@ant-design/icons";
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
    SubCategoryId: -1,
    ProductName: "-1",
    ProductObjectId: "-1",  // Keep it as a string here
    MinPrice: 0,
    MaxPrice: 10000000,
    SortBy: "c",
    IsSortAscending: true,
    Page: 1,
    PageSize: 10,
  });

  useEffect(() => {
    const subCategoryId = parseInt(searchParams.get('sub_categories_id') || '1', 10);
    const productObjectIdString = searchParams.get('productObjectId') || '-1'; // Treat it as a string
    
    const updatedQuery = {
      ProductName: searchParams.get('searchText') || '-1',
      ProductObjectId: productObjectIdString, // Keep it as a string
      MinPrice: parseInt(searchParams.get('minPrice') || '0', 10),
      MaxPrice: parseInt(searchParams.get('maxPrice') || '10000000', 10),
      SortBy: searchParams.get('SortBy') || 'createAt',
      IsSortAscending: searchParams.get('IsSortAscending') === 'true',
      Page: parseInt(searchParams.get('page') || '1', 10),
      PageSize: 10,
    };
  
    setObjectQuery((prev) => ({ ...prev, SubCategoryId: subCategoryId, ...updatedQuery }));
  
    const params = new URLSearchParams();
    if (subCategoryId !== 1) params.set('sub_categories_id', subCategoryId.toString());
    if (updatedQuery.ProductName !== '-1') params.set('searchText', updatedQuery.ProductName);
    if (updatedQuery.ProductObjectId !== '-1') params.set('productObjectId', updatedQuery.ProductObjectId); // Ensure it checks as a string
    if (updatedQuery.MinPrice !== 0) params.set('minPrice', updatedQuery.MinPrice.toString());
    if (updatedQuery.MaxPrice !== 10000000) params.set('maxPrice', updatedQuery.MaxPrice.toString());
    if (updatedQuery.SortBy !== 'createAt' || updatedQuery.IsSortAscending !== true) {
      params.set('SortBy', updatedQuery.SortBy);
      if (updatedQuery.SortBy === 'price') {
        params.set('IsSortAscending', updatedQuery.IsSortAscending.toString());
      }
    }
    if (updatedQuery.Page !== 1) params.set('page', updatedQuery.Page.toString());
  
    navigate(`?${params.toString()}`, { replace: true });
  }, [searchParams, navigate]);

  const sortOptions = [
    { label: "Featured", value: "featured" },
    { label: "Newest", value: "createAt" },
    { label: "Price: High-Low", value: "price_desc" },
    { label: "Price: Low-High", value: "price_asc" },
  ];

  const handleSortChange = (value) => {
    const isSortAscending = value !== "price_desc";
    const sortBy = value.includes("price") ? "price" : "createAt";

    const params = new URLSearchParams(searchParams.toString());
    params.set('SortBy', sortBy);
    if (sortBy === "price") {
        params.set('IsSortAscending', isSortAscending.toString());
    } else {
        params.delete('IsSortAscending');
    }

    setObjectQuery((prev) => ({
        ...prev,
        SortBy: sortBy,
        IsSortAscending: isSortAscending,
        Page: 1,
    }));

    navigate(`?${params.toString()}`, { replace: true });
  };

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
            <Dropdown
            className='ml-2'
              overlay={
                <Menu
                  onClick={({ key }) => handleSortChange(key)}
                >
                  {sortOptions.map((option) => (
                    <Menu.Item
                      key={option.value}
                      style={{
                        fontWeight:
                          (objectQuery.SortBy === "price" && option.value === (objectQuery.IsSortAscending ? "price_asc" : "price_desc")) ||
                          (objectQuery.SortBy === "createAt" && option.value === "createAt")
                            ? "bold"
                            : "normal",
                      }}
                    >
                      {option.label}
                    </Menu.Item>
                  ))}
                </Menu>
              }
            >
              <Button>
                Sort By
              </Button>
            </Dropdown>

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
          <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
            <Pagination
              current={objectQuery.Page}
              pageSize={objectQuery.PageSize}
              total={productParents?.length}
              onChange={onChange}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default CategoriesProduct;
