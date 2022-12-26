import React, { useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";
import { useEffect } from "react";
import { useCallback } from "react";

const EditableTag = styled(ContentEditable)`
  outline: none;
  line-height: 1.5;
`;

const EditComponent = ({
  uuid,
  hoverUuid,
  tagName,
  html,
  defaultPlaceHolder,
  placeholder,
  children,
  modifyEditDom,
}) => {
  const [state, setState] = useState({
    html: html ? html : "",
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(defaultPlaceHolder);

  useEffect(() => {
    if (modifyEditDom) {
      modifyEditDom(uuid, state.html);
    }
  }, [state.html]);

  return (
    <div uuid={uuid} style={{ position: "relative", paddingLeft: "1.5rem" }}>
      <EditableTag
        html={state.html}
        style={{ background: hoverUuid === uuid ? "rgba(55,53,47,0.08)" : "" }}
        disabled={false}
        placeholder={editPlaceHolder}
        tagName={tagName}
        onFocus={() => {
          if (placeholder) {
            setEditPlaceHolder(placeholder);
          }
        }}
        onBlur={() => {
          setEditPlaceHolder(defaultPlaceHolder);
        }}
        onChange={(e) => {
          setState((prev) => ({ ...prev, html: e.target.value }));
        }}
      />
      {children}
    </div>
  );
};

export default EditComponent;
