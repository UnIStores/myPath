import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";
import styled from "@emotion/styled";

const EditableTag = styled(ContentEditable)`
  outline: none;
`;

const EditComponent = ({
  tagName,
  html,
  defaultPlaceHolder,
  placeholder,
  onFocus,
  onBlur,
}) => {
  const [state, setState] = useState({
    html: "",
  });
  const ref = useRef();

  return (
    <EditableTag
      innerRef={ref}
      html={state.html}
      disabled={false}
      placeholder={defaultPlaceHolder ? defaultPlaceHolder : placeholder}
      tagName={tagName}
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditComponent;
