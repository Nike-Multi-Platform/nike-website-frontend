import { Button, Image, message, Modal, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { memo, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RiImageAddFill } from "react-icons/ri";
import uploadFile from "../../helpers/uploadFile";
import { sendRequest } from "../../services/orderService";
const ModalSendRequest = (props) => {
  const { order, openModal, onClose, onUpdate, type } = props;
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  //user_order_id, reason_type_id, return_reason_id, note, status
  const [localState, setLocalState] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "setLoading":
          return { ...state, loading: action.payload };
        case "reasons":
          return { ...state, reasons: action.payload };
        case "selectedReason":
          return { ...state, selectedReason: action.payload };
        case "note":
          return { ...state, note: action.payload };
        case "error":
          return { ...state, error: action.payload };
        case "imgList":
          return { ...state, imgList: action.payload };
        case "previewOpen":
          return { ...state, previewOpen: action.payload };
        case "previewImage":
          return { ...state, previewImage: action.payload };
        case "previewVisible":
          return { ...state, previewVisible: action.payload };
        case "previewTitle":
          return { ...state, previewTitle: action.payload };

        default:
          return state;
      }
    },
    {
      loading: false,
      imgList: [],
      previewOpen: false,
      previewImage: "",
      previewVisible: false,
      previewTitle: "",
      note: "",
      error: {
        note: "",
        imgList: "",
      },
    }
  );
  const handleCloseModalSendRequest = () => {
    onClose();
    setLocalState({ type: "note", payload: "" });
    setLocalState({ type: "error", payload: { note: "" } });
  };

  const handleOnNoteChange = (e) => {
    const value = e.target.value;
    setLocalState({ type: "note", payload: value });
  };
  const handleUploadImgListChange = ({ fileList: newFileList }) => {
    setLocalState({ type: "imgList", payload: newFileList });
  };
  const handlePreview = async (file) => {
    setLocalState({ type: "previewImage", payload: file.url || file.thumbUrl });
    setLocalState({ type: "previewVisible", payload: true });
    setLocalState({
      type: "previewTitle",
      payload: file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
    });
    setLocalState({ type: "previewOpen", payload: true });
  };
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isImage) {
      setLocalState({
        type: "error",
        payload: {
          ...localState.error,
          imgList: "Only accept image files",
        },
      });
      return Upload.LIST_IGNORE;
    }
    if (!isLt2M) {
      setLocalState({
        type: "error",
        payload: {
          ...localState.error,
          imgList: "Size exceeds 2MB",
        },
      });
      return Upload.LIST_IGNORE;
    }
    return true;
  };
  const handleRemoveProductImage = (file) => {
    setLocalState({
      type: "SET_FILE_LIST_PRODUCT",
      payload: localState.imgList.filter((item) => item.uid !== file.uid),
    });
  };
  const validateForm = () => {
    let localErrors = {
      note: "",
      imgList: "",
    };
    if (localState.note.length === 0) {
      localErrors.note = "Please enter note";
    } else if (localState.note.length > 0 && localState.note.length < 20) {
      localErrors.note = "Note minimum 20 characters";
    } else if (localState.note.length > 120) {
      localErrors.note = "Notes must not exceed 120 characters.";
    }

    if (type === "refund-request" && localState.imgList.length === 0) {
      localErrors.imgList = "Please upload at least 1 image";
    }
    const hasErrors = Object.values(localErrors).some((error) => error !== "");
    if (hasErrors) {
      setLocalState({ type: "error", payload: localErrors });
      return false;
    }
    return true;
  };
  const handleSendRequest = async () => {
    const isValid = validateForm();
    if (!isValid) return;
    var uploadedImages = [];
    if (type === "refund-request") {
      const uploadPromises = localState.imgList.map((file) =>
        uploadFile(file.originFileObj, "Nike-application")
      );

      uploadedImages = await Promise.all(uploadPromises);
      console.log("uploadedImages", uploadedImages);
    }
    const payload = {
      userOrderId: order.userOrderId,
      requestTypeId: type === "cancel-request" ? 1 : 2,
      reason: localState.note,
      requestImages:
        uploadedImages?.length > 0
          ? uploadedImages.map((img) => ({ imageUrl: img.url }))
          : [],
    };

    try {
      const res = await sendRequest(payload);
      if (res.statusCode === 200) {
        message.success("Request sent successfully");
        handleCloseModalSendRequest();
        onUpdate();
      }
    } catch (error) {
      console.log("Error when handleSendRequest", error);
      message.error("An error occurred, please try again later");
    }
  };
  return (
    <Modal
      width={800}
      closable={false}
      title={
        <span className="text-xl font-semibold capitalize">
          {type === "cancel-request"
            ? "Request Cancellation"
            : "Return/Refund Request"}
        </span>
      }
      onCancel={handleCloseModalSendRequest}
      onClose={handleCloseModalSendRequest}
      open={openModal}
      footer={
        <div className="w-full flex justify-end gap-3 items-center mt-3">
          <Button size="large" onClick={handleCloseModalSendRequest}>
            Cancel
          </Button>
          <Button
            size="large"
            className="text-white bg-orange-500 border-orange-500 hover:opacity-80"
            onClick={handleSendRequest}
          >
            Submit Request
          </Button>
        </div>
      }
    >
      <div className="w-full flex flex-col gap-3 pb-3">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-semibold text-neutral-500">
            Reason:{" "}
          </span>
          <TextArea
            autoSize={{
              minRows: 8,
              maxRows: 12,
            }}
            value={localState.note}
            onChange={handleOnNoteChange}
            count={{
              show: true,
              max: 120,
            }}
            className="text-base"
            placeholder="Please give specific reason"
          />
          <span className="text-red-500">{localState.error.note}</span>
        </div>
        {type === "refund-request" && (
          <div>
            <span className="text-lg font-semibold text-neutral-500">
              Images:{" "}
            </span>
            <Upload
              listType="picture-card"
              maxCount={6}
              fileList={localState.imgList}
              onChange={handleUploadImgListChange}
              onPreview={handlePreview}
              beforeUpload={beforeUpload}
              onRemove={handleRemoveProductImage}
              className="custom-upload"
            >
              {localState.imgList.length < 6 && (
                <div className="flex flex-col items-center">
                  <RiImageAddFill size={20} color="#EE4D2D" />
                  <div className="text-[#EE4D2D]">
                    Add image {localState.imgList.length}/6
                  </div>
                </div>
              )}
            </Upload>

            {localState.previewImage && (
              <Image
                wrapperStyle={{
                  display: "none",
                }}
                preview={{
                  visible: localState.previewOpen,
                  onVisibleChange: (visible) =>
                    setLocalState({ type: "previewOpen", payload: visible }),
                  afterOpenChange: (visible) =>
                    !visible &&
                    setLocalState({ type: "previewImage", payload: "" }),
                }}
                src={localState.previewImage}
              />
            )}
            <span className="text-red-500">{localState.error.imgList}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default memo(ModalSendRequest);
