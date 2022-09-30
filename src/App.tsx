import { useState } from "react";
import styled from "styled-components";
import {
  getJSDocDeprecatedTag,
  idText,
  isJsxClosingElement,
  isTemplateExpression,
} from "typescript";
import { ReactComponent as CheckIcon } from "./icons/check.svg";

// 1. App 컴포넌트
function App() {
  const INIT_DATA = [
    { id: 0, content: "#1 할 일 ", isCheck: false },
    { id: 1, content: "#2 할 일 ", isCheck: false },
    { id: 2, content: "#3 할 일 ", isCheck: false },
  ];

  const [todoListData, setTodoListData] = useState(INIT_DATA);
  const [inputValue, setInputValue] = useState("");

  // 1) Header - 오늘 날짜
  const getToday = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const date = today.getDate();
    const day = today.getDay();
    // 일 0
    const dayList = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return {
      today: `Today's ${year}.${month}.${date} 💗 `,
      dayOfWeek: `${dayList[day]}day`,
    };
  };

  // 2) 할 일 몇 개 남았는지 알려주는 변수
  const notCheckList = todoListData.filter((v) => !v.isCheck).length;
  // length : 길이 = 개수

  // 3) 토글 함수 : 체크박스 만들어서, 체크하기
  const onToggleData = (i: number) => {
    const copy = [...todoListData];
    // 얕은 복사 사용해야, 원본 데이터(todoListData) 건들지 않고, 수정가능
    // --> 변화 발생 --> rendering
    copy[i].isCheck = !copy[i].isCheck;
    // 얕은 복사한 todoListData 배열의 isCheck 속성 변경
    // isCheck : false <--> true
    setTodoListData(copy);
    // set 함수 사용해서 --> 꼭 update 해줘야 !!! --> 인식해서 rerendering
  };

  // --------------------------------------------
  // 2. 랜더링
  return (
    <Container>
      <Main>
        <Header>
          <div>
            {/* 1) 오늘 날짜 */}
            <h2>{getToday().today}</h2>
            <h3>{getToday().dayOfWeek}</h3>
            <br></br>

            {/* 남은 할일 변수 */}
            <p>할 일이 벌써 {notCheckList}개 밖에 안남았잖아 ? 👀 </p>
          </div>
        </Header>
        <Content>
          <ul>
            {/* 토글함수 */}
            {todoListData.map((v, i) => (
              <Li
                key={v.id}
                onClick={() => onToggleData(i)}
                isCheck={v.isCheck}
              >
                {/* 체크박스 */}
                <CheckBox isCheck={v.isCheck}>
                  {v.isCheck && (
                    <CheckIcon color="#fff" width={16} height={16} />
                  )}
                </CheckBox>

                {/* 할일 리스트 내용 */}
                <p>{v.content}</p>

                {/* Delete */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    const copy = [...todoListData];
                    copy.splice(i, 1);
                    setTodoListData(copy);
                  }}
                >
                  삭제
                </span>
              </Li>
            ))}
          </ul>
        </Content>

        <Footer>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // 없으면 검색창 클릭해도 create(추가생성)됨
              if (!inputValue.length) {
                return;
              }
              // 빈칸이라면 create 안됨

              const copy = [...todoListData];
              copy.push({
                id: new Date().getTime(),
                content: inputValue,
                isCheck: false,
              });
              setTodoListData(copy);
              setInputValue("");
              // create하고 나면 검색창 초기화
            }}
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            {/* 키보드에 입력하는 value을 계속 업데이트 */}
            <button type="submit">추가</button>
          </form>
        </Footer>
      </Main>
    </Container>
  );
}

export default App;

// CSS

const Container = styled.div`
  position: absolute;
  // absolute: 자식 -- 부모 기준으로 배치
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #faf0e6;
  height: 100%;
  width: 100%;
`;

const Main = styled.section`
  width: 480px;
  height: 80%;
  background-color: white;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  height: 160px;
  padding: 40px 20px 20px;
  border-radius: 1px solid #666;
  border-bottom: 1px solid #ededed;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  h3 {
    color: #999;
    font-weight: normal;
  }

  p {
    color: #a0522d;
    font-weight: bold;
  }
`;

const Content = styled.div`
  width: 100%;
  padding: 20px;
  flex: 1;
  border-bottom: 1px solid #e5e5e5;
  overflow: auto;
  // 내용 넘치면 스크롤 생김

  ::-webkit-scrollbar {
    width: 30px;
  }

  ::-webkit-scrollbar-thumb {
    height: 20%;
    // 보이는 스크롤바 길이
    background-color: #e9967a;
    border-radius: 20px;
    background-clip: padding-box;
    border: 10px solid transparent;
  }

  ul {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
`;

const Li = styled.li<{ isCheck: boolean }>`
  display: flex;
  gap: 10px;
  cursor: pointer;
  align-items: center;

  // 할 일 체크시, 회색 변경
  p {
    flex: 1;
    color: ${({ isCheck }) => (isCheck ? "#999" : "#000")};
  }

  // 삭제 css
  span {
    color: red;
    display: none;
  }

  &:hover {
    span {
      display: block;
    }
  }
`;

const CheckBox = styled.div<{ isCheck: boolean }>`
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${({ isCheck }) => (isCheck ? "#E9967A" : "#999")};
  background: ${({ isCheck }) => (isCheck ? "#E9967A" : "#fff")};
  border-radius: 3px;
`;

const Footer = styled.footer`
  form {
    width: 100%;
    padding: 20px;
    display: flex;
    justify-content: space-between;
    gap: 8px;
  }

  button {
    cursor: pointer;
    border: none;
    border-radius: 4px;
    background: #e9967a;
    color: #fff;
    font-weight: bold;
    width: 80px;
  }

  input {
    width: 100%;
    height: 30px;
    border: 1px solid #999;
    //  검색창 바깥 테두리
    border-radius: 4px;
    background-color: #fff;
    //  검색창 내부 색깔
    padding: 0px 8px;
    // 너무 앞에서부터 시작 안하게

    :focus {
      outline: none;
    }
    // 클릭하면 테두리 쳐지는거

    ::placeholder {
      color: #ededed;
    }
  }
`;
