import React, { memo, useReducer } from "react";
import HamanLogo from "../../assets/HamansLogo.png";
import { BsBag, BsHeart, BsSearch } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { Drawer, Popover } from "antd";
import { CiMenuBurger } from "react-icons/ci";
import DrawerMenuContent from "../categories/DrawerMenuContent";
import DrawerSearchContent from "../categories/DrawerSearchContent";

const Header = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      openSearchDrawer: false,
      openMenuDrawer: false,
    }
  );

  const handleOnClick = (type) => {
    if (type === "search") {
      setLocalState({
        type: "openSearchDrawer",
        payload: !localState.openSearchDrawer,
      });
    } else {
      setLocalState({
        type: "openMenuDrawer",
        payload: !localState.openMenuDrawer,
      });
    }
  };

  const handleOnClose = (type) => {
    if (type === "search") {
      setLocalState({
        type: "openSearchDrawer",
        payload: false,
      });
    } else {
      setLocalState({
        type: "openMenuDrawer",
        payload: false,
      });
    }
  };

  return (
    <>
      <header
        className={`w-full bg-white flex items-center justify-center shadow-md sticky ${
          localState.openMenuDrawer || localState.openSearchDrawer
            ? "z-0"
            : "z-[99999999]"
        } top-0`}
      >
        <div className="w-[1400px] flex justify-between items-center">
          <span
            className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full text-3xl cursor-pointer"
            onClick={() => handleOnClick("menu")}
          >
            <CiMenuBurger />
          </span>
          <a href="/" className="w-full flex justify-center items-center">
            <img src={HamanLogo} alt="" className="ml-24 w-72" />
          </a>

          <div className="flex justify-center items-center gap-2 text-xl font-semibold">
            <div
              className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full cursor-pointer"
              onClick={() => handleOnClick("search")}
            >
              <BsSearch />
            </div>
            <div className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full cursor-pointer">
              <BsHeart />
            </div>
            <div className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full cursor-pointer">
              <BsBag />
            </div>
            <div className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full cursor-pointer">
              <BiUser />
            </div>
          </div>
        </div>
      </header>
      <Drawer
        placement="left"
        open={localState.openMenuDrawer}
        closable={false}
        onClose={() => handleOnClose("menu")}
      >
        <DrawerMenuContent
          open={localState.openMenuDrawer}
          onClose={() => handleOnClose("menu")}
        />
      </Drawer>
      <Drawer
        placement="top"
        open={localState.openSearchDrawer}
        closable={false}
        onClose={() => handleOnClose("search")}
      >
        <DrawerSearchContent
          open={localState.openSearchDrawer}
          onClose={() => handleOnClose("search")}
        />
      </Drawer>
    </>
  );
};

export default memo(Header);
