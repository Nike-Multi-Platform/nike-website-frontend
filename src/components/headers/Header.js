import React, { memo, useReducer } from "react";
import HamanLogo from "../../assets/HamansLogo.png";
import { BsBag, BsHeart, BsSearch } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { Drawer, Popover } from "antd";
import { CiMenuBurger } from "react-icons/ci";
import DrawerMenuContent from "../categories/DrawerMenuContent";

const Header = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      drawer: {
        type: "search",
        visible: false,
      },
    }
  );

  const handleOnClick = (type) => {
    setLocalState({ type: "drawer", payload: { type, visible: true } });
  };

  return (
    <>
      <header className="w-full bg-white flex items-center justify-center">
        <div className="w-[90%] flex justify-between items-center">
          <span
            className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full text-3xl cursor-pointer"
            onClick={() => handleOnClick("menu")}
          >
            <CiMenuBurger />
          </span>
          <div className="w-full flex justify-center items-center">
            <img src={HamanLogo} alt="" className="ml-24 w-72" />
          </div>

          <div className="flex justify-center items-center gap-2 text-xl font-semibold">
            <div
              className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full"
              onClick={() => handleOnClick("search")}
            >
              <BsSearch />
            </div>
            <div
              className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full"
              onClick={() => handleOnClick("search")}
            >
              <BsHeart />
            </div>
            <div
              className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full"
              onClick={() => handleOnClick("search")}
            >
              <BsBag />
            </div>
            <div
              className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full"
              onClick={() => handleOnClick("search")}
            >
              <BiUser />
            </div>
          </div>
        </div>
      </header>
      <Drawer
        placement={localState.drawer.type === "search" ? "top" : "left"}
        open={localState.drawer.visible}
        closable={false}
        onClose={() =>
          setLocalState({
            type: "drawer",
            payload: { type: "", visible: false },
          })
        }
      >
        {localState.drawer.type === "menu" && <DrawerMenuContent />}
      </Drawer>
    </>
  );
};

export default memo(Header);
