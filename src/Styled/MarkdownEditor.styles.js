import styled from 'styled-components';

export const MarkdownEditorContainer = styled.div`
  display: flex;
  gap: 20px;
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
`;

export const LeftContainer = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 20px;
`;

export const TitleInput = styled.textarea`
  width: 100%;
  font-size: 24px;
  font-weight: bold;
  border: 1px solid #ffffff;
  outline: none;
  margin: 20px 0;
  resize: none;
  overflow: hidden;
`;

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    padding: 5px;
    color: #666;

    &:hover {
      color: #333;
    }
  }

  span {
    color: #ccc;
  }
`;

export const EditorContainer = styled.div`
  flex: 1;
  border: 1px solid #ffffff;
  font-size: 16px;
  overflow-y: auto; /* 세로 스크롤 */
  white-space: pre-wrap; /* 자동 줄바꿈 설정 */
  word-wrap: break-word; /* 단어가 길 경우 줄바꿈 */
  .cm-editor.cm-focused {
    outline: none;
  }
`;

export const PreviewContainer = styled.div`
  width: 50%; /* 화면의 절반 너비로 고정 */
  padding: 20px;
  border: 1px solid #ffffff;
  background-color: #F5FBFF;
  font-family: 'Arial', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  overflow-y: auto;
  height: 100%;
  color: #333;
  
  h1 {
    font-size: 2em;
    margin-top: 0;
    color: #333;
  }
  
  h2 {
    font-size: 1.75em;
    margin-top: 1em;
    color: #333;
  }
  
  p {
    margin: 1em 0;
  }
  
  code {
    background-color: #f5f5f5;
    padding: 0.2em 0.4em;
    border-radius: 4px;
    font-size: 90%;
  }
  
  pre code {
    display: block;
    padding: 1em;
    background-color: #2d2d2d;
    color: #f8f8f2;
    overflow-x: auto;
    border-radius: 8px;
    font-size: 0.95em;
  }
  
  a {
    color: #1e90ff;
    text-decoration: none;
  }
  
  a:hover {
    text-decoration: underline;
  }
  
  ul, ol {
    margin: 1em 0;
    padding-left: 2em;
  }
  
  blockquote {
    border-left: 4px solid #ddd;
    padding-left: 16px;
    color: #666;
    font-style: italic;
    margin: 1em 0;
  }
`;

// 추가된 모달 스타일
export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 300px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  text-align: center;

  h3 {
    margin-top: 0;
  }

  input {
    width: 100%;
    padding: 8px;
    margin: 10px 0;
    font-size: 16px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }

  button {
    margin: 5px;
    padding: 8px 12px;
    font-size: 16px;
    cursor: pointer;
    border: none;
    border-radius: 4px;

    &:first-of-type {
      background-color: #00A5FF ;
      color: white;
    }

    &:last-of-type {
      background-color: #5A677A;
      color: white;
    }
  }
`;
