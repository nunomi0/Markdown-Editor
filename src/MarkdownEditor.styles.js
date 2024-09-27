// src/MarkdownEditor.styles.js
import styled from 'styled-components';

export const PostContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px;
  gap: 20px;
`;

export const SplitContainer = styled.div`
  display: flex;
  gap: 20px;
  height: 80vh;
`;

export const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

export const PreviewSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  padding: 10px;
  border-left: 1px solid #ddd;
  box-sizing: border-box;
`;

export const TitleInput = styled.input`
  padding: 10px;
  font-size: 18px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  margin-bottom: 10px;
`;

export const PreviewTitle = styled.h1`
  font-size: 24px;
  margin-bottom: 20px;
`;

export const EditorContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

export const Toolbar = styled.div`
  display: flex;
  padding: 10px;
  border-bottom: 1px solid #ddd;
  background: #f4f4f4;
`;

export const Button = styled.button`
  margin-right: 5px;
  padding: 5px 10px;
  font-size: 14px;
  cursor: pointer;
  border: 1px solid #ddd;
  background: #fff;
  &:hover {
    background: #eaeaea;
  }
`;

export const MarkdownInput = styled.div`
  height: 100%;
  border-right: 1px solid #ddd;
  padding: 10px;
  box-sizing: border-box;
  overflow-y: auto;  .cm-editor,

  .cm-editor * {
    border: none;
    outline: none;
  }

  /* Ensure line wrapping is properly styled */
  .cm-content {
    white-space: pre-wrap ;
    word-wrap: break-word;
  }
`;

export const Preview = styled.div`
  height: 100%;
  padding: 10px;
  overflow-y: scroll;
  box-sizing: border-box;

  pre {
    background-color: #1e1e1e; /* 검정색 배경 */
    padding: 10px;
    border-radius: 5px;
    overflow-x: auto;
  }

  code {
    color: #c5c8c6;
  }
`



;