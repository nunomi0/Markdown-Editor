// src/MarkdownEditor.js
import React, { useState, useRef } from 'react';
import { EditorView, basicSetup } from 'codemirror';
import {gutter, GutterMarker} from "@codemirror/view"
import { markdown } from '@codemirror/lang-markdown';
import { useCodeMirror } from '@uiw/react-codemirror';
import { marked } from 'marked';
import hljs from 'highlight.js'; // highlight.js import
import 'highlight.js/styles/github-dark.css'; // highlight.js 스타일 (테마 변경 가능)

import {
  EditorContainer,
  Toolbar,
  Button,
  MarkdownInput,
  Preview,
  TitleInput,
  PostContainer,
  PreviewTitle,
  SplitContainer,
  EditorSection,
  PreviewSection,
} from './MarkdownEditor.styles';

// 각 언어를 명시적으로 로드
import javascript from 'highlight.js/lib/languages/javascript';
import python from 'highlight.js/lib/languages/python';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';

// 언어 등록
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);

// marked에서 코드 하이라이팅을 위한 설정
marked.setOptions({
  breaks: true,
  gfm: true,
  highlight: (code, lang) => {
    try {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext';
      return hljs.highlight(code, { language }).value;
    } catch (error) {
      console.error('Highlighting error:', error);
      return code;
    }
  },
});

const MarkdownEditor = () => {
  const [title, setTitle] = useState('');
  const [markdownContent, setMarkdownContent] = useState('');
  const editorRef = useRef(null);
  const fileInputRef = useRef(null); // 파일 입력 참조 생성

  const { setContainer, view } = useCodeMirror({
    container: editorRef.current,
    value: markdownContent,
    basicSetup: {
      lineNumbers: false,
      highlightActiveLine: false, // Disable active line highlighting
      highlightActiveLineGutter: false, // Disable gutter highlighting for active line
      lineWrapping: true,
    },
  });

  const toggleMarkdown = (prefix, suffix = '') => {
    if (!view) return;
    const { state, dispatch } = view;
    const selection = state.selection.main;
    const selectedText = state.doc.sliceString(selection.from, selection.to);

    let newText;
    if (selectedText.startsWith(prefix) && selectedText.endsWith(suffix)) {
      newText = selectedText.slice(prefix.length, selectedText.length - suffix.length);
    } else {
      newText = `${prefix}${selectedText}${suffix}`;
    }

    dispatch(
      state.update({
        changes: {
          from: selection.from,
          to: selection.to,
          insert: newText,
        },
      })
    );
  };

  // 영상 URL을 입력받아 iframe으로 변환하여 삽입하는 함수
  const insertVideo = () => {
    const url = prompt('영상 URL을 입력하세요:');
    if (url) {
      let embedUrl = url;
      const youtubeMatch = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
      if (youtubeMatch && youtubeMatch[1]) {
        embedUrl = `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }

      const iframeMarkdown = `\n<iframe width="560" height="315" src="${embedUrl}" frameborder="0" allowfullscreen></iframe>\n`;
      setMarkdownContent((prev) => prev + iframeMarkdown);
    }
  };

  // 이미지 파일 선택 후 Base64로 변환하여 삽입하는 함수
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        const imgMarkdown = `\n![이미지](${base64})\n`;
        setMarkdownContent((prev) => prev + imgMarkdown);
      };
      reader.readAsDataURL(file);
    }
  };

  // 파일 선택 창을 열어주는 함수
  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 마크다운을 HTML로 변환
  const renderMarkdown = marked(markdownContent);

  return (
    <PostContainer>
      <SplitContainer>
        <EditorSection>
          <TitleInput
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <EditorContainer>
            <Toolbar>
              <Button onClick={() => toggleMarkdown('# ', '')}>H1</Button>
              <Button onClick={() => toggleMarkdown('## ', '')}>H2</Button>
              <Button onClick={() => toggleMarkdown('### ', '')}>H3</Button>
              <Button onClick={() => toggleMarkdown('#### ', '')}>H4</Button>
              <Button onClick={() => toggleMarkdown('**', '**')}>B</Button>
              <Button onClick={() => toggleMarkdown('*', '*')}>I</Button>
              <Button onClick={() => toggleMarkdown('~~', '~~')}>취소선</Button>
              <Button onClick={() => toggleMarkdown('> ', '')}>인용</Button>
              <Button onClick={() => toggleMarkdown('[', '](url)')}>링크</Button>
              <Button onClick={openFilePicker}>이미지</Button> {/* 이미지 버튼 클릭 시 파일 선택 창 열기 */}
              <Button onClick={() => toggleMarkdown('```\n', '\n```')}>코드블럭</Button>
              <Button onClick={insertVideo}>영상</Button> {/* 영상 삽입 버튼 */}
            </Toolbar>

            {/* 파일 입력 요소 (숨김) */}
            <input
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageUpload}
            />

            {/* 마크다운 입력 */}
            <MarkdownInput ref={setContainer} />
          </EditorContainer>
        </EditorSection>

        {/* 미리보기 섹션 */}
        <PreviewSection>
          <PreviewTitle>{title || '제목 미리보기'}</PreviewTitle>
          <Preview dangerouslySetInnerHTML={{ __html: renderMarkdown }} />
        </PreviewSection>
      </SplitContainer>
    </PostContainer>
  );
};

export default MarkdownEditor;