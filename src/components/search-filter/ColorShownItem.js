import React, { useReducer } from 'react'
import { MdCircle } from "react-icons/md";
import { Menu } from 'antd';
import { type } from '@testing-library/user-event/dist/type';
import { MdOutlineKeyboardArrowUp, MdOutlineKeyboardArrowDown } from "react-icons/md";
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheck } from "react-icons/fa6";
const ColorShownItem = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    }
    , {
      isCollapsed: false,
      selected_color: []
    }
  )
  const colors = [
    { color: 'Black', hex: '#000000' },
    { color: 'Red', hex: '#FF0000' },
    { color: 'Green', hex: '#008000' },
    { color: 'Blue', hex: '#0000FF' },
    { color: 'Yellow', hex: '#FFFF00' },
    { color: 'Orange', hex: '#FFA500' },
    { color: 'Purple', hex: '#800080' },
    { color: 'Pink', hex: '#FFC0CB' },
    { color: 'Brown', hex: '#A52A2A' },
  ]
  const handleSelectColor = (product_color_shown) => {
    const isColorSelected = localState.selected_color.includes(product_color_shown);
    const updatedColors = isColorSelected
      ? localState.selected_color.filter(color => color !== product_color_shown)
      : [...localState.selected_color, product_color_shown];
    setLocalState({ type: 'selected_color', payload: updatedColors });
    const queryParams = new URLSearchParams(location.search);
    queryParams.delete('product_color_shown');
    updatedColors.forEach(color => queryParams.append('product_color_shown', color));
    navigate(`${location.pathname}?${queryParams.toString()}`);
  };

  return (
    <div className='ml-8'>

      <div
        onClick={() => setLocalState({ type: 'isCollapsed', payload: !localState.isCollapsed })}
        className='flex justify-between items-center'
      >
        <h3 className='text-2xl font-nikeBody cursor-pointer'>Colour</h3>
        {
          localState.isCollapsed ? <MdOutlineKeyboardArrowDown size={25} /> : <MdOutlineKeyboardArrowUp size={25} />
        }
      </div>
      {localState.isCollapsed ? null : (
        <Menu>
          <div className="grid grid-cols-3 gap-4 mt-3">
            {colors.map((color, index) => (
              <div
                key={index}
                className="flex flex-col items-center mb-3 cursor-pointer hover:text-gray-300"
                onClick={() => handleSelectColor(color.color)}
              >
                <div className="relative flex items-center justify-center" style={{ width: 25, height: 25 }}>
                  <MdCircle size={25} style={{ color: color.hex }} />
                  {
                    localState.selected_color.includes(color.color) && (
                      <FaCheck
                        size={12}
                        style={{ color: 'white', position: 'absolute' }}
                      />
                    )
                  }
                </div>
                <span className="mb-2 text-xs">{color.color}</span>
              </div>
            ))}
          </div>
        </Menu>
      )}

    </div>
  )
}

export default ColorShownItem