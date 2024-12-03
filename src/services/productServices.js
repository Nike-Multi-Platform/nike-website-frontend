import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/`;

export default class productServices {
  

  static async getProductParents(subCategoryId, queryObject) {
    const BASE_URL = url + "Product";
    try {
      let url = `${BASE_URL}/product-parents?` +
        `SubCategoryId=${subCategoryId}&` +
        `ProductName=${queryObject.ProductName}&` +
        `ProductObjectId=${queryObject.ProductObjectId}&` +
        `MinPrice=${queryObject.MinPrice}&` +
        `MaxPrice=${queryObject.MaxPrice}&` +
        `SortBy=${queryObject.SortBy}&` +
        `IsSortAscending=${queryObject.IsSortAscending}&` +
        `Page=${queryObject.Page}&` +
        `PageSize=${queryObject.PageSize}`;
      console.log(url);
  
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

    static async getSubCategoriesByCategoryId(categoryId) {
      const BASE_URL2 = url+"";
      try {
          const url = `${BASE_URL2}Category/${categoryId}`;
          console.log(url);
          const response = await axios.get(url);
          return response.data;
      } catch (error) {
          throw error;
      }
  }


}