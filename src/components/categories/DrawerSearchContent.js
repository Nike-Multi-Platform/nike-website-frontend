import React, { memo, useEffect, useReducer } from "react";
import HamanLogo from "../../assets/HamansLogo.png";
import { Input, Tag, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  getHistorySearch,
  saveHistorySearch,
} from "../../services/userService";
import { FaCameraRetro } from "react-icons/fa";

const { Search } = Input;

const DrawerSearchContent = (props) => {
  const { onClose, open } = props;
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      searchText: "",
      searchHistories: [],
    }
  );

  // Khi người dùng nhập từ khóa
  const onTextChange = (value) => {
    const text = value.target.value;
    setLocalState({ type: "searchText", payload: text });
  };

  const saveSearch = async (searchText) => {
    try {
      const res = await saveHistorySearch({
        userId: user.userId,
        keyword: searchText,
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Khi nhấn nút tìm kiếm
  const onSearch = async (value) => {
    const searchText = value || localState.searchText;
    navigate(`/categories?searchText=${encodeURIComponent(searchText)}`);
    onClose();
    if (user?.userId && searchText.trim() !== "") {
      await saveSearch(searchText);
    }
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

  useEffect(() => {
    const fetchHistorySearch = async () => {
      try {
        const res = await getHistorySearch(user?.userId);
        console.log(res);
        setLocalState({ type: "searchHistories", payload: res.data });
      } catch (error) {
        console.error(error);
      }
    };
    if (user?.userId && open) {
      fetchHistorySearch();
    }
  }, [user?.userId, open]);

  return (
    <div className="p-4">
      <div className="w-full grid grid-cols-12 items-center">
        <div className="col-span-3">
          <img src={HamanLogo} alt="Logo" className="w-40" />
        </div>
        <div className="col-span-6 flex items-center gap-4">
          <Search
            size="large"
            placeholder="Search"
            allowClear
            value={localState.searchText}
            onChange={onTextChange}
            onSearch={onSearch}
          />
          <Upload {...props}>
            <div
              className="p-3 flex justify-center items-center border-[1px] rounded-lg cursor-pointer"
              title="Upload Photo to Search"
            >
              <FaCameraRetro className="text-blue-500" />
            </div>
          </Upload>
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
          {localState?.searchHistories?.length > 0 && (
            <>
              <span className="text-neutral-700 font-semibold text-lg">
                Search History
              </span>
              <div className="flex gap-2">
                {localState?.searchHistories?.map((history) => (
                  <Tag
                    key={history.id}
                    color="#f50"
                    className="cursor-pointer"
                    onClick={() => handleTagClick(history.textSearch)}
                  >
                    {history.textSearch}
                  </Tag>
                ))}
              </div>
            </>
          )}
        </div>
        <div className="col-span-3"></div>
      </div>
    </div>
  );
};

export default memo(DrawerSearchContent);
