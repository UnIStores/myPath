import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

const StyleSpanTag = ({ data }) => {
  console.log("data : ", data);
  const [state, setState] = useState(data);
  // styleData={data?.styleData}

  //   {data.styleData?.bold ||
  //     data.styleData?.italic ||
  //     data.styleData?.underLine ||
  //     data.styleData?.strikethrough ? (
  //       <span
  //         style={{
  //           borderBottom: data.styleData?.underLine
  //             ? "1px solid black"
  //             : null,
  //           textDecoration: data.styleData?.strikethrough
  //             ? "line-through"
  //             : null,
  //         }}
  //       >
  //         {html}
  //       </span>
  //     ) : (
  //       html
  //     )}
  return <span>{state.html}</span>;
};

export default StyleSpanTag;
