import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { useNavigate } from "react-router-dom";

const PathWrapper = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  margin-top: 1rem;
`;

const PathFlexWrapper = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
`;

const PathCard = styled.div`
  width: 30rem;
  min-height: 15rem;
  border-radius: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

const PathCardTitle = styled.span`
  display: block;
  font-size: 2.5rem;
  margin: 1rem;
  word-break: break-all;
`;

const AddButtonWarpper = styled.div`
  height: 5rem;
  margin: 1rem 0;
`;

const AddButton = styled.div`
  width: 5rem;
  height: 5rem;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  cursor: pointer;
  margin-left: auto;
`;

const AddButtonRotateWrapper = styled.div`
  transform: ${(props) => (props.isPop ? "rotate(45deg)" : "")};
  width: 100%;
  height: 100%;
  transition: 0.2s;
  & span {
    font-size: 4rem;
    line-height: 4rem;
  }
`;

const AddPathWrapper = styled.div`
  width: 100%;
  height: ${(props) => (props.isPop ? "calc(100% - 8rem)" : "0rem")};
  position: absolute;
  margin-top: 1rem;
  transition: 0.5s;
  overflow: hidden;
`;

const cardList = [
  { id: 1, title: "테크마인드" },
  { id: 2, title: "유밥" },
  { id: 3, title: "Career1" },
  { id: 4, title: "Career2" },
  { id: 5, title: "Career3" },
  { id: 6, title: "Career4" },
  { id: 7, title: "Career5" },
  { id: 8, title: "Career6" },
];

const PathList = () => {
  let columnCount = Math.floor(window.innerWidth / 320);
  const [column, setColumn] = useState(columnCount ? columnCount : 1);
  const nav = useNavigate();
  const [isPop, setIsPop] = useState(false);

  const changePathColumn = () => {
    columnCount = Math.floor(window.innerWidth / 320);
    setColumn(columnCount ? columnCount : 1);
  };

  const movePathDetail = (pathId) => {
    nav("/pathDetail?pathId=" + pathId);
  };

  useEffect(() => {
    window.addEventListener("resize", changePathColumn);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        position: "relative",
      }}
    >
      <AddButtonWarpper>
        <div>
          <AddButton
            onClick={() => {
              setIsPop(!isPop);
            }}
          >
            <AddButtonRotateWrapper isPop={isPop}>
              <span>+</span>
            </AddButtonRotateWrapper>
          </AddButton>
        </div>
        <AddPathWrapper isPop={isPop}>
          <div
            style={{
              height: "100%",
              backgroundColor: "white",
              border: "1px solid rgba(0, 0, 0, 0.1)",
              transition: "0.5s",
              borderRadius: "1rem",
            }}
          ></div>
        </AddPathWrapper>
      </AddButtonWarpper>
      <PathWrapper>
        {Array(Math.ceil(cardList.length / column))
          .fill(0)
          .map((_, index) => (
            <PathFlexWrapper key={index}>
              {cardList
                .slice(index * column, index * column + column)
                .map((card) => (
                  <PathCard
                    key={card.id}
                    onClick={() => {
                      movePathDetail(card.id);
                    }}
                  >
                    <PathCardTitle>{card.title}</PathCardTitle>
                  </PathCard>
                ))}
            </PathFlexWrapper>
          ))}
      </PathWrapper>
    </div>
  );
};

export default PathList;
