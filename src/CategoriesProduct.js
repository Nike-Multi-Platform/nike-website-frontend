import React, { useState, useEffect } from "react";
import { Layout, Menu, Card, Row, Col, Pagination } from "antd";
import { ShopOutlined, FilterOutlined, SortAscendingOutlined } from "@ant-design/icons";
import "./CategoriesProduct.css";

const productData = require("./products.json");

const { Meta } = Card;
const { Sider, Content } = Layout;
const { SubMenu } = Menu;

function CategoriesProduct() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(6); 
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    setProducts(productData);
  }, []);

  // Lọc sản phẩm dựa trên danh mục
  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  // Tính toán sản phẩm hiển thị dựa trên trang hiện tại
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  // Hàm xử lý thay đổi trang
  const onChange = (page) => {
    setCurrentPage(page);
  };

  // Hàm xử lý thay đổi danh mục
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider width={250} className="site-layout-background">
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          style={{ height: "100%", borderRight: 0 }}
        >
          <SubMenu key="sub1" icon={<ShopOutlined />} title="Shoes">
            <Menu.Item key="all" onClick={() => handleCategoryChange("All")}>All</Menu.Item>
            <Menu.Item key="lifestyle" onClick={() => handleCategoryChange("Lifestyle")}>Lifestyle</Menu.Item>
            <Menu.Item key="jordan" onClick={() => handleCategoryChange("Jordan")}>Jordan</Menu.Item>
            <Menu.Item key="running" onClick={() => handleCategoryChange("Running")}>Running</Menu.Item>
            <Menu.Item key="basketball" onClick={() => handleCategoryChange("Basketball")}>Basketball</Menu.Item>
            <Menu.Item key="football" onClick={() => handleCategoryChange("Football")}>Football</Menu.Item>
            <Menu.Item key="training" onClick={() => handleCategoryChange("Training")}>Training & Gym</Menu.Item>
            <Menu.Item key="skateboarding" onClick={() => handleCategoryChange("Skateboarding")}>Skateboarding</Menu.Item>
            <Menu.Item key="golf" onClick={() => handleCategoryChange("Golf")}>Golf</Menu.Item>
            <Menu.Item key="tennis" onClick={() => handleCategoryChange("Tennis")}>Tennis</Menu.Item>
            <Menu.Item key="athletics" onClick={() => handleCategoryChange("Athletics")}>Athletics</Menu.Item>
            <Menu.Item key="walking" onClick={() => handleCategoryChange("Walking")}>Walking</Menu.Item>
          </SubMenu>
          <Menu.Item key="hideFilters" icon={<FilterOutlined />}>Hide Filters</Menu.Item>
          <Menu.Item key="sortBy" icon={<SortAscendingOutlined />}>Sort By</Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ padding: "0 24px 24px" }}>
        <Content style={{ padding: 24, margin: 0, minHeight: 280 }}>
          <h1 className="text-center" style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Product Categories</h1>
          <Row gutter={[16, 16]}>
            {currentProducts.map((product) => (
              <Col key={product.id} xs={24} sm={12} md={8}>
                <Card
                  hoverable
                  cover={<img alt={product.name} src={product.image} style={{ height: 250, objectFit: "cover" }} />}
                >
                  <Meta title={product.name} description={`$${product.price}`} />
                  <p className="mt-2">{product.description}</p>
                </Card>
              </Col>
            ))}
          </Row>

          {/* Phân trang */}
          <div className="pagination-container">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredProducts.length}
              onChange={onChange}
              style={{ marginTop: 24 }}
            />
          </div>
        </Content>
      </Layout>
    </Layout>
  );
}

export default CategoriesProduct;
