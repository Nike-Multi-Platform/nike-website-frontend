import { Menu } from "antd";
import React, { memo, useEffect, useReducer, useState } from "react";
import { BiCloset } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { getCategories } from "../../services/catServices";

import { useNavigate } from "react-router-dom";

const DrawerMenuContent = (props) => {
  const { open, onClose } = props;
  const [localState, setLocalState] = useReducer(
    (state, action) => ({ ...state, [action.type]: action.payload }),
    { categories: [] }
  );
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        setLocalState({
          type: "categories",
          payload: res.data,
        });
      } catch (error) {
        console.error(error);
      }
    };
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const handleSubCategoryClick = (subCategoryId, categoryId) => {
    navigate(
      `/categories?sub_categories_id=${subCategoryId}&category_id=${categoryId}`
    );
    onClose();
  };

  return (
    <div className="w-full max-w-full flex flex-col gap-3">
      <span className="text-[50px] cursor-pointer" onClick={onClose}>
        <CgClose />
      </span>
      <Menu mode="inline" className="text-lg font-semibold text-neutral-500">
        {localState.categories.map((category) => (
          <Menu.SubMenu
            key={`object_${category.productId}`}
            title={<span className="uppercase">{category.productName}</span>}
          >
            {category.categories.map((subCategory) => (
              <Menu.SubMenu
                key={`category_${subCategory.categoryId}`}
                title={subCategory.categoryName}
              >
                {subCategory.subCategories.map((subSubCategory) => (
                  <Menu.Item
                    key={`subCat_${subSubCategory.subCategoryId}`}
                    onClick={() =>
                      handleSubCategoryClick(
                        subSubCategory.subCategoryId,
                        subCategory.categoryId
                      )
                    }
                  >
                    {subSubCategory.subCategoryName}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ))}
          </Menu.SubMenu>
        ))}
        <Menu.Item key="4">ABOUT US</Menu.Item>
        <Menu.Item key="5">POLICY</Menu.Item>
      </Menu>
    </div>
  );
};

export default memo(DrawerMenuContent);

