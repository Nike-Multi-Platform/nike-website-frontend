import { Menu } from "antd";
import React, { memo, useEffect, useReducer, useState } from "react";
import { BiCloset } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import { getCategories } from "../../services/catServices";

const DrawerMenuContent = (props) => {
  const { open, onClose } = props;
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      categories: [],
    }
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategories();
        console.log(res);
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
  return (
    <div className="w-full max-w-full flex flex-col gap-3">
      <span className="text-[50px] cursor-pointer" onClick={onClose}>
        <CgClose />
      </span>
      <div className="">
        <Menu mode="inline" className="text-lg font-semibold text-neutral-500">
          {localState.categories.map((category) => (
            <Menu.SubMenu
              key={"object_" + category.productId}
              title={<span className="uppercase">{category.productName}</span>}
              className="text-lg font-semibold text-neutral-500 "
            >
              {category.categories.map((subCategory) => (
                <Menu.SubMenu
                  key={"category_" + subCategory.categoryId}
                  title={subCategory.categoryName}
                  className="text-base text-neutral-500"
                >
                  {subCategory.subCategories.map((subSubCategory) => (
                    <Menu.Item
                      key={"subCat_" + subSubCategory.subCategoryId}
                      className="text-sm"
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
    </div>
  );
};

export default memo(DrawerMenuContent);
