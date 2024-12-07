import React, { useEffect, useReducer } from 'react';
import { getProductObjects } from '../../services/productServices';
import { Checkbox } from 'antd';
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';

const ObjectFilter = () => {
    const [localState, setLocalState] = useReducer(
        (state, action) => {
            return { ...state, [action.type]: action.payload };
        },
        {
            objects: [],
            selected_objects: [],
            isCollapsed: false,
        }
    );
    const location = useLocation();
    const navigate = useNavigate();

    const fetchObjects = async () => {
        try {
            const response = await getProductObjects();
            if (response?.statusCode === 200) {
                setLocalState({ type: 'objects', payload: response.data });
                console.log(response.data);
            }
        } catch (error) {
            console.log('Failed to fetch objects: ', error);
        }
    };

    useEffect(() => {
        fetchObjects();
    }, []);

    const handleCheckboxChange = (e, object) => {
        const isChecked = e.target.checked;
        const newSelectedObjects = isChecked
            ? [...localState.selected_objects, object]
            : localState.selected_objects.filter(selectedObject => selectedObject !== object);

        setLocalState({ type: 'selected_objects', payload: newSelectedObjects });

        // Update search query
        const queryParams = new URLSearchParams(location.search);

        // Clear existing 'productObjectId' params
        queryParams.delete('productObjectId');

        // Append the selected productObjectIds
        newSelectedObjects.forEach((selectedObject) => {
            queryParams.append('productObjectId', selectedObject.productId);
        });

        navigate(`${location.pathname}?${queryParams.toString()}`);
    };
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const selectedProductIds = queryParams.getAll('productObjectId');
        const selectedObjects = localState.objects.filter(object =>
            selectedProductIds.includes(String(object.productId))
        );
        setLocalState({ type: 'selected_objects', payload: selectedObjects });
    }, [location.search, localState.objects]);
    return (
        <div className="ml-8">
            <div
                onClick={() => setLocalState({ type: 'isCollapsed', payload: !localState.isCollapsed })}
                className='flex justify-between items-center'
            >
                <h3 className="text-2xl font-nikeBody text-gray-800 mb-3">Gender</h3>
                {
                    localState.isCollapsed ? <MdOutlineKeyboardArrowDown size={25} /> : <MdOutlineKeyboardArrowUp size={25} />
                }
            </div>
            {localState.isCollapsed ? null : (
                <div className="flex flex-col space-y-4">
                    {localState.objects.map((object, index) => (
                        <Checkbox
                            key={index}  
                            onChange={(e) => handleCheckboxChange(e, object)}
                            className="text-lg font-nike"
                            checked={location.search.includes(`productObjectId=${object.productId}`)}
                         >
                            {object.productName}
                        </Checkbox>
                    ))}
                </div>
            )
            }
        </div>
    );
};

export default ObjectFilter;
