import axios from "axios";

const url = `${process.env.REACT_APP_BACKEND_URL}/api/`;

export default class productServices {
  static async getProductParents(subCategoryId, queryObject) {
    const BASE_URL = url + "Product";
    try {
      const productObjectIds = Array.isArray(queryObject.ProductObjectId)
        ? queryObject.ProductObjectId.join(",")
        : queryObject.ProductObjectId;

      let url = `${BASE_URL}/product-parents?` +
        `SubCategoryId=${subCategoryId}&` +
        `ProductName=${queryObject.ProductName}&` +
        `ProductObjectId=${productObjectIds}&` +
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
    const BASE_URL2 = url + "";
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

export const searchFilter = async (queryObject) => {
  const URL = url + "Product/search-filter";
  try {
    const response = await axios.get(URL, {
      params: queryObject,
    });
    return response.data;
  } catch (error) {
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMessage = error.response.data.message;
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
  }
}

export const getSubCategories = async (categoryId) => {
  const URL = `${url}Category/${categoryId}`;
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMessage = error.response.data.message;
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
}

export const getProductObjects = async () => {
  const URL = `${url}Product/product-objects`;
  try {
    const response = await axios.get(URL);
    return response.data;
  } catch (error) {
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
    return {
      success: false,
      message: errorMessage,
      status: error.response?.status || 0,
    };
  }
}

export const getCategoriesByCatAndObject = async (categoryId, productObjectId) => {
  const URL = url + "Category/subcategories-category-object";
  try {
    const response = await axios.get(URL, {
      params: { categoryId: categoryId, productObjectId: productObjectId }
    });
    return response.data;
  } catch (error) {
    let errorMessage;
    if (error.response) {
      switch (error.response.status) {
        case 404:
          errorMessage = error.response.data.message;
          break;
        case 500:
          errorMessage = "Server error.";
          break;
        default:
          errorMessage =
            error.response.data.message || "An unexpected error occurred.";
      }
    } else {
      errorMessage = "Network error or server is unreachable.";
    }
  }
}