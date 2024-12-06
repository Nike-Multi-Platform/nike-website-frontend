import React, { useEffect, useReducer } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { getSubCategories } from '../../services/productServices';
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";

const ListSubCategory = (props) => {

    const location = useLocation();
    const navigate = useNavigate();
    const [localState, setLocalState] = useReducer(
        (state, action) => {
            return { ...state, [action.type]: action.payload };
        }, {
        categoryName: "",
        subCategories: [],
        isCollapsed: false,
    });


    const fetchSubCategories = async (category_id) => {
        try {
            const response = await getSubCategories(category_id);
            console.log(response);
            if (response?.statusCode == 200) {
                setLocalState({ type: "categoryName", payload: response.data?.categoryName });
                setLocalState({ type: "subCategories", payload: response.data?.subCategories });
            }
        } catch (error) {
            console.log("Failed to fetch sub categories: ", error);
        }
    };

    const handleSubCatClick = (subCategoryId) => {
        console.log(subCategoryId);
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('sub_categories_id', subCategoryId);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    }

    useEffect(() => {
        const fetchData = async () => {
            const queryParams = new URLSearchParams(location.search);
            const category_id = queryParams.get('category_id');
            if (category_id) {
                await fetchSubCategories(category_id);
            }
        };
        fetchData();
    }, [location.search]);

    return (
        <div className='ml-8'>
            <div
                onClick={() => setLocalState({ type: 'isCollapsed', payload: !localState.isCollapsed })}
                className='flex justify-between items-center'
            >
                <div className='max-w-[85%]'>
                    <h3 className='text-3xl font-nikeBody line-clamp-3 break-words'>{localState.categoryName}</h3>
                </div>
                {
                    localState.isCollapsed ? <MdOutlineKeyboardArrowDown size={25} /> : <MdOutlineKeyboardArrowUp size={25} />
                }
            </div>
            {localState.isCollapsed ? null : (
                localState.subCategories.map((subCategory, index) => {
                    return (
                        <div
                            key={index} className='cursor-pointer my-2 font-nikeBody'
                            onClick={() => handleSubCatClick(subCategory.subCategoryId)}
                        >
                            <h3>{subCategory.subCategoryName}</h3>
                        </div>
                    )
                })
            )
            }
        </div>
    )
}

export default ListSubCategory