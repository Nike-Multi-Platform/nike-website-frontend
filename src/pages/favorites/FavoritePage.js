import { Button, Result } from "antd";
import React, { useCallback, useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFavorites } from "../../services/favoriteService";
import FavoriteItem from "../../components/favorites/FavoriteItem";

const FavoritePage = () => {
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      return { ...state, [action.type]: action.payload };
    },
    {
      favorites: [],
      loading: false,
      page: 1,
      totalPages: 0,
    }
  );
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const fetchFavorites = useCallback(async () => {
    try {
      setLocalState({ type: "loading", payload: true });
      const res = await getFavorites(user.userId, localState?.page, 10);
      if (res.statusCode === 200) {
        const newFavorites = [...localState?.favorites, ...res.data];
        setLocalState({ type: "favorites", payload: newFavorites });
        setLocalState({ type: "totalPages", payload: res.totalPages });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLocalState({ type: "loading", payload: false });
    }
  }, [user.userId, localState?.page]);
  useEffect(() => {
    if (user?.userId) {
      fetchFavorites();
    }
  }, [fetchFavorites, user?.userId]);

  const handleLoadMore = useCallback(() => {
    setLocalState({ type: "page", payload: localState?.page + 1 });
  }, [localState?.page]);

  return (
    <div className="max-w-[1400px] mx-auto my-10">
      {user?.userId && (
        <>
          <span className="text-2xl font-semibold">Favourites</span>
          {localState?.favorites?.length === 0 && (
            <div className="w-full text-center my-10 font-semibold">
              Items added to your Favourites will be saved here.
            </div>
          )}
          <div className="grid grid-cols-12 gap-6 my-4">
            {localState?.favorites?.map((item, key) => (
              <FavoriteItem item={item} key={key} onUpdate={fetchFavorites} />
            ))}
          </div>
          {localState?.page < localState?.totalPages && (
            <div className="w-full flex justify-center items-center mt-10">
              <Button
                className="rounded-full px-10 py-5 hover:bg-red-500 hover:text-white hover:border-red-500"
                size="large"
                onClick={handleLoadMore}
              >
                See More
              </Button>
            </div>
          )}
        </>
      )}
      {!user?.userId && (
        <div className="max-w-[1400px] mx-auto flex justify-center items-center flex-col">
          <Result status={"error"} title="You are not logged in." />
          <Button
            size="large"
            className="bg-red-500 text-white border-red-500 hover:opacity-80"
            onClick={() => navigate("/login")}
          >
            Login Now
          </Button>
        </div>
      )}
    </div>
  );
};

export default FavoritePage;
