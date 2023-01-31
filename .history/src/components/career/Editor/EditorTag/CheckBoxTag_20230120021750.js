import React from "react";
import styled from "@emotion/styled";
import { useRef } from "react";

const CheckBoxTagWrapper = styled.div`
  line-height: 1.5;
  padding: 0 0.4rem;
  color: rgb(55, 53, 47);

  :hover {
    background: rgba(55, 53, 47, 0.08);
  }
`;
const CheckBoxTag = ({ style, data }) => {
  const editRef = useRef(null);

  return (
    <CheckBoxTagWrapper uuid={data.uuid} style={{ position: "relative" }}>
      <div style={{ display: "flex" }}>
        <div>ㅁ</div>
        <div
          style={{ outline: "none" }}
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
            //setState((prev) => ({ ...prev, html: e.target.textContent }));
            //modifyEditDom(data.uuid, { html: e.target.textContent });
          }}
        />
      </div>
    </CheckBoxTagWrapper>
  );
};

export default CheckBoxTag;
