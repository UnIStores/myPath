import React, { useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";

const EditableTag = styled(ContentEditable)`
  outline: none;
  line-height: 1.5;
`;

const EditComponent = ({
  uuid,
  tagName,
  html,
  defaultPlaceHolder,
  placeholder,
  children,
}) => {
  const [state, setState] = useState({
    html: html ? html : "",
  });
  const [editPlaceHolder, setEditPlaceHolder] = useState(defaultPlaceHolder);
  return (
    <div uuid={uuid} style={{ position: "relative" }}>
      <EditableTag
        html={state.html}
        disabled={false}
        onMouseEnter={() => {
          console.log("mouseenter");
        }}
        onMouseLeave={() => {
          console.log("leave");
        }}
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
        onChange={(e) =>
          setState((prev) => ({ ...prev, html: e.target.value }))
        }
      />
      {children}
    </div>
  );
};

export default EditComponent;