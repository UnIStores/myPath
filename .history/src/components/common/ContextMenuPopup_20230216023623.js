import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";
import { useRef } from "react";
import axios from "axios";
import { SketchPicker } from "react-color";
import { useEffect } from "react";

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
  min-width: 4rem;
  padding: 0 0.5rem;
  height: 4rem;
  display: flex;
  text-align: center;
  font-size: 1.5rem;

  flex-direction: column;
  justify-content: center;

  border: ${(props) =>
    props.border ? "0.2rem solid rgba(55, 53, 47, 0.2)" : null};

  border-radius: 0.3rem;
  :hover {
    background: rgba(55, 53, 47, 0.1);
    border-radius: 0.3rem;
  }
`;

const TextSizeWrapper = styled.div`
  display: flex;
`;

const TextSizeOption = styled.div`
  text-align: center;
  :hover {
    background: rgba(55, 53, 47, 0.2);
  }
`;

const ContextMenuPopup = ({
  pointer,
  changeContextMenuYn,
  modifyEditDom,
  popupData,
}) => {
  const [uuid, setUuid] = useState(popupData?.uuid);
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [isSketchOpen, setIsSketchOpen] = useState(false);
  const [isBackgroundSketchOpen, setIsBackgroundSketchOpen] = useState(false);

  const [fontSize, setFontSize] = useState(
    popupData?.styleData?.fontSize || 16
  );
  const [color, setColor] = useState(popupData?.styleData?.color);
  const [background, setBackground] = useState(
    popupData?.styleData?.background
  );
  const [bold, setBold] = useState(popupData?.styleData?.bold);
  const [italic, setItalic] = useState(popupData?.styleData?.italic);
  const [underLine, setUnderLine] = useState(popupData?.styleData?.underLine);
  const [strikethrough, setStrikethrough] = useState(
    popupData?.styleData?.strikethrough
  );

  const inputRef = useRef();

  const sizeList = [10, 11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];

  const deleteMenu = () => {
    modifyEditDom(popupData.uuid, {}, "delete");
    changeContextMenuYn(false);
  };

  const changeMenu = () => {
    const tagName = prompt("tagName", "div");
    modifyEditDom(popupData.uuid, { tagName: tagName });
    changeContextMenuYn(false);
  };

  const checkStyleIndex = (selection, style) => {
    // ????????? ?????? ????????? ????????????
    // ???????????? ????????? ????????????
    if (
      selection.baseNode !== selection.extentNode ||
      selection.anchorOffset !== selection.focusOffset
    ) {
      //?????? ??????????????? ?????? html ????????? span??? ????????????
      const target = document.querySelector(`[uuid="${uuid}"]`);
      const editableTag = target.querySelector(".editable-tag");
      const range = selection.getRangeAt(0);
      let newHtml = "";

      const { startOffset, endOffset, startContainer, endContainer } = range;

      let startNode = startContainer;
      let endNode = endContainer;
      const targetNodeList = [];

      if (startNode.parentElement.nodeName === "SPAN") {
        startNode = startNode.parentElement;
      }

      if (endNode.parentElement.nodeName === "SPAN") {
        endNode = endNode.parentElement;
      }

      const nodes = Array.from(editableTag.childNodes);
      const startNodeIndex = nodes.indexOf(startNode);
      const endNodeIndex = nodes.indexOf(endNode);

      for (let i = 0; i < nodes.length; i++) {
        if (startNodeIndex <= i && i <= endNodeIndex) {
          // ????????? ???????????? node ???
          targetNodeList.push(nodes[i]);
        }
      }

      newHtml = makeNewHtml(targetNodeList, startOffset, endOffset, style);

      // ?????? ??????????????? ?????? ?????????
      modifyEditDom(uuid, {
        html: newHtml,
      });

      editableTag.innerHTML = newHtml;

      setCaretPosition(editableTag, startOffset, endOffset);
      console.log("editableTag : ", editableTag.childNodes);
    } else {
      console.log("??????");
    }
  };

  const makeNewHtml = (nodes, start, end, style) => {
    let newHtml = "";
    let pre = "";
    let next = "";
    let html = "";

    // ?????? html??? ?????? ??????????????????
    nodes.map((node) => {
      const textContent = node.textContent;
      if (node.nodeName === "SPAN") {
        // span????????? ?????? start??? end??? text??? ????????? ???????????? ???????????? ?????????
        const styleList = [];
        console.log("style : ", style);
        console.log("keys : ", Object.keys(style));
        for (let i = 0; i < node.style.length; i++) {
          const styleName = node.style[i];
          styleList.push({ [styleName]: node.style[styleName] });
        }

        if (start === 0 && end === textContent.length) {
          newHtml = `<span style="${style}">${textContent}</span>`;
          // ??? ???????????? span??? ????????? ????????? ???????????? ?????? style ???????????? ????????????
        } else {
          // ??? ???????????? span??? ????????? ????????? ????????? ????????? span??? ???????????????
        }

        console.log("styleList: ", styleList);
        // span????????? ?????? ????????? ?????? ????????????
      } else {
        // span??? ???????????? ????????? ?????????
        pre =
          start < end ? textContent.slice(0, start) : textContent.slice(0, end);
        next =
          start < end
            ? textContent.slice(end, textContent.length)
            : textContent.slice(start, textContent.length);

        html =
          start < end
            ? textContent.slice(start, end)
            : textContent.slice(end, start);
      }
    });

    newHtml = pre + `<span style="${style}">${html}</span>${next}`;
    return newHtml;
  };

  const setCaretPosition = (target, start, end) => {
    const nodes = target.childNodes;
    let currentNodeStartIndex = 0;
    let currentNodeEndIndex = 0;
    const newRange = document.createRange();

    // ???????????? ????????? ?????? ??????
    for (let i = 0; i < nodes.length; i++) {
      let textLength = nodes[i].textContent.length;

      currentNodeEndIndex += textLength;
      if (currentNodeStartIndex <= start && currentNodeEndIndex > start) {
        const textNode =
          nodes[i].nodeName === "#text" ? nodes[i] : nodes[i].firstChild;
        newRange.setStart(textNode, start - currentNodeStartIndex);
      }

      if (currentNodeStartIndex < end && currentNodeEndIndex >= end) {
        // ????????? ????????? ?????? node??? ???????????? ????????????
        const textNode =
          nodes[i].nodeName === "#text" ? nodes[i] : nodes[i].firstChild;

        newRange.setEnd(
          textNode,
          textLength - Math.abs(currentNodeStartIndex - start)
        );
      }
      currentNodeStartIndex += textLength;
    }

    document.getSelection().removeAllRanges();
    document.getSelection().addRange(newRange);
  };

  const changeFontSize = async (value) => {
    let newValue;
    if (value < 10) {
      newValue = 10;
    } else {
      newValue = value;
    }

    setFontSize(newValue);
    inputRef.current.value = newValue;

    if (newValue >= 10) {
      modifyEditDom(
        popupData.uuid,
        {
          styleData: { ...popupData?.styleData, fontSize: newValue },
        },
        "style"
      );
    }

    await axios.post("/api/editor/style/save", {
      uuid: uuid,
      fontSize: newValue,
    });
  };

  const changeColor = async (modifyColor) => {
    if (popupData?.styleData?.color !== modifyColor) {
      modifyEditDom(
        popupData.uuid,
        {
          styleData: { ...popupData?.styleData, color: modifyColor },
        },
        "style"
      );
    }
  };

  const changeBackground = async (modifyColor) => {
    if (popupData?.styleData?.background !== modifyColor) {
      modifyEditDom(
        popupData.uuid,
        {
          styleData: { ...popupData?.styleData, background: modifyColor },
        },
        "style"
      );
    }
  };

  return (
    <ContextMenuWarpper
      x={pointer?.x}
      y={pointer?.y}
      className="contextMenu"
      onClick={(e) => {
        if (isFontSizeOpen) {
          setIsFontSizeOpen(false);
        }

        const sketchElement = e.target.closest(".color-sketch");
        // ???????????? ????????? ????????? ???????????????
        if (!sketchElement && isSketchOpen) {
          setIsSketchOpen(false);
          changeColor(color);
        }

        const backgroundSketchElement = e.target.closest(".background-sketch");
        // ???????????? ????????? ????????? ???????????????
        if (!backgroundSketchElement && isBackgroundSketchOpen) {
          setIsBackgroundSketchOpen(false);
          changeBackground(background);
        }
      }}
    >
      <TextMenuWrapper>
        <div style={{ position: "relative" }}>
          <TextMenu>
            <TextSizeWrapper>
              <div style={{ width: "2rem", position: "relative" }}>
                <input
                  ref={inputRef}
                  defaultValue={
                    popupData?.styleData?.fontSize
                      ? popupData?.styleData?.fontSize
                      : 16
                  }
                  //value={fontSize}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const value = e.target.value;
                      changeFontSize(value);
                      setIsFontSizeOpen(false);
                    }
                  }}
                  onChange={(e) => {
                    e.target.value = e.target.value.replace(/[^-0-9]/g, "");
                  }}
                  style={{
                    fontSize: "1.6rem",
                    border: "none",
                    outline: "none",
                    width: "100%",
                    background: "none",
                  }}
                />
              </div>
              <div
                onClick={() => {
                  setIsFontSizeOpen(!isFontSizeOpen);
                }}
                style={{ width: "2rem", textAlign: "center" }}
              >
                ???
              </div>
            </TextSizeWrapper>
          </TextMenu>
          <div
            style={{
              position: "absolute",
              width: "90%",
              height: !isFontSizeOpen ? "0px" : "17rem",
              transition: "0.1s",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                border: "1px solid rgba(55, 53, 47, 0.2)",
                overflow: "scroll",
                height: "100%",
                background: "white",
              }}
            >
              {sizeList.map((size, index) => (
                <TextSizeOption
                  key={index}
                  onClick={() => {
                    changeFontSize(size);
                  }}
                >
                  {size}
                </TextSizeOption>
              ))}
            </div>
          </div>
        </div>
        <div>
          <TextMenu
            onClick={() => {
              setIsSketchOpen(!isSketchOpen);
            }}
          >
            A
            <div
              style={{
                width: "3rem",
                height: "1.2rem",
                borderRadius: "0.2rem",
                background: color,
                border: "1px solid rgba(55, 53, 47, 0.2)",
              }}
            ></div>
          </TextMenu>
          {isSketchOpen ? (
            <div
              className="color-sketch"
              style={{ position: "absolute", marginTop: "0.2rem" }}
            >
              <SketchPicker
                color={color}
                onChange={(e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                  setColor(rgbaText);
                  changeColor(rgbaText);
                }}
                onChangeComplete={async (e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                  changeColor(rgbaText);
                  const selection = window.getSelection();

                  const style = { color: rgbaText };

                  checkStyleIndex(selection, style);
                  await axios.post("/api/editor/style/save", {
                    uuid: uuid,
                    color: rgbaText,
                  });
                }}
              />
            </div>
          ) : null}
        </div>
        <div>
          <TextMenu
            onClick={() => {
              setIsBackgroundSketchOpen(!isBackgroundSketchOpen);
            }}
          >
            ??????
            <div
              style={{
                width: "3rem",
                height: "1.2rem",
                borderRadius: "0.2rem",
                background: background,
                border: "1px solid rgba(55, 53, 47, 0.2)",
              }}
            ></div>
          </TextMenu>
          {isBackgroundSketchOpen ? (
            <div
              className="background-sketch"
              style={{ position: "absolute", marginTop: "0.2rem" }}
            >
              <SketchPicker
                color={background}
                onChange={(e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                  setBackground(rgbaText);
                  changeBackground(rgbaText);
                }}
                onChangeComplete={async (e) => {
                  const rgba = e.rgb;
                  const rgbaText = `rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`;
                  changeBackground(rgbaText);
                  await axios.post("/api/editor/style/save", {
                    uuid: uuid,
                    background: rgbaText,
                  });
                }}
              />
            </div>
          ) : null}
        </div>
        <div style={{ fontWeight: "bold" }}>
          <TextMenu
            border={bold}
            onClick={async () => {
              setBold(!bold);
              modifyEditDom(
                popupData.uuid,
                {
                  styleData: { ...popupData?.styleData, bold: !bold },
                },
                "style"
              );
              await axios.post("/api/editor/style/save", {
                uuid: uuid,
                bold: !bold,
              });
            }}
          >
            B
          </TextMenu>
        </div>
        <div style={{ fontStyle: "italic" }}>
          <TextMenu
            border={italic}
            onClick={async () => {
              setItalic(!italic);
              modifyEditDom(
                popupData.uuid,
                {
                  styleData: { ...popupData?.styleData, italic: !italic },
                },
                "style"
              );
              await axios.post("/api/editor/style/save", {
                uuid: uuid,
                italic: !italic,
              });
            }}
          >
            i
          </TextMenu>
        </div>
        <div>
          <TextMenu
            border={underLine}
            onClick={async () => {
              setUnderLine(!underLine);
              modifyEditDom(
                popupData.uuid,
                {
                  styleData: { ...popupData?.styleData, underLine: !underLine },
                },
                "style"
              );

              await axios.post("/api/editor/style/save", {
                uuid: uuid,
                underLine: !underLine,
              });
            }}
          >
            U
          </TextMenu>
        </div>
        <div style={{ textDecoration: "line-through" }}>
          <TextMenu
            border={strikethrough}
            onClick={async () => {
              setStrikethrough(!strikethrough);
              modifyEditDom(
                popupData.uuid,
                {
                  styleData: {
                    ...popupData?.styleData,
                    strikethrough: !strikethrough,
                  },
                },
                "style"
              );

              await axios.post("/api/editor/style/save", {
                uuid: uuid,
                strikethrough: !strikethrough,
              });
            }}
          >
            S
          </TextMenu>
        </div>
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
