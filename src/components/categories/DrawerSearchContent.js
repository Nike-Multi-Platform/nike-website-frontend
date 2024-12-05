import React, { memo, useReducer } from "react";
import HamanLogo from "../../assets/HamansLogo.png";
import { Input, Tag } from "antd";
import { useNavigate } from "react-router-dom";

const { Search } = Input;

const DrawerSearchContent = (props) => {
  const { onClose } = props;
  const navigate = useNavigate();

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      searchText: "",
    }
  );

  // Khi người dùng nhập từ khóa
  const onTextChange = (value) => {
    const text = value.target.value;
    setLocalState({ type: "searchText", payload: text });
  };

  // Khi nhấn nút tìm kiếm
  const onSearch = (value) => {
    const searchText = value || localState.searchText;
    navigate(`/categories?searchText=${encodeURIComponent(searchText)}`);
  };

  // Gợi ý từ lịch sử tìm kiếm
  const handleTagClick = (searchText) => {
    navigate(`/categories?searchText=${encodeURIComponent(searchText)}`);
  };

  const searchHistory = [
    {
      id: 1,
      searchText: "Shoes",
    },
    {
      id: 2,
      searchText: "Shirts",
    },
    {
      id: 3,
      searchText: "Pants",
    },
  ];

  return (
    <div className="p-4">
      <div className="w-full grid grid-cols-12 items-center">
        <div className="col-span-3">
          <img src={HamanLogo} alt="Logo" className="w-40" />
        </div>
        <div className="col-span-6">
          <Search
            size="large"
            placeholder="Search"
            allowClear
            value={localState.searchText}
            onChange={onTextChange}
            onSearch={onSearch}
          />
        </div>
        <div className="col-span-3 flex justify-end">
          <span
            className="text-lg cursor-pointer text-neutral-600 font-semibold"
            onClick={onClose}
          >
            Cancel
          </span>
        </div>
      </div>
      <div className="w-full grid grid-cols-12 items-center mt-4">
        <div className="col-span-3"></div>
        <div className="col-span-6 flex flex-col gap-2">
          <span className="text-neutral-700 font-semibold text-lg">
            Search History
          </span>
          <div className="flex gap-2">
            {searchHistory.map((history) => (
              <Tag
                key={history.id}
                color="#f50"
                className="cursor-pointer"
                onClick={() => handleTagClick(history.searchText)}
              >
                {history.searchText}
              </Tag>
            ))}
          </div>
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
};

export default memo(DrawerSearchContent);
