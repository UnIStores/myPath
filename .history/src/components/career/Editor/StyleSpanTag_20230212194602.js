import React from "react";

const StyleSpanTag = ({ data }) => {
  console.log("data : ", data);

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
  return <span>{data.html}</span>;
};

export default StyleSpanTag;
