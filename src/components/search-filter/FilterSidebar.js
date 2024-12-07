import React, { useReducer } from "react";
import ListSubCategory from "../search-filter/ListSubCategory";
import ColorShownItem from "../search-filter/ColorShownItem";
import PriceRange from "./PriceRange";
import ObjectFilter from "./ObjectFilter";
const FilterSidebar = () => {

  return (
    <div>
      <ListSubCategory />
      <ColorShownItem />
      <div className="h-[1px] bg-gray-300 w-[80%] my-3 mx-auto"></div>
      <ObjectFilter />
      <div className="h-[1px] bg-gray-300 w-[80%] my-3 mx-auto"></div>
      <PriceRange />      
    </div>
  );
};

export default FilterSidebar;
