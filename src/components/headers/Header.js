import React, { memo, useEffect, useReducer } from "react";
import HamanLogo from "../../assets/HamansLogo.png";
import { BsBag, BsHeart, BsSearch } from "react-icons/bs";
import { BiUser } from "react-icons/bi";
import { Badge, Drawer, Popover } from "antd";
import { CiMenuBurger } from "react-icons/ci";
import DrawerMenuContent from "../categories/DrawerMenuContent";
import DrawerSearchContent from "../categories/DrawerSearchContent";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { IoMdExit } from "react-icons/io";
import { MdFavoriteBorder } from "react-icons/md";
import { LogoutUser } from "../../services/userService";
import { logout } from "../../redux/userSlice";
import { clearCart, fetchBag, fetchTotalItems } from "../../redux/cartSlice";

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
  const user = useSelector((state) => state.user);
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();
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
  const handleLogout = async () => {
    try {
      if (user?.userId) {
        const payload = { UserId: user.userId };
        const logout_res = await LogoutUser(payload);
        if (logout_res?.statusCode === 200) {
          console.log("Logout success", logout_res);
        } else {
          console.error(
            "Error during logout:",
            logout_res?.message || "Unknown error"
          );
        }
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    } finally {
      localStorage.removeItem("token");
      dispatch(logout());
      dispatch(clearCart());
    }
  };

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchTotalItems(user?.userId));
    }
  }, [user?.userId, dispatch]);
  return (
    <>
      <header
        className={`w-full bg-white flex items-center justify-center shadow-md sticky ${
          localState.openMenuDrawer || localState.openSearchDrawer
            ? "z-0"
            : "z-50"
        } top-0`}
      >
        <div className="w-[1400px] flex justify-between items-center">
          <span
            className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full text-3xl cursor-pointer"
            onClick={() => handleOnClick("menu")}
          >
            <CiMenuBurger />
          </span>
          <div className="w-full flex justify-center items-center">
            <a href="/" className="">
              <img src={HamanLogo} alt="" className="ml-36 w-72" />
            </a>
          </div>

          <div className="flex justify-center items-center gap-2 text-xl font-semibold">
            <div
              className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full cursor-pointer"
              onClick={() => handleOnClick("search")}
            >
              <BsSearch />
            </div>
            <div
              className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full cursor-pointer"
              onClick={() =>
                user?.userId ? navigate("/favorites") : navigate("/login")
              }
            >
              <BsHeart />
            </div>
            <div
              className="hover:bg-orange-600 hover:text-white text-black px-5 py-4 hover:rounded-full cursor-pointer group"
              onClick={() => navigate("/cart")}
            >
              <Badge count={cart?.totalItems} size="small">
                <BsBag className="text-xl group-hover:text-white" />
              </Badge>
            </div>

            {!user?.userId && (
              <div
                className="hover:bg-orange-600 hover:text-white text-black p-4 hover:rounded-full cursor-pointer"
                onClick={() => navigate("/login")}
              >
                <BiUser />
              </div>
            )}
            {user?.userId && (
              <Popover
                content={
                  <div className="flex flex-col text-base items-start w-[200px]">
                    <div
                      className="font-semibold text-neutral-500 w-full p-2 cursor-pointer  hover:bg-neutral-100 hover:text-orange-500 flex gap-2 items-center"
                      onClick={() => navigate("/account-setting")}
                    >
                      Profile
                    </div>
                    <div
                      className="font-semibold text-neutral-500 w-full p-2  cursor-pointer hover:bg-neutral-100 hover:text-orange-500 flex gap-2 items-center"
                      onClick={() => navigate("/orders?statusId=0")}
                    >
                      Orders
                    </div>
                    <div
                      className="font-semibold text-neutral-500 w-full p-2 cursor-pointer hover:bg-neutral-100 hover:text-orange-500 flex gap-2 items-center"
                      onClick={() => navigate("/favorites")}
                    >
                      Wishlist
                    </div>
                    <div
                      className="font-semibold text-neutral-500 w-full p-2 cursor-pointer hover:bg-neutral-100 hover:text-orange-500 flex gap-2 items-center"
                      onClick={() => handleLogout()}
                    >
                      Log Out <IoMdExit className="text-xl" />
                    </div>
                  </div>
                }
                overlayClassName="z-[99999999999]"
              >
                <div
                  className="hover:bg-orange-600 hover:text-white text-black  hover:rounded-full cursor-pointer flex items-center "
                  onClick={() => navigate("/account-setting")}
                >
                  <div className="p-4">
                    <BiUser />
                  </div>
                  <div className="text-sm flex items-center">
                    Hi, {user.userFirstName?.split(" ").slice(-1).join(" ")}
                  </div>
                </div>
              </Popover>
            )}
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
