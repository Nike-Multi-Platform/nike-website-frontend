import React, { useEffect, useReducer } from "react";
import FilterSidebar from "../../components/search-filter/FilterSidebar";
import { useLocation } from "react-router-dom";
import { searchFilter } from "../../services/productServices";
import ProductCard from "../../components/products/ProductCard";
import { Dropdown, Menu, Spin, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { LuSettings2 } from "react-icons/lu";

const CategoriesProduct = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      product_parents: [],
      query: {},
      loading: false,
      sidebar_visible: true,
      sortByLabel: "Sort By",
    }
  );

  const location = useLocation();

  const handleGetAllParamsQuery = () => {
    const queryParams = new URLSearchParams(location.search);
    const query = {};
    queryParams.forEach((value, key) => {
      // Nếu key đã tồn tại, chuyển giá trị thành mảng hoặc thêm vào mảng
      if (query[key]) {
        query[key] = Array.isArray(query[key])
          ? [...query[key], value]
          : [query[key], value];
      } else {
        query[key] = value;
      }
    });
    setLocalState({ type: "query", payload: query });

    // handle sidebar visibility
    if (!query.searchText) {
      setLocalState({ type: "sidebar_visible", payload: true });
    } else {
      setLocalState({ type: "sidebar_visible", payload: false });
    }
  };

  const handleGetProductParents = async (queryObject) => {
    if (localState.loading) return;
    try {
      setLocalState({ type: "loading", payload: true });
      const response = await searchFilter(queryObject);
      if (response?.statusCode === 200) {
        setLocalState({ type: "product_parents", payload: response.data });
        console.log("Product parents:", response.data);
      } else {
        console.log("Failed to fetch products:", response);
        setLocalState({ type: "product_parents", payload: [] });
      }
    } catch (error) {
      console.log("Error fetching product parents:", error);
      setLocalState({ type: "product_parents", payload: [] });
    } finally {
      setLocalState({ type: "loading", payload: false });
    }
  };

  const menu = (
    <Menu
      onClick={(e) => handleSortChange(e.key, e.domEvent.target.innerText)}
      items={[
        { label: "Newest", key: "createAt" },
        { label: "Price: Low to High", key: "price:true" },
        { label: "Price: High to Low", key: "price:false" },
        { label: "Featured", key: "sold" },
      ]}
    />
  );
  const handleSortChange = (sortKey, sortLabel) => {
    let [sortBy, isSortAscending] = sortKey.split(":");
    const SortBy =
      sortBy === "price"
        ? "price"
        : sortBy === "createAt"
        ? "createAt"
        : "sold";
    const IsSortAscending = isSortAscending === "true" ? true : false;
    const query = { ...localState.query, SortBy, IsSortAscending };
    setLocalState({ type: "query", payload: query });
    setLocalState({ type: "sortByLabel", payload: sortLabel });
  };

  useEffect(() => {
    if (Object.keys(localState.query).length > 0) {
      console.log("Query params:", localState.query);
      handleGetProductParents(localState.query);
    }
  }, [localState.query]);

  useEffect(() => {
    handleGetAllParamsQuery();
  }, [location.search]);
  return (
    <div className="max-w-[1600px] mx-auto my-20 flex gap-2 items-center">
      <div className="grid grid-cols-12">
        {/* Sidebar Filter */}
        <div className="col-span-2 p-4 border-r border-gray-200 h-screen">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <div className="col-span-10 p-4">
          <div className="flex justify-end mb-4">
            <Dropdown overlay={menu} trigger={["click"]}>
              <Button className="text-lg font-nikeBody">
                {localState.sortByLabel} <DownOutlined />
              </Button>
            </Dropdown>
          </div>
          <div className="grid grid-cols-12 gap-4">
            {localState.loading ? (
              <Spin size="large" className="col-span-12 mx-auto my-20" />
            ) : localState.product_parents.length > 0 ? (
              localState.product_parents.map((product, key) => (
                <ProductCard product={product} key={key} />
              ))
            ) : (
              <div className="col-span-12 mx-auto my-auto">
                <p className="text-4xl font-nike">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesProduct;
