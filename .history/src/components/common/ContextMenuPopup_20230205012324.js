import React from "react";
import styled from "@emotion/styled";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"}; ;
`;

const MenuWarpper = styled.div``;

const ContextMenuPopup = ({ pointer }) => {
  console.log(pointer);

  return (
    <ContextMenuWarpper x={pointer?.x} y={pointer?.y}>
      <div>
        <MenuWarpper>삭제</MenuWarpper>
        <MenuWarpper>변경</MenuWarpper>
      </div>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
