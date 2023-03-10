import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"};
  border-radius: 0.5rem;
  border: 1px solid rgba(55, 53, 47, 0.2);
  background: white;
`;

const Menu = styled.div`
  width: 20rem;
  font-size: 1.7rem;
  line-height: 2.8rem;
  padding-left: 0.5rem;
  :hover {
    border-radius: 0.5rem;
    background: rgba(55, 53, 47, 0.1);
  }
`;

const TextMenuWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  border-bottom: 1px solid rgba(55, 53, 47, 0.2);
`;

const TextMenu = styled.div`
  padding: 0 0.5rem;
`;

const TextSizeWrapper = styled.div`
  display: flex;
`;

const TextSizeOption = styled.div``;

const ContextMenuPopup = ({
  pointer,
  changeContextMenuYn,
  modifyEditDom,
  hoverUuid,
  data,
}) => {
  const [uuid, setUuid] = useState(hoverUuid);
  const [fontData, setFontData] = useState({
    fontSize: data?.fontSize ? data.fontSize : 10,
  });
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);

  const sizeList = [
    6, 8, 9, 10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72,
  ];

  const deleteMenu = () => {
    modifyEditDom(uuid, {}, "delete");
    changeContextMenuYn(false);
  };

  const changeMenu = () => {
    const tagName = prompt("tagName", "div");
    modifyEditDom(uuid, { tagName: tagName });
    changeContextMenuYn(false);
  };

  return (
    <ContextMenuWarpper
      x={pointer?.x}
      y={pointer?.y}
      className="contextMenu"
      onClick={() => {
        if (isFontSizeOpen) {
          setIsFontSizeOpen(false);
        }
      }}
    >
      <TextMenuWrapper>
        <TextMenu>
          <TextSizeWrapper>
            <div style={{ width: "2rem", position: "relative" }}>
              <input
                value={fontData?.fontSize}
                onChange={(e) => {
                  if (isFontSizeOpen) {
                    setIsFontSizeOpen(false);
                  }

                  e.target.value = e.target.value.replace(/[^-0-9]/g, "");

                  if (e.target.value === null || e.target.value === "") {
                    console.log("1");
                  }
                  setFontData({ ...fontData, fontSize: e.target.value });
                }}
                style={{
                  fontSize: "1.5rem",
                  border: "none",
                  outline: "none",
                  width: "100%",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  background: "white",
                  width: "100%",
                  height: !isFontSizeOpen ? "0px" : "11rem",
                  transition: "0.1s",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    border: "1px solid rgba(55, 53, 47, 0.2)",
                    overflow: "scroll",
                    height: "100%",
                  }}
                >
                  {sizeList.map((size, index) => (
                    <TextSizeOption
                      key={index}
                      onClick={() => {
                        setFontData({ ...fontData, fontSize: size });
                      }}
                    >
                      {size}
                    </TextSizeOption>
                  ))}
                </div>
              </div>
            </div>

            <div
              onClick={(e) => {
                setIsFontSizeOpen(!isFontSizeOpen);
              }}
              style={{ width: "2rem", textAlign: "center" }}
            >
              ???
            </div>
          </TextSizeWrapper>
        </TextMenu>
        <TextMenu>??????</TextMenu>
        <TextMenu>??????</TextMenu>
        <TextMenu>B</TextMenu>
        <TextMenu>i</TextMenu>
        <TextMenu>U</TextMenu>
        <TextMenu>S</TextMenu>
      </TextMenuWrapper>
      <div style={{ padding: "0.5rem" }}>
        <Menu
          onClick={(e) => {
            deleteMenu();
          }}
        >
          ??????
        </Menu>
        <Menu
          onClick={(e) => {
            changeMenu();
          }}
        >
          ??????
        </Menu>
      </div>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
