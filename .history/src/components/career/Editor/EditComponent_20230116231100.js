import React, { useState } from "react";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { useRef } from "react";

const EditableTag = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 0 0.4rem;
  :hover {
    background: rgba(55, 53, 47, 0.08);
  }
`;

const EditComponent = ({ modifyEditDom, movementSide, data, style }) => {
  const [state, setState] = useState({
    html: data.html ? data.html : "",
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(
    data.defaultPlaceHolder
  );
  const editRef = useRef(null);
  console.log("style : ", style);

  useEffect(() => {
    editRef.current.textContent = state.html;
  }, [state]);

  return (
    <div uuid={data.uuid} style={{ position: "relative" }}>
      <EditableTag
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
        placeholder={editPlaceHolder}
        onFocus={() => {
          if (data.placeholder) {
            setEditPlaceHolder(data.placeholder);
          }
        }}
        onBlur={() => {
          setEditPlaceHolder(data.defaultPlaceHolder);
        }}
        onInput={(e) => {
          setState((prev) => ({ ...prev, html: e.target.textContent }));
          modifyEditDom(data.uuid, { html: e.target.textContent });
        }}
      />
      {movementSide?.uuid === data.uuid ? <div style={style}></div> : null}
    </div>
  );
};

export default EditComponent;