import React from "react";
import styled from "@emotion/styled";
import { useState } from "react";

const ContextMenuWarpper = styled.div`
  position: absolute;
  left: ${(props) => props.x + "px"};
  top: ${(props) => props.y + "px"};
  border-radius: 0.5rem;
  //padding: 0.5rem;
  border: 1px solid rgba(55, 53, 47, 0.2);
  background: white;
`;

const Menu = styled.div`
  width: 20rem;
  font-size: 1.7rem;
  line-height: 2.8rem;
  padding-left: 0.5rem;
  :hover {
    border-radius: 0.5rem;
    background: rgba(55, 53, 47, 0.1);
  }
`;

const TextMenuWrapper = styled.div`
  display: flex;
  padding: 0.5rem;
  border-bottom: 1px solid black;
  //gap: 1rem;
`;

const TextMenu = styled.div`
  padding: 0 0.5rem;
`;

const TextSizeSelect = styled.select`
  outline: "none";
`;

const ContextMenuPopup = ({
  pointer,
  changeContextMenuYn,
  modifyEditDom,
  hoverUuid,
}) => {
  const [uuid, setUuid] = useState(hoverUuid);

  const deleteMenu = () => {
    modifyEditDom(uuid, {}, "delete");
    changeContextMenuYn(false);
  };

  const changeMenu = () => {
    const tagName = prompt("tagName", "div");
    modifyEditDom(uuid, { tagName: tagName });
    changeContextMenuYn(false);
  };
  return (
    <ContextMenuWarpper x={pointer?.x} y={pointer?.y} className="contextMenu">
      <TextMenuWrapper>
        <TextMenu>
          <TextSizeSelect>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
          </TextSizeSelect>
        </TextMenu>
        <TextMenu>색상</TextMenu>
        <TextMenu>글꼴</TextMenu>
        <TextMenu>B</TextMenu>
        <TextMenu>i</TextMenu>
        <TextMenu>U</TextMenu>
        <TextMenu>S</TextMenu>
      </TextMenuWrapper>
      <div style={{ padding: "0.5rem" }}>
        <Menu
          onClick={(e) => {
            deleteMenu();
          }}
        >
          삭제
        </Menu>
        <Menu
          onClick={(e) => {
            console.log("변경");
            changeMenu();
          }}
        >
          변경
        </Menu>
      </div>
    </ContextMenuWarpper>
  );
};

export default ContextMenuPopup;
