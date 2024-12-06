import React, { useEffect, useReducer } from 'react';
import FilterSidebar from '../../components/search-filter/FilterSidebar';
import { useLocation } from 'react-router-dom';
import { searchFilter } from '../../services/productServices';
import ProductCard from '../../components/products/ProductCard';

const CategoriesProduct = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      product_parents: [],
      query: {},
      loading: false
    }
  );

  const location = useLocation();

  const handleGetAllParamsQuery = () => {
    const queryParams = new URLSearchParams(location.search);
    const query = {};
    queryParams.forEach((value, key) => {
      query[key] = value;
    });
    setLocalState({ type: 'query', payload: query });
  };

  const handleGetProductParents = async (queryObject) => {
    if (localState.loading) return; // Prevent multiple requests
    try {
      setLocalState({ type: 'loading', payload: true });
      const response = await searchFilter(queryObject);
      if (response?.statusCode === 200) {
        setLocalState({ type: 'product_parents', payload: response.data });
        console.log("Product parents:", response.data);
      } else {
        console.log("Failed to fetch products:", response);
      }
    } catch (error) {
      console.log("Error fetching product parents:", error);
    } finally {
      setLocalState({ type: 'loading', payload: false });
    }
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
    <div className="flex">
      {/* Sidebar Filter */}
      <div className="w-[20%] p-4 border-r border-gray-200 h-screen overflow-y-auto">
        <FilterSidebar />
      </div>
      {/* Main Content */}
      <div className="w-[80%] p-4">
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        <div className="grid grid-cols-12 gap-4">
          {localState.loading ? (
            <p>Loading...</p>
          ) : (
            localState.product_parents.length > 0 ? (
              localState.product_parents.map((product, key) => (
                <ProductCard product={product} key={key} />
              ))
            ) : (
              <p>No products found</p>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoriesProduct;
