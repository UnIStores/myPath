import React from "react";
import styled from "@emotion/styled";
import { v4 as uuidv4 } from "uuid";
import { useState, useEffect, useRef } from "react";
import EditBranchComponent from "./EditBranchComponent";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PopupMenu from "../../common/PopupMenu";
import ContextMenuPopup from "../../common/ContextMenuPopup";

const CloseButton = styled.div`
  width: 5rem;
  height: 5rem;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  margin-left: auto;
  position: absolute;
  right: 2rem;
  top: 1.5rem;
  background: white;
`;

const CloseButtonRotateWrapper = styled.div`
  width: 100%;
  height: 100%;
  font-size: 4rem;
  line-height: 4rem;
  transform: rotate(45deg);
`;
const EditorWrapper = styled.div`
  overflow: scroll;
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  background: white;
  font-size: 1.6rem;
`;
const CardEditorContentWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem 10rem 2rem;
  z-index: 998;
`;
const OverlayWrapper = styled.div`
  position: fixed;
  min-width: 34rem;
  z-index: ${(props) => (props.zindex ? 999 : "")};
  inset: 0px;
`;

const OverlayContentWrapper = styled.div`
  width: calc(100% - 4rem);
  position: relative;
`;

const OverlayContentContents = styled.div`
  position: absolute;
  width: 100%;
