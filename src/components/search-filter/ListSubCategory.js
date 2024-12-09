import React, { useEffect, useReducer, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getCategoriesByCatAndObject,
  getSubCategories,
} from "../../services/productServices";
import {
  MdOutlineKeyboardArrowUp,
  MdOutlineKeyboardArrowDown,
} from "react-icons/md";

const ListSubCategory = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      Categories: [],
      isCollapsed: false,
    }
  );
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const fetchSubCategories = async (category_id, productObjectId) => {
    try {
      const response = await getCategoriesByCatAndObject(
        category_id,
        productObjectId
      );
      console.log(response);
      if (response?.statusCode === 200) {
        setLocalState({ type: "Categories", payload: response.data });
      } else {
        console.log("Failed to fetch sub categories: ", response);
        setLocalState({ type: "Categories", payload: [] });
      }
    } catch (error) {
      console.log("Failed to fetch sub categories: ", error);
      setLocalState({ type: "Categories", payload: [] });
    }
  };

  const handleSubCategoryClick = async (subCategoryId) => {
    const queryParams = new URLSearchParams(location.search);
    queryParams.set("sub_categories_id", subCategoryId);
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };
  const toggleCollapse = (categoryId) => {
    setCollapsedCategories((prevState) => ({
      ...prevState,
      [categoryId]: !prevState[categoryId],
    }));
  };
  useEffect(() => {
    const fetchData = async () => {
      const queryParams = new URLSearchParams(location.search);
      const category_id = queryParams.get("category_id");
      const productObjectId = queryParams.get("productObjectId");
      if (category_id || productObjectId) {
        await fetchSubCategories(category_id, productObjectId);
      } else {
        setLocalState({ type: "Categories", payload: [] });
      }
    };
    fetchData();
  }, [location.search]);

  return (
    <div className="ml-8 mb-4">
      {localState.Categories.length > 0 && (
        <>
          <div>
            {localState.Categories.map((category, index) => (
              <div key={index}>
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-semibold text-gray-800">
                    {category.categoryName}
                  </h3>
                  <button onClick={() => toggleCollapse(category.categoryId)}>
                    {collapsedCategories[category.categoryId] ? (
                      <MdOutlineKeyboardArrowUp size={24} />
                    ) : (
                      <MdOutlineKeyboardArrowDown size={24} />
                    )}
                  </button>
                </div>
                {!collapsedCategories[category.categoryId] && (
                  <ul>
                    {category.subCategories.map((subCategory, subIndex) => (
                      <li
                        key={subIndex}
                        className="text-lg text-gray-600 cursor-pointer"
                        onClick={() =>
                          handleSubCategoryClick(subCategory.subCategoryId)
                        }
                      >
                        {subCategory.subCategoryName}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ListSubCategory;
