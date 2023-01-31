import React from "react";
import EditBranchComponent from "../EditBranchComponent";
import EditComponent from "../EditComponent";

const MultipleTag = ({ modifyEditDom, movementSide, data, style }) => {
  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <div style={{ display: "flex", flexDirection: data.direction }}>
        {data.multipleData.map((element, index) => (
          <div
            key={index}
            style={{
              padding: data.direction === "row" ? "0.5rem 0" : null,
              width:
                data.direction === "row" && element.width
                  ? `calc(100% * ${element.width} / 100)`
                  : "100%",
            }}
          >
            {element.tagName === "multiple" &&
            element.multipleData.length > 0 ? (
              <EditBranchComponent
                key={element.uuid}
                data={element}
                modifyEditDom={modifyEditDom}
                movementSide={movementSide}
              />
            ) : (
              <EditComponent
                key={element.uuid}
                data={element}
                modifyEditDom={modifyEditDom}
                movementSide={movementSide}
              />
            )}
          </div>
        ))}
      </div>
      {movementSide?.uuid === data.uuid ? (
        <div style={getMovementStyle(movementSide?.position)}></div>
      ) : null}
    </div>
  );
};

export default MultipleTag;
