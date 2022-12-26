import React from "react";
import styled from "@emotion/styled";

const AddPathWrapper = styled.div`
  width: 100%;
  height: ${(props) => (props.isPop ? "calc(100% - 8rem)" : "0rem")};
  position: absolute;
  margin-top: 1rem;
  transition: 0.5s;
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