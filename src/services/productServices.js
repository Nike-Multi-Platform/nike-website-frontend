import axios from "axios";

const URL = `${process.env.REACT_APP_BACKEND_URL}/api/`;

export default class productServices {
   BASE_URL = URL+"Product";


  static async getProductParents (subCategoryId,queryObject) {
    try {
        let url = `${this.BASE_URL}/product-parents/${subCategoryId}?` +
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

}