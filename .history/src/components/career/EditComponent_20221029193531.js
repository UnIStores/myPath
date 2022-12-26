import React, { useRef, useState } from "react";
import ContentEditable from "react-contenteditable";

const EditComponent = ({ block }) => {
  const [state, setState] = useState({
    html: block.contents,
    tagName: "div",
  });
  const ref = useRef();
  console.log("ad");

  return (
    <ContentEditable
      innerRef={ref}
      html={state.html}
      disabled={false}
      onChange={(e) => setState((prev) => ({ ...prev, html: e.target.value }))}
    />
  );
};

export default EditComponent;
