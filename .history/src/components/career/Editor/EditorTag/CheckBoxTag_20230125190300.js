import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";
import { useState } from "react";
import EditBranchComponent from "../EditBranchComponent";

const CheckBoxTagWrapper = styled.div`
  position: relative;
  line-height: 1.5;
  padding: 0.2rem 0.4rem;
  color: rgb(55, 53, 47);
  background: ${(props) => (props.hoverYn ? "rgba(55, 53, 47, 0.08)" : "")};

  /* :hover {
    background: rgba(55, 53, 47, 0.08);
  } */
`;
const CheckBoxTag = ({ style, data, hoverUuid, movementSide }) => {
  const [state, setState] = useState({
    html: data.html ? data.html : "",
    checkYn: data.checkYn ? data.checkYn : false,
  });
  const editRef = useRef(null);

  return (
    <div uuid={data.uuid}>
      <CheckBoxTagWrapper hoverYn={hoverUuid === data.uuid}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "2rem",
              height: "2.4rem",
              marginRight: "0.4rem",
              cursor: "pointer",
            }}
            onClick={() => {
              setCheckYn(!checkYn);
              setState((prev) => ({ ...prev, checkYn: !checkYn }));
            }}
          >
            <div style={{ width: "1.6rem", height: "1.6rem" }}>
              {!state.checkYn ? (
                <svg
                  viewBox="0 0 16 16"
                  style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                    flexshrink: 0,
                    backfacevisibility: "hidden",
                  }}
                >
                  <path d="M1.5,1.5 L1.5,14.5 L14.5,14.5 L14.5,1.5 L1.5,1.5 Z M0,0 L16,0 L16,16 L0,16 L0,0 Z"></path>
                </svg>
              ) : (
                <div
                  style={{
                    background: "rgb(35, 131, 226)",
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <svg
                    viewBox="0 0 14 14"
                    style={{
                      width: "12px",
                      height: "12px",
                      display: "block",
                      fill: "white",
                      flexshrink: 0,
                      backfacevisibility: "hidden",
                    }}
                  >
                    <polygon points="5.5 11.9993304 14 3.49933039 12.5 2 5.5 8.99933039 1.5 4.9968652 0 6.49933039"></polygon>
                  </svg>
                </div>
              )}
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div
              style={{ outline: "none", flex: 1 }}
              ref={editRef}
              contentEditable={true}
              suppressContentEditableWarning={true}
              onDragStart={(e) => {
                e.preventDefault();
              }}
              onContextMenu={(e) => {
                e.preventDefault();
              }}
              onAuxClick={(e) => {
                // 오른쪽 클릭
                e.preventDefault();
              }}
              placeholder="할 일"
              onInput={(e) => {
                setState((prev) => ({ ...prev, html: e.target.textContent }));
                modifyEditDom(data.uuid, { html: e.target.textContent });
              }}
            />
            {data.multipleData.map((element, index) => (
              <div key={index} style={{}}>
                <EditBranchComponent
                  key={element.uuid}
                  data={element}
                  hoverUuid={hoverUuid}
                  // modifyEditDom={modifyEditDom}
                  movementSide={movementSide}
                />
              </div>
            ))}
          </div>
        </div>
        {style ? <div style={style}></div> : null}
      </CheckBoxTagWrapper>
    </div>
  );
};

export default CheckBoxTag;