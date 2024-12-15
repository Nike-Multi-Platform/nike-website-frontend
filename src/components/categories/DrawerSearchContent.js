import React, { memo, useEffect, useReducer } from "react";
import HamanLogo from "../../assets/HamansLogo.png";
import { Input, message, Tag, Upload } from "antd";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import * as tf from "@tensorflow/tfjs";

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
      model: null,
      imageAI: null,
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
  function getStringBeforeShoes(input) {
    const match = input.match(/([A-Z0-9]+-[A-Z0-9]+)/);

    // Nếu tìm thấy đoạn phù hợp, trả về
    if (match) {
      return match[0];
    }

    // Nếu không tìm thấy, trả về chuỗi rỗng
    return "";

  }

  const predict = async (inputTensor) => {
    if (!localState.model) return;

    // Sử dụng mô hình để dự đoán
    const prediction = localState.model.predict(inputTensor);
    prediction.print(); // Hoặc xử lý kết quả dự đoán
    console.log("Result", prediction);
    prediction
      .array()
      .then((data) => {
        console.log("Prediction Values:", data);
        // Nếu là bài toán phân loại:
        const labels = [
          "air_force_1_07_easyon_shoes_LKXP_WhitePhoto Blue",
          "air_force_1_07_next_nature_shoes_DV3808-107_WhiteWhiteVoltDusty Cactus",
          "air_force_1_07_shoes_5fFrTT_FQ4296-100_WhiteWhiteAquarius Blue",
          "air_force_1_07_shoes_7d5sHw_HF4298-100_WhiteFirPhantomObsidian",
          "air_force_1_07_shoes_RgcF1Q_FZ7187-100_WhiteUniversity RedWhite",
          "air_force_1_07_shoes_black_CW2288-001_BlackBlack",
          "air_force_1_07_shoes_white_CW2288-111_WhiteWhite",
          "air_force_1_low_evo_shoes_QcbnHZ_DV3907-900_Multi-ColourMulti-ColourMulti-Colour",
          "air_force_1_shadow_shoes_DmvLlC_HF5064-100_WhitePhoto BlueLilac BloomAlchemy Pink",
          "air_jordan_1_low_g_nrg_golf_shoe_FZ4159-100_WhiteBlack",
          "air_jordan_1_low_se_craft_shoes_FQ3055-100_Pale IvoryLegend Light BrownSail",
          "air_jordan_1_low_se_shoes_L9LvW5_HF5753-221_HempSailOatmealLight British Tan",
          "air_jordan_1_low_se_shoes_hgcLbC_FN9137-141_WhiteBlue GreySailIndustrial Blue",
          "air_jordan_1_low_se_shoes_nxMDqp_FZ3972-294_Pale Vanilla",
          "air_jordan_1_low_se_shoes_xmgzfl_HF4823-100_WhiteLightningChlorophyll",
          "air_jordan_1_low_se_shoes_xq1gdm",
          "air_jordan_1_low_shoes_553558-161_WhiteVarsity RedWhiteBlack",
          "air_jordan_1_low_shoes_ZHhKk2_DM1206-060_ BlackCement GreyWhiteFire Red",
          "air_jordan_1_low_shoes_ZHhKk2_white_553560-132_WhiteBlack",
          "air_jordan_1_low_shoes_zTWr01_553558-131_WhiteGreen Glow",
          "air_jordan_1_mid-_shoes_7cdjgS_black",
          "air_jordan_1_mid-_shoes_7cdjgS_white",
          "air_jordan_1_mid_se_craft_shoes_ FQ3224-100_Pale IvoryLegend Light BrownSail",
          "air_jordan_1_mid_se_shoes_4wVkRK_FN5031-100_WhiteWolf GreyMetallic Silver",
          "air_jordan_1_mid_se_shoes_JFn5S2_FQ1926-161_Coconut MilkSailLegend Pink",
          "air_jordan_1_mid_se_shoes_qG5ltp_FJ3458-160_WhiteDune RedSailLobster",
          "air_jordan_1_mid_se_shoes_v8XHxD_FN5215-161_WhiteSailLegend Pink",
          "air_jordan_1_mid_shoes_86f1ZW_FN5277-161_RedBlack",
          "air_jordan_1_mid_shoes_SQf7DM_DQ8423-132_WhiteWhiteBlackBlack",
          "jordan_1_low_alt_se_younger_shoe_FN9744-018_Football GreyPine Green",
          "kid_FB4412-006_BlackWhiteVarsity Red",
        ];
        data.forEach((batch, index) => {
          const maxIndex = batch.indexOf(Math.max(...batch));
          console.log("Prediction for Batch ${ index + 1}:", labels[maxIndex]);
          console.log("Prediction for Batch 2 ${ index + 1}:", maxIndex);
          const product_style_code = getStringBeforeShoes(labels[maxIndex]);
          if (product_style_code === "")
          {
            message.error("No product found");
          }
          else{
            onSearch(getStringBeforeShoes(labels[maxIndex]));
            // setLocalState({
            //   type: "searchText",
            //   payload: getStringBeforeShoes(labels[maxIndex]),
            // });
          }
          // setLocalState({ type: "imageAI", payload: labels[maxIndex] });
        });
      })
      .catch((err) => console.error(err));
  };

  const handleUploadImage = async (file) => {
    if (!(file instanceof Blob)) {
      console.error("The provided file is not a valid Blob or File object.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        const inputTensor = tf.browser
          .fromPixels(img)
          .resizeNearestNeighbor([128, 128]) // Resize to the required model size
          .toFloat()
          .expandDims();

        console.log("Tensor:", inputTensor);
        predict(inputTensor);
        // You can now use the inputTensor for predictions or other operations
      };
    };
    reader.readAsDataURL(file);
  };

  const onUploadChange = ({ file }) => {
    handleUploadImage(file.originFileObj);
  };

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

  // load model

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("/modeljs/model.json");
        setLocalState({ type: "model", payload: loadedModel });
      } catch (error) {
        console.error("Lỗi khi tải mô hình:", error);
      }
    };

    loadModel();
  }, []);

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
          <Upload
            fileList={localState.imageAI}
            maxCount={1}
            onChange={onUploadChange}
          >
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
