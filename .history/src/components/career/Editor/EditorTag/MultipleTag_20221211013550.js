import React from "react";
import EditBranchComponent from "../EditBranchComponent";
import EditComponent from "../EditComponent";

const MultipleTag = ({ hoverUuid, modifyEditDom, movementSide, data }) => {
  return (
    <div uuid={data.uuid} style={{ position: "relative", padding: "0.5rem 0" }}>
      <div style={{ display: "flex", flexDirection: data.direction }}>
        {data.multipleData.map((element, index) => (
          <div
            key={index}
            style={{
              width:
                data.direction === "row" && element.width
                  ? `calc(100% * ${element.width} / 100)`
                  : 100 / data.multipleData.length + "%",
            }}
          >
            {element.tagName === "multiple" &&
            element.multipleData.length > 0 ? (
              <EditBranchComponent
                key={element.uuid}
                data={element}
                //uuid={element.uuid}
                //tagName={element.tagName ? element.tagName : "div"}
                //html={element?.html}
                //defaultPlaceholder={element.defaultPlaceholder}
                //placeholder={element.placeholder}
                //multipleData={element.multipleData}
                modifyEditDom={modifyEditDom}
                hoverUuid={hoverUuid}
                movementSide={movementSide}
              />
            ) : (
              <EditComponent
                key={element.uuid}
                data={element}
                hoverUuid={hoverUuid}
                //uuid={element.uuid}
                //tagName={element.tagName || "div"}
                //html={element.html}
                //defaultPlaceHolder={element.defaultPlaceHolder}
                //placeholder={element.placeholder}
                modifyEditDom={modifyEditDom}
                movementSide={movementSide}
              />
            )}
          </div>
        ))}
      </div>
      {/* {children} */}
    </div>
  );
};

export default MultipleTag;
