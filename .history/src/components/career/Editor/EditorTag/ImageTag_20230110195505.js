import React from "react";
import styled from "@emotion/styled";

const TagWrapper = styled.div`
  outline: none;
  line-height: 1.5;
  padding: 0 0.4rem;
`;
const ImageTag = ({ hoverUuid, modifyEditDom, movementSide, data }) => {
  console.log("data : ", data);
  return (
    <TagWrapper>
      <div uuid={data.uuid} style={{ position: "relative" }}>
        <path d="M1,4v22h28V4H1z M27,24H3V6h24V24z M18,10l-5,6l-2-2l-6,8h20L18,10z M11.216,17.045l1.918,1.918l4.576-5.491L21.518,20H9 L11.216,17.045z M7,12c1.104,0,2-0.896,2-2S8.104,8,7,8s-2,0.896-2,2S5.896,12,7,12z"></path>
        이미지를 등록해주세요.
      </div>
    </TagWrapper>
  );
};

export default ImageTag;