import React from "react";
import styled from "@emotion/styled";
import CardEditor from "../components/career/Editor/CardEditor";

const AddPathWrapper = styled.div`
  width: 100%;
  flex: 1;
  overflow: hidden;
`;

const PathWrite = () => {
  return (
    <AddPathWrapper>
      <CardEditor />
    </AddPathWrapper>
  );
};

export default PathWrite;
