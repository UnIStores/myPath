import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useRef } from "react";

const PopupMenu = ({ changePopupYn, fileData, modifyEditDom }) => {
  const fileUploadRef = useRef();
  const filePopupRef = useRef();
  const fileUpload = async (file) => {
    const data = {};
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = (e) => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const { width } = img;
        data.width = width;
      };
    };
    const formData = new FormData();
    formData.append("img", file);
    formData.append("uuid", fileData.uuid);

    reader.onload = function (e) {};

    const upload = await axios.post("/api/common/upload", formData);
    data.files = upload.data;
    modifyEditDom(fileData.uuid, data);
  };

  const handleResize = (e) => {
    console.log("e : ", e);
  };
  useEffect(() => {
    window.addEventListener("resize", handleResize);
  }, []);
  return (
    <>
      <div
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          minWidth: "34rem",
          left: 0,
          top: 0,
          zIndex: 998,
        }}
      ></div>
      <div
        className="filePopup"
        ref={filePopupRef}
        style={{
          position: "relative",
          top: fileData?.y,
          width: "40rem",
          minWidth: "18rem",
          maxWidth: "calc(100vw - 4rem)",
          height: "10rem",
          zIndex: 999,
          border: "1px solid rgba(55, 53, 47, 0.3)",
          borderRadius: "0.5rem",
          background: "white",
          boxShadow:
            "rgb(15 15 15 / 5%) 0px 0px 0px 1px, rgb(15 15 15 / 10%) 0px 3px 6px, rgb(15 15 15 / 20%) 0px 9px 24px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "1rem",
            padding: " 0.7rem 0.7rem 0 0.7rem",
          }}
        >
          <div
            style={{
              cursor: "pointer",
              height: "3rem",
              width: "6rem",
              textAlign: "center",
              //borderBottom: "0.2rem solid black",
            }}
          >
            ?????????
          </div>
          <div
            style={{
              cursor: "pointer",
              height: "3rem",
              width: "6rem",
              textAlign: "center",
              //borderBottom: "0.2rem solid black",
            }}
          >
            ??????
          </div>
        </div>
        <div style={{ borderTop: "1px solid rgba(55, 53, 47, 0.3)" }}>
          <div
            onClick={() => {
              fileUploadRef.current.click();
            }}
            style={{
              cursor: "pointer",
              margin: "1rem 1rem 0 1rem",
              padding: "0.5rem",
              border: "1px solid rgba(55, 53, 47, 0.3)",
              borderRadius: "0.5rem",
              textAlign: "center",
            }}
          >
            <input
              type="file"
              ref={fileUploadRef}
              style={{ display: "none" }}
              onChange={(e) => {
                changePopupYn(e);
                fileUpload(e.target.files[0]);
              }}
            />
            ?????? ?????????
          </div>
        </div>
      </div>
    </>
  );
};

export default PopupMenu;