`;

const CardEditor = ({ pathId }) => {
  const [editDom, setEditDom] = useState([]);

  const [nearElement, setNearElement] = useState(null);
  const [hoverElement, setHoverElement] = useState(null);

  const [selectElements, setSelectElements] = useState([]);
  const [selectPoint, setSelectPoint] = useState(null);
  const [contextMenuPoint, setContextMenuPoint] = useState(null);
  const [movementSide, setMovementSide] = useState("");

  const [popupYn, setPopupYn] = useState(false);
  const [contextMenuYn, setContextMenuYn] = useState();
  const [newUuid, setNewUuid] = useState(null);
  const [draggable, setDraggable] = useState(false);
  const [fileData, setFileData] = useState(null);

  const editorRef = useRef();
  const overlayRef = useRef();
  const popupRef = useRef();

  const nav = useNavigate();

  const getTagList = async () => {
    const tagList = await axios.get("/api/editor/getList", {
      params: { pathId },
    });

    tagList.data.sort(function (a, b) {
      return a.sort - b.sort;
    });

    const newEditDom = [];

    tagList.data.map((tag) => {
      newEditDom.push(tag);
    });

    setEditDom(newEditDom);
  };

  useEffect(() => {
    getTagList();
  }, []);

  const modifyDomSave = async (newEditDom) => {
    newEditDom.map((element, index) => {
      element.sort = index;
    });

    const modifyList = [];
    editDom.map((element) => {
      const differentData = getDifferentType(element, newEditDom);
      if (differentData.type) {
        // type??? ???????????? ??????, ?????? ????????????
        modifyList.push(differentData);
      }
    });

    newEditDom.map((newElement) => {
      let matchCount = 0;
      editDom.map((element) => {
        if (newElement.uuid === element.uuid) matchCount++;
      });
      if (!matchCount) {
        const newData = { type: "create", data: newElement };
        modifyList.push(newData);
      }
    });

    setEditDom(newEditDom);
    await axios.post("/api/editor/save", modifyList);
  };

  const getDifferentType = (originalElement, newEditDom) => {
    const differentType = { type: null, data: null };
    let matchCount = 0;

    newEditDom.map((element) => {
      if (originalElement.uuid === element.uuid) {
        matchCount++;
        const newEditKeys = Object.keys(element);

        newEditKeys.map((key) => {
          if (originalElement[key] !== element[key]) {
            differentType.data = element;
            differentType.type = "modify";
          }
        });
      }
    });

    // ???????????? ????????? ??????????????????
    if (!matchCount) {
      differentType.data = originalElement;
      differentType.type = "delete";
    }
    return differentType;
  };

  const makeTree = (list, targetUuid) => {
    const copyDom = list.map((element) => Object.assign({}, element));
    const map = {};
    const roots = [];
    let node;
    let i;

    // ?????? ?????? ????????? ?????? ??? ???????????? ?????????
    // list??? ??????????????? parentId??? ????????? ?????? ???????????????
    // ?????? ???????????? ?????? ????????? ????????? ?????????
    // ?????? ???????????? ????????? ?????? node??? ????????? roots??? ????????? ??????
    for (i = 0; i < copyDom.length; i += 1) {
      map[copyDom[i].uuid] = i;
      copyDom[i].multipleData = [];
    }

    for (i = 0; i < copyDom.length; i += 1) {
      node = copyDom[i];

      if (targetUuid) {
        if (targetUuid === node.uuid) {
          roots.push(node);
        } else {
          if (node.parentId) {
            copyDom[map[node.parentId]].multipleData.push(node);
          }
        }
      } else {
        if (node.parentId) {
          copyDom[map[node.parentId]].multipleData.push(node);
        } else {
          roots.push(node);
        }
      }
    }
    if (targetUuid && roots.length > 0) {
      return roots[0];
    }

    return roots;
  };

  const findNearElementByPointer = (x, y) => {
    let Contents = Array.from(editorRef.current.querySelectorAll("[uuid]"));

    Contents = Contents.filter((content) => {
      const data = getEditComponentData(content.getAttribute("uuid"));
      if (data.tagName !== "multiple") {
        return content;
      }
    });

    if (Contents.length > 0) {
      const { nearEl, hoverEl } = findNearElementInChild(x, y, Contents);

      setNearElement(nearEl);
      setHoverElement(hoverEl);
    }
  };

  const findNearElementInChild = (x, y, Contents) => {
    let nearEl;
    let hoverEl;

    const equalXElements = Contents.filter((element) => {
      const { left, right } = element.getBoundingClientRect();
      if (left <= x && x <= right) {
        return element;
      }
    });

    if (equalXElements.length > 0) {
      equalXElements.map((element) => {
        if (!nearEl) {
          nearEl = element;
        }
        const nearElRect = nearEl.getBoundingClientRect();
        const elementRect = element.getBoundingClientRect();
        if (elementRect.top <= y && y <= elementRect.bottom) {
          nearEl = element;
          hoverEl = element;
        } else {
          if (Math.abs(nearElRect.y - y) > Math.abs(elementRect.y - y)) {
            nearEl = element;
          }
        }
      });
    } else {
      const equalYElements = Contents.filter((element) => {
        const { top, bottom } = element.getBoundingClientRect();
        if (top <= y && y <= bottom) {
          return element;
        }
      });

      if (equalYElements.length > 0) {
        equalYElements.map((element) => {
          if (!nearEl) {
            nearEl = element;
          }
          const nearElRect = nearEl.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();
          if (elementRect.left <= x && x <= elementRect.right) {
            nearEl = element;
            hoverEl = element;
          } else {
            if (Math.abs(nearElRect.x - x) > Math.abs(elementRect.x - x)) {
              nearEl = element;
            }
          }
        });
      }
    }
    return { nearEl, hoverEl };
  };

  const decideMovementSide = (x1, y1) => {
    const targetElement = hoverElement ? hoverElement : nearElement;

    if (targetElement && selectElements.length > 0) {
      const targetUuid = targetElement.getAttribute("uuid");
      let targetData = getEditComponentData(targetUuid);

      const parentData = targetData?.parentId
        ? getEditComponentData(targetData.parentId)
        : null;

      const { top, bottom, left, right } =
        targetElement.getBoundingClientRect();
      const list = [];
      let minDistance = null;

      if (top <= y1 && y1 <= bottom) {
        list.push({ position: "left", distance: Math.abs(left - x1) });
        list.push({ position: "right", distance: Math.abs(right - x1) });
      }

      if (left <= x1 && x1 <= right) {
        list.push({ position: "top", distance: Math.abs(top - y1) });
        list.push({ position: "bottom", distance: Math.abs(bottom - y1) });
      }

      if (list.length <= 0) return;

      list.map((item) => {
        if (!minDistance) {
          minDistance = item;
        } else {
          if (minDistance.distance > item.distance) {
            minDistance = item;
          }
        }
      });

      const { prevData, nextData } = getSiblingsData(targetData);
      //const topParentData = getTopParentData(targetData);
      //const topSiblingsData = getSiblingsData(topParentData);
      for (let i = 0; i < selectElements.length; i++) {
        if (targetUuid === selectElements[i].uuid) {
          if (
            hoverElement ||
            (!hoverElement &&
              (minDistance.position === "left" ||
                minDistance.position === "right"))
          ) {
            setMovementSide(null);
            return;
          }
        } else if (
          minDistance.position === "top" &&
          prevData?.uuid === selectElements[i].uuid
        ) {
          setMovementSide(null);
          return;
        } else if (
          minDistance.position === "bottom" &&
          nextData?.uuid === selectElements[i].uuid
        ) {
          if (targetData.tagName !== "checkbox") {
            setMovementSide(null);
            return;
          }
        }
      }

      let targetElementData = {};

      if (minDistance.position === "top" || minDistance.position === "bottom") {
        if (!hoverElement) {
          // ??????????????? ????????? ?????? ????????? Element??? ?????????
          const topParentData = getTopParentData(targetData);
          if (minDistance.position === "top") {
            const topParentSiblingsData = getSiblingsData(topParentData);
            //prevData??? ????????? ??????
            if (!topParentSiblingsData.prevData) {
              const includeElements = selectElements.filter(
                (element) => element.uuid === topParentData.uuid
              ).length;

              targetElementData.uuid =
                includeElements && topParentSiblingsData.nextData
                  ? topParentSiblingsData.nextData.uuid
                  : topParentData.uuid;
              targetElementData.position = minDistance.position;
            } else {
              targetElementData.uuid = topParentSiblingsData.prevData
                ? topParentSiblingsData.prevData.uuid
                : topParentData.uuid;
              targetElementData.position = topParentSiblingsData.prevData
                ? "bottom"
                : minDistance.position;
            }
          } else {
            const includeElements = selectElements.filter(
              (element) => element.uuid === topParentData.uuid
            ).length;
            targetElementData.uuid =
              includeElements && prevData ? prevData.uuid : topParentData.uuid;
            targetElementData.position = minDistance.position;
          }
        } else {
          if (minDistance.position === "top" && prevData) {
            targetElementData.uuid = prevData ? prevData.uuid : targetData.uuid;
            targetElementData.position = prevData
              ? "bottom"
              : minDistance.position;
          } else {
            targetElementData.uuid = targetData.uuid;
            targetElementData.position = minDistance.position;
          }
        }
        // ???, ???
      } else {
        targetElementData.uuid = targetData.uuid;
        targetElementData.position = minDistance.position;
      }

      if (parentData) {
        const parentSiblingData = getSiblingsData(parentData);
        if (
          minDistance.position === "left" ||
          minDistance.position === "right"
        ) {
          // left, right??? ??????????????? parent??? uuid??? ??????
          if (minDistance.position === "left" && parentSiblingData.prevData) {
            targetElementData.uuid = parentSiblingData.prevData.uuid;
            targetElementData.position = "right";
          } else {
            targetElementData.uuid = parentData.uuid;
          }
        }
      }

      const findTargerData = getEditComponentData(targetElementData.uuid);

      // ??????????????? ??????????????? ???????????? ??????
      if (
        findTargerData.tagName === "checkbox" &&
        targetElementData.position === "bottom"
      ) {
        const checkboxElement = editorRef.current.querySelector(
          `[uuid="${targetElementData.uuid}"]`
        );

        const checkboxTextElement =
          checkboxElement.querySelector(".checkbox-text");

        const { left, right } = checkboxTextElement.getBoundingClientRect();

        if (left <= x1 && x1 <= right) {
          targetElementData.movementSideType = "text";
        } else {
          targetElementData.movementSideType = "box";
        }
      }

      setMovementSide(targetElementData);
    } else {
      setMovementSide(null);
    }
  };

  const getSiblingsData = (data) => {
    const equalParentElements = editDom.filter(
      (element) => element.parentId === data.parentId
    );

    const targetIndex = equalParentElements.findIndex(
      (element) => element.uuid === data.uuid
    );

    const prevData = equalParentElements[targetIndex - 1];
    const nextData = equalParentElements[targetIndex + 1];

    return { prevData, nextData };
  };

  const getTopParentData = (data) => {
    if (data?.parentId) {
      const parentData = getEditComponentData(data.parentId);
      return getTopParentData(parentData);
    } else {
      return getEditComponentData(data.uuid);
    }
  };

  const moveElementData = (from, to) => {
    // ?????? ????????? ????????? ?????? ????????? ???????????? ??????
    const newEditDom = editDom.map((element) => Object.assign({}, element));

    let moveIndex;
    // ????????? Data??? ?????? index
    const fromIndex = newEditDom.findIndex((element) => {
      return from[0].uuid === element.uuid;
    });

    // from ???????????? ?????????
    const fromData = newEditDom.splice(fromIndex, 1)[0];

    const toIndex = newEditDom.findIndex((element) => {
      return element.uuid === to.uuid;
    });

    const findToData = newEditDom.filter((element) => {
      return to.uuid === element.uuid;
    })[0];

    if (toIndex === -1) return;
    //left??? top??? ????????? ?????? right??? bottom??? ???????????? ?????? ??????
    if (
      movementSide.position === "right" ||
      movementSide.position === "bottom"
    ) {
      moveIndex = toIndex + 1;
    } else {
      moveIndex = toIndex;
    }

    // ???????????? Element ????????? ?????? ??? ??????
    if (to.parentId) {
      // ?????? ???, ????????? ??????????????? multiple??? ?????? ???????????? multiple ????????? ?????? ??????????????????
      if (
        movementSide.position === "top" ||
        movementSide.position === "bottom"
      ) {
        // column????????? ????????? multiple??? ??????
        if (movementSide?.movementSideType === "text") {
          fromData.parentId = findToData.uuid;
        } else {
          const parentData = getEditComponentData(findToData.parentId);
          fromData.parentId = parentData.uuid;
        }
      } else {
        const rowChildElements = newEditDom.filter(
          (element) => element.parentId === to.parentId
        );

        const width = (100 / (rowChildElements.length + 1)).toFixed(4);

        // left right??? ?????? multiple??? ???????????? ???????????? ?????? parentId??? ????????????
        const newElement = makeNewElement({
          tagName: "multiple",
          direction: "column",
          width: parseFloat(width),
        });

        rowChildElements.map((element) => {
          const newWidth = (element.width / 100) * (100 - width);
          element.width = newWidth;
        });

        newElement.parentId = to.parentId;
        fromData.parentId = newElement.uuid;
        newEditDom.splice(moveIndex, 0, newElement);
      }
    } else {
      // ?????? ???????????? left, right??? ???????????? ??????
      if (
        movementSide.position === "left" ||
        movementSide.position === "right"
      ) {
        let elementSort = editDom.length;
        const newElement = makeNewElement({
          tagName: "multiple",
          direction: "row",
          sort: elementSort,
        });

        const newColumElement1 = makeNewElement({
          tagName: "multiple",
          direction: "column",
          width: 50,
          sort: elementSort + 1,
        });

        const newColumElement2 = makeNewElement({
          tagName: "multiple",
          direction: "column",
          width: 50,
          sort: elementSort + 2,
        });

        newColumElement1.parentId = newElement.uuid;
        newColumElement2.parentId = newElement.uuid;
        fromData.parentId = newColumElement1.uuid;
        findToData.parentId = newColumElement2.uuid;

        newEditDom.splice(moveIndex, 0, newElement);
        newEditDom.splice(moveIndex, 0, newColumElement2);
        newEditDom.splice(moveIndex, 0, newColumElement1);
      } else {
        if (movementSide?.movementSideType === "text") {
          fromData.parentId = findToData.uuid;
        } else {
          fromData.parentId = null;
        }
      }
    }

    newEditDom.splice(moveIndex, 0, fromData);

    // multiple?????? ????????? ????????? multiple ?????? ???????????? ??? ??????
    if (from[0].parentId) {
      const fromParentData = getEditComponentData(from[0].parentId);
      if (fromParentData.tagName !== "checkbox") {
        removeNullMultipleTag(newEditDom, from[0].uuid);
      }
    }

    modifyDomSave(newEditDom);
  };

  const removeNullMultipleTag = (newEditDom, uuid) => {
    const elementData = getEditComponentData(uuid);
    const columnData = getEditComponentData(elementData.parentId);

    // ?????? column??? Data??? ????????? ??????  [????????? ???????????? ????????? ???]
    const columnChildElements = newEditDom.filter(
      (element) => element.parentId === columnData.uuid
    );

    let rowChildElements = newEditDom.filter(
      (element) =>
        element.parentId === columnData.parentId &&
        element.uuid !== columnData.uuid
    );

    // ?????? column??? ???????????? ????????? colum ???????????????
    if (columnChildElements.length <= 1) {
      newEditDom.map((element, index) => {
        // column ??????
        if (element.uuid === columnData.uuid) {
          newEditDom.splice(index, 1);
          elementData.parentId = null;

          // ???????????? ?????? column??? Element??? parentId ??????
          columnChildElements.map((columnElement) => {
            columnElement.parentId = null;
          });

          // ????????? ???????????? ?????? ???????????? width?????? ????????? ?????????
          rowChildElements.map((rowElement) => {
            if (rowElement.uuid !== element.uuid) {
              const newWidth = (rowElement.width / (100 - element.width)) * 100;
              rowElement.width = newWidth;
            }
          });
        }
      });
    }

    if (rowChildElements.length <= 1) {
      const rowUuid = rowChildElements[0].parentId;
      const columnUuid = rowChildElements[0].uuid;

      newEditDom.map((element, index) => {
        // row ??????
        if (element.uuid === rowUuid) {
          newEditDom.splice(index, 1);
          columnData.parentId = null;
        }
      });

      newEditDom.map((element, index) => {
        if (element.uuid === columnUuid) {
          newEditDom.splice(index, 1);
          element.parentId = null;
        }
      });

      newEditDom.map((element) => {
        if (element.parentId === columnUuid) {
          element.parentId = null;
        }
      });
    }
  };

  const getEditComponentData = (uuid) => {
    const findData = editDom.filter((element) => {
      return uuid === element.uuid;
    });

    return Object.assign({}, findData[0]);
  };

  const windowMouseDown = (e) => {
    if (!popupYn && hoverElement && e.ctrlKey) {
      window.getSelection().removeAllRanges();
      const selectArray = [];
      const hoverUuid = hoverElement.getAttribute("uuid");

      const hoverTree = makeTree(editDom, hoverUuid);

      selectArray.push(hoverTree);
      setSelectElements(selectArray);
    }

    const { clientX, clientY } = e;
    setSelectPoint({ x: clientX, y: clientY });
    setContextMenuPoint({ x: clientX, y: clientY });
  };

  const windowMouseMove = (e) => {
    const { clientX, clientY } = e;
    findNearElementByPointer(clientX, clientY);

    // ????????? ?????? ????????? ?????? ???????????? ????????? ??????
    if (selectPoint) {
      const distance = Math.sqrt(
        Math.pow(Math.abs(clientX - selectPoint.x), 2) +
          Math.pow(Math.abs(clientY - selectPoint.y), 2)
      );

      // ?????? ????????? 5??????????????? ???????????? ??????
      if (!draggable && distance < 5) {
        return;
      }

      setDraggable(true);
    }

    // ????????? Element??? ???????????? ????????? ?????????
    if (selectElements.length > 0) {
      window.getSelection().removeAllRanges();

      overlayRef.current.style.left = clientX - 10 + "px";
      overlayRef.current.style.top = clientY - 10 + "px";

      decideMovementSide(clientX, clientY);
    }
  };

  const windowMouseUp = (e) => {
    if (movementSide?.uuid && selectElements.length > 0) {
      const hoverData = getEditComponentData(movementSide.uuid);
      moveElementData(selectElements, hoverData);
    } else {
      const { clientX, clientY } = e;
      const distance = Math.sqrt(
        Math.pow(Math.abs(clientX - selectPoint.x), 2) +
          Math.pow(Math.abs(clientY - selectPoint.y), 2)
      );

      if (distance < 10) {
        changePopupYn(e);
      }
    }

    setSelectElements([]);
    setDraggable(false);
    setMovementSide(null);
    setSelectPoint(null);
    setContextMenuYn(false);
  };

  const makeNewElement = ({ tagName, direction, width, sort }) => {
    const newUuid = uuidv4();
    // ????????? ??????????????? ?????????????????? ????????????
    const newElement = {
      pathId: pathId,
      uuid: newUuid,
      tagName: tagName,
      html: "",
      parentId: null,
      direction: direction,
      checkYn: false,
      width: width ? width : 100,
      sort: sort ? sort : editDom.length,
    };

    return newElement;
  };

  const modifyEditDom = (uuid, data) => {
    let newEditDom = editDom.map((element) => Object.assign({}, element));

    const keys = Object.keys(data);

    newEditDom = newEditDom.map((dom) => {
      if (dom.tagName === "multiple") {
        findElementFromChild(dom, uuid, data.html);
      } else {
        if (dom.uuid === uuid) {
          if (keys.length > 0) {
            keys.map((key) => {
              dom[key] = data[key];
            });
          }
        }
      }
      return dom;
    });
    modifyDomSave(newEditDom);
    //setEditDom(newEditDom);
  };

  const findElementFromChild = (dom, uuid, html) => {
    dom?.multipleData?.data.map((element) => {
      if (element.tagName === "multiple") {
        findElementFromChild(element, uuid, html);
      } else {
        if (element.uuid === uuid) {
          element.html = html;
        }
      }
    });
  };

  const changePopupYn = (e) => {
    // 2. ????????? ?????? ?????? ?????? [???,??? ?????? ?????? ????????? ???????????????]
    const hoverData = getEditComponentData(hoverElement?.getAttribute("uuid"));
    const filePopup = e.target.closest(".filePopup");

    // ?????? ????????? ????????? ?????????????????? ??????X ???????????? ????????? ?????? ?????????????????? X
    if (e.type === "mouseup" && filePopup) {
      return;
    }

    if (e.button === 0) {
      // ??????????????? ?????? ??????
      if (hoverData.tagName === "image") {
        if (!popupYn) {
          const { bottom, left, width } = hoverElement?.getBoundingClientRect();
          let popupY = 0;
          let popupX = 0;

          if (bottom + 100 > window.innerHeight) {
            popupY = window.innerHeight - 110;
          } else {
            popupY = bottom;
          }

          const popupRight = 410 + left;

          if (popupRight > window.innerWidth) {
            popupX = left - (popupRight - window.innerWidth);
          } else {
            const newX = left + (width - 400) / 2;

            popupX = newX <= 20 ? left : newX;
          }

          setFileData({ uuid: hoverData.uuid, y: popupY, x: popupX });
        }
        setPopupYn(!popupYn);
      } else {
        // ????????? ????????? ????????? ??? ??????
        if (popupYn) {
          setPopupYn(!popupYn);
        }
      }
    } else {
      // ?????????
      if (popupYn) {
        setPopupYn(!popupYn);
      }
    }
  };

  useEffect(() => {
    window.addEventListener("mousedown", windowMouseDown);
    window.addEventListener("mouseup", windowMouseUp);
    window.addEventListener("mousemove", windowMouseMove);
    return () => {
      window.removeEventListener("mousedown", windowMouseDown);
      window.removeEventListener("mouseup", windowMouseUp);
      window.removeEventListener("mousemove", windowMouseMove);
    };
  });

  useEffect(() => {
    const newElement = Array.from(
      editorRef.current.querySelectorAll("[uuid]")
    ).filter((item) => {
      const elementUuid = item.getAttribute("uuid");
      if (elementUuid === newUuid) {
        return item;
      }
    });

    if (newElement.length > 0) {
      newElement[0].children[0].focus();
    }
  }, [newUuid]);

  return (
    <EditorWrapper
      onContextMenu={(e) => {
        e.preventDefault();
        setContextMenuYn(true);
      }}
    >
      <CloseButton
        onClick={() => {
          nav("/");
        }}
      >
        <CloseButtonRotateWrapper>+</CloseButtonRotateWrapper>
      </CloseButton>
      <CardEditorContentWrapper
        ref={editorRef}
        onMouseUp={(e) => {
          if (
            e.button === 0 &&
            e.target === e.currentTarget &&
            !draggable &&
            !hoverElement
          ) {
            // ???????????????, ??????????????? ????????? ????????? ????????? Element??? ????????????
            // ????????? Element ??????
            const newElement = makeNewElement({ tagName: "div" });
            setEditDom((prevEditDom) => [...prevEditDom, newElement]);
            setNewUuid(newElement.uuid);
          }
        }}
      >
        {makeTree(editDom).map((element) => (
          <EditBranchComponent
            key={element.uuid}
            data={element}
            hoverUuid={!popupYn ? hoverElement?.getAttribute("uuid") : null}
            modifyEditDom={modifyEditDom}
            movementSide={movementSide}
          />
        ))}
      </CardEditorContentWrapper>
      {/* ???????????? ?????? 
      ?????? ????????? ???????????????, ????????? Element??? ????????? ?????????????????? zindex??? ??? ?????? ?????????
      */}
      <OverlayWrapper
        zindex={popupYn || (selectElements.length > 0 && draggable)}
      >
        <OverlayContentWrapper>
          <OverlayContentContents>
            <div ref={overlayRef}>
              {draggable &&
                selectElements?.map((element) => {
                  const selectElement = getEditComponentData(element?.parentId);
                  const overlayWidth = selectElement.width;
                  return (
                    <EditBranchComponent
                      key={element.uuid}
                      data={{ ...element, uuid: null }}
                      overlayWidth={overlayWidth}
                    ></EditBranchComponent>
                  );
                })}
            </div>
            {popupYn ? (
              <div
                onContextMenu={(e) => {
                  e.preventDefault();
                }}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <PopupMenu
                  popupRef={popupRef}
                  changePopupYn={changePopupYn}
                  fileData={fileData}
                  modifyEditDom={modifyEditDom}
                />
              </div>
            ) : null}

            {contextMenuYn ? (
              <ContextMenuPopup pointer={contextMenuPoint} />
            ) : null}
          </OverlayContentContents>
        </OverlayContentWrapper>
      </OverlayWrapper>
    </EditorWrapper>
  );
};

export default CardEditor;
