import React from "react";
import styled from "@emotion/styled";
import EditComponent from "./EditComponent";

const EditorWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: white;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: 0.5s;
  border-radius: 1rem;
  padding: 1rem;
  background-color: #f9f4e9;
  font-size: 1.6rem;
`;

const CardTitle = styled.div`
  font-size: 4rem;
`;

const CardEditor = () => {
  return (
    <EditorWrapper>
      <CardTitle>
        <EditComponent
          tagName="h1"
          html=""
          placeholder="제목을 입력하세요"
        ></EditComponent>
      </CardTitle>
      <div style={{ flex: 1 }}>
        <EditComponent tagName="div" html=""></EditComponent>
        <EditComponent tagName="div" html=""></EditComponent>
      </div>
    </EditorWrapper>
  );
};

export default CardEditor;
