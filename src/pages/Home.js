import React, { lazy, useEffect } from "react";
import Intro from "../assets/intro.mp4";
import { Button, Carousel } from "antd";
import Banner1 from "../assets/banner1.png";
import Banner2 from "../assets/banner2.png";
import Banner3 from "../assets/banner3.png";
import Banner4 from "../assets/banner4.png";
import Banner5 from "../assets/banner5.png";
import Banner6 from "../assets/banner6.png";
import Banner7 from "../assets/banner7.png";
import Banner8 from "../assets/banner8.png";
import Banner9 from "../assets/banner9.gif";
import Banner10 from "../assets/banner10.gif";

import withSuspense from "../hooks/HOC/withSuspense";
import { useLocation } from "react-router-dom";

const FlashSaleSection = withSuspense(
  lazy(() => import("../components/product-icons/FlashSaleSection"))
);
const ProductsByObject = withSuspense(
  lazy(() => import("../components/product-icons/ProductsByObject"))
);
const IconsContainer = withSuspense(
  lazy(() => import("../components/product-icons/IconsContainer"))
);
const NewRelease = withSuspense(
  lazy(() => import("../components/product-icons/NewRelease"))
);

const Home = () => {
  const banner = [Banner3, Banner4, Banner5, Banner6, Banner7];
  const location = useLocation();
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100); // Delay 100ms để đảm bảo trang đã tải xong
  }, [location]);
  return (
    <div className="bg-white max-w-[1400px] mx-auto my-4 flex flex-col gap-10">
      <div className="w-full my-4">
        <video autoPlay loop muted className="w-full">
          <source src={Intro} type="video/mp4" />
        </video>
        <div className="flex justify-center items-center mt-4 flex-col gap-4">
          <span className="font-nike text-display2 uppercase">
            Welcome To Hamans
          </span>
          <span className="font-nikeBody text-body1">
            Shop the latest trends in fashion.
          </span>
          <Button
            size="large"
            className="rounded-full bg-black text-white font-semibold w-40 h-20 uppercase"
          >
            Shop now
          </Button>
        </div>
      </div>
      <IconsContainer />
      <div className="w-full grid grid-cols-12 gap-4">
        <div className="col-span-8">
          <Carousel arrows autoplay={true}>
            {banner.map((img, index) => (
              <div key={index} className="w-fit">
                <img src={img} />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="col-span-4">
          <img src={Banner9} className="h-[588.38px]" />
        </div>
      </div>

      <FlashSaleSection />

      <div className="my-4 w-full">
        <img src={Banner2} className="w-full" />
      </div>

      <NewRelease />
      <div className="my-4 w-full">
        <img src={Banner1} />
      </div>
      <ProductsByObject objectId={1} />
      <ProductsByObject objectId={2} />
      <ProductsByObject objectId={3} />
    </div>
  );
};

export default Home;
