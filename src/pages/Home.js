import React from "react";
import Intro from "../assets/intro.mp4";
import { Button, Carousel } from "antd";
import { icons } from "antd/es/image/PreviewGroup";
import IconsContainer from "../components/product-icons/IconsContainer";
import NewRelease from "../components/product-icons/NewRelease";
const Home = () => {
  const icons = [
    {
      id: 1,
      thumbnail:
        "https://static.nike.com/a/images/f_auto/dpr_0.8,cs_srgb/w_2537,c_limit/32a8910a-96a5-4e36-9fbd-b9b729f56b09/nike-just-do-it.png",
    },
    {
      id: 1,
      thumbnail:
        "https://static.nike.com/a/images/f_auto/dpr_0.8,cs_srgb/w_2537,c_limit/32a8910a-96a5-4e36-9fbd-b9b729f56b09/nike-just-do-it.png",
    },
    {
      id: 1,
      thumbnail:
        "https://static.nike.com/a/images/f_auto/dpr_0.8,cs_srgb/w_2537,c_limit/32a8910a-96a5-4e36-9fbd-b9b729f56b09/nike-just-do-it.png",
    },
    {
      id: 1,
      thumbnail:
        "https://static.nike.com/a/images/f_auto/dpr_0.8,cs_srgb/w_2537,c_limit/32a8910a-96a5-4e36-9fbd-b9b729f56b09/nike-just-do-it.png",
    },
    {
      id: 1,
      thumbnail:
        "https://static.nike.com/a/images/f_auto/dpr_0.8,cs_srgb/w_2537,c_limit/32a8910a-96a5-4e36-9fbd-b9b729f56b09/nike-just-do-it.png",
    },
    {
      id: 1,
      thumbnail:
        "https://static.nike.com/a/images/f_auto/dpr_0.8,cs_srgb/w_2537,c_limit/32a8910a-96a5-4e36-9fbd-b9b729f56b09/nike-just-do-it.png",
    },
    {
      id: 1,
      thumbnail:
        "https://static.nike.com/a/images/f_auto/dpr_0.8,cs_srgb/w_2537,c_limit/32a8910a-96a5-4e36-9fbd-b9b729f56b09/nike-just-do-it.png",
    },
  ];

  return (
    <div className="bg-white max-w-[1400px] mx-auto my-4 flex flex-col gap-4">
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
      <NewRelease />
    </div>
  );
};

export default Home;
