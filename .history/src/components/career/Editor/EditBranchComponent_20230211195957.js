import React from "react";
import EditComponent from "./EditComponent";
import ImageTag from "./EditorTag/ImageTag";
import MultipleTag from "./EditorTag/MultipleTag";
import CheckBoxTag from "./EditorTag/CheckBoxTag";

const EditBranchComponent = ({
  modifyEditDom,
  movementSide,
  data,
  hoverUuid,
  overlayWidth,
}) => {
  const BranchTab = () => {
    let returnComponent;
    const getMovementStyle = (movementData) => {
      const side = movementData.position;
      const styleObject = {
        position: "absolute",
        background: "rgba(35,131,226,0.43)",
      };
      if (side === "top") {
        styleObject.top = "-4px";
        styleObject.left = 0;
        styleObject.width = "100%";
        styleObject.height = "4px";
      } else if (side === "bottom") {
        styleObject.bottom = "4px";
        styleObject.left = 0;
        styleObject.width = "100%";
        styleObject.height = "4px";
      } else if (side === "left") {
        styleObject.top = 0;
        styleObject.left = "-4px";
        styleObject.width = "4px";
        styleObject.height = "100%";
      } else if (side === "right") {
        styleObject.top = 0;
        styleObject.right = "-4px";
        styleObject.width = "4px";
        styleObject.height = "100%";
      }
      return styleObject;
    };

    const style =
      data?.uuid === movementSide?.uuid ? getMovementStyle(movementSide) : null;
    if (data?.tagName === "multiple") {
      returnComponent = (
        <MultipleTag
          data={data}
          modifyEditDom={modifyEditDom}
          movementSide={movementSide}
          hoverUuid={hoverUuid}
          style={style}
        />
      );
    } else if (data?.tagName === "image") {
      returnComponent = (
        <ImageTag
          data={data}
          style={style}
          overlayWidth={overlayWidth}
          hoverUuid={hoverUuid}
        />
      );
    } else if (data?.tagName === "checkbox") {
      returnComponent = (
        <CheckBoxTag
          hoverUuid={hoverUuid}
          movementSide={movementSide}
          modifyEditDom={modifyEditDom}
          data={data}
          style={style}
          overlayWidth={overlayWidth}
        />
      );
    } else {
      returnComponent = (
        <EditComponent
          data={data}
          modifyEditDom={modifyEditDom}
          style={style}
          hoverUuid={hoverUuid}
          overlayWidth={overlayWidth}
        />
      );
    }
    return returnComponent;
  };
  return BranchTab();
};

export default EditBranchComponent;
