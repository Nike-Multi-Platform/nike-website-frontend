import React, { useReducer } from 'react'
import { Button, Input } from "antd";
import { useLocation, useNavigate } from 'react-router-dom';
const PriceRange = () => {
    const [localState, setLocalState] = useReducer(
        (state, action) => {
            return { ...state, [action.type]: action.payload };
        },
        {
            maxPrice: "",
            minPrice: ""
        }
    )
    const location = useLocation();
    const navigate = useNavigate();
    const handleMaxPriceChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) || value === "") {
            setLocalState({ type: "maxPrice", payload: value });
        }
    };

    const handleMinPriceChange = (e) => {
        const value = e.target.value;
        if (!isNaN(value) || value === "") {
            setLocalState({ type: "minPrice", payload: value });
        }
    };

    const handleApply = () => {
        const queryParams = new URLSearchParams(location.search);
        queryParams.set('maxPrice', localState.maxPrice);
        queryParams.set('minPrice', localState.minPrice);
        queryParams.set('SortBy', "price");
        navigate(`${location.pathname}?${queryParams.toString()}`);
    }

    const handleClear = () => {
        setLocalState({ type: "minPrice", payload: "" });
        setLocalState({ type: "maxPrice", payload: "" });
        const queryParams = new URLSearchParams(location.search);
        queryParams.delete('maxPrice');
        queryParams.delete('minPrice');
        queryParams.delete('SortBy');
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };
    return (
        <div className="ml-8">
            <h3 className="text-2xl font-nike mb-4 text-gray-700">Price</h3>
            <div className='flex flex-col items-center'>
                <Input
                    placeholder="Min"
                    value={localState.minPrice}
                    onChange={handleMinPriceChange}
                    className="w-full rounded-md border border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
                <span className="text-gray-500 font-medium">-</span>
                <Input
                    placeholder="Max"
                    value={localState.maxPrice}
                    onChange={handleMaxPriceChange}
                    className="w-full rounded-md border border-gray-300 text-sm shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
                />
            </div>
            <div className='mt-3 flex gap-2 justify-between'>
                <Button
                    onClick={() => handleClear()}
                >
                    Clear
                </Button>
                <Button
                    className='bg-black text-white'
                    onClick={() => handleApply()}
                >
                    Apply
                </Button>
            </div>
        </div>
    )
}

export default PriceRange