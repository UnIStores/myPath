import React from "react";
import { useState } from "react";
import styled from "@emotion/styled";

const StyleSpan = styled.span`
  // 여기부턴 태그 설정 스타일
  font-size: ${(props) =>
    props?.styleData?.fontSize ? props?.styleData?.fontSize + "px" : null};
  color: ${(props) =>
    props?.styleData?.color ? props?.styleData?.color : null};
  background: ${(props) =>
    props?.styleData?.background ? props?.styleData?.background : null};
  font-weight: ${(props) => (props?.styleData?.bold ? "bold" : null)};
  font-style: ${(props) => (props?.styleData?.italic ? "italic" : null)};
`;

const StyleSpanTag = ({ data }) => {
  const [state, setState] = useState(data);
  // console.log("data.html : ", data.html);
  // console.log(data.html.split(/<[^>]*>?/g));
  // const testHtml = data.html.findIndex((elem) => /<[^>]*>?/g.test(elem));
  // console.log("testHtml: ", testHtml);

  const spanList = [];

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
  return (
    <>
      <StyleSpan
        styleData={data?.styleData}
        dangerouslySetInnerHTML={{ __html: data.html }}
      ></StyleSpan>
    </>
  );
};

export default StyleSpanTag;
