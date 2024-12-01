import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';

import { Layout, Menu, Card, Row, Col, Pagination } from "antd";
import { ShopOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import "./CategoriesProduct.css";
import ProductCard from './components/products/ProductCard';
import productServices from './services/productServices';
import FilterSidebar from './components/categories/FilterSidebar';



const { Meta } = Card;
const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const CategoriesProduct = () => {
  const { subCategoryId } = useParams();

  const [productParents, setProductParents] = useState([]);
  const [objectQuery, setObjectQuery] = useState({
    ProductName: "-1",
    ProductObjectId: -1,
    MinPrice: 0,
    MaxPrice: 10000000,
    SortBy: "price",
    IsSortAscending: true,
    Page: 1,
    PageSize: 10
  });

  const onChange = (page) => {
    setObjectQuery({...objectQuery,Page:page});
  };

  useEffect(() => {
    const fetchProductParents = async () => {
      try {
        const response = await productServices.getProductParents(subCategoryId, objectQuery);
        console.log(response.data);
        setProductParents(response.data)
      } catch (error) {
        console.error(error);
        
      }
    }
    fetchProductParents();
  }, [objectQuery]);
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <FilterSidebar objectQuery={objectQuery} setObjectQuery={setObjectQuery} />

      <Layout style={{ padding: "0 24px 24px" }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <h1 className="text-center" style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Product Categories</h1>
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
}

export default CategoriesProduct
