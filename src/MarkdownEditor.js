import React, { useState, useEffect, useRef } from 'react';
import { EditorState, EditorSelection } from '@codemirror/state';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { defaultKeymap } from '@codemirror/commands';
import { marked } from 'marked';
import * as Styled from './Styled/MarkdownEditor.styles';

function MarkdownEditor() {
  const editorRef = useRef(null);
  const [editorView, setEditorView] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [title, setTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [linkURL, setLinkURL] = useState('');
  const [isImageUploadOpen, setIsImageUploadOpen] = useState(false);

  useEffect(() => {
    if (!editorRef.current) return;

    const startState = EditorState.create({
      doc: '',
      extensions: [
        keymap.of(defaultKeymap),
        markdown(),
        placeholder("내용을 적어보세요"),
        EditorView.lineWrapping,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const content = update.state.doc.toString();
            setMarkdownContent(content);
          }
        }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: editorRef.current,
    });

    setEditorView(view);

    return () => {
      view.destroy();
    };
  }, []);

  const renderPreview = () => {
    const previewTitle = title || '제목을 입력하세요';
    return { __html: marked(`# ${previewTitle}\n${markdownContent}`) };
  };

  const toggleInlineStyle = (text, style) => {
    const styles = {
      bold: /^\*\*(.*)\*\*$/,
      italic: /^\*(.*)\*$/,
      strikethrough: /^~~(.*)~~$/,
    };

    const wraps = {
      bold: '**',
      italic: '*',
      strikethrough: '~~',
    };

    const regex = styles[style];
    const wrap = wraps[style];

    return regex.test(text) ? text.replace(regex, '$1') : `${wrap}${text || '텍스트'}${wrap}`;
  };

  const toggleBlockStyle = (text, style) => {
    const styles = {
      blockquote: /^> (.*)$/,
      code: /^```([\s\S]*?)```$/,
    };

    const wraps = {
      blockquote: '> ',
      code: ['```\n', '\n```'],
    };

    const regex = styles[style];
    const wrap = wraps[style];

    if (style === 'code') {
      return regex.test(text) ? text.replace(regex, '$1') : `${wrap[0]}${text || '텍스트'}${wrap[1]}`;
    }
    return regex.test(text) ? text.replace(regex, '$1') : `${wrap}${text || '텍스트'}`;
  };

  const setHeadingLevel = (currentLineText, level) => {
    const headingLevels = ['# ', '## ', '### '];
    const strippedText = currentLineText.replace(/^#+\s*/, '');
    return headingLevels[level - 1] + strippedText;
  };

  const applyMarkdownSyntax = (syntax) => {
    if (!editorView) return;

    if (syntax === 'link') {
      setIsModalOpen(true);
      return;
    } else if (syntax === 'image') {
      setIsImageUploadOpen(true);
      return;
    }

    editorView.dispatch(
      editorView.state.changeByRange((range) => {
        const line = editorView.state.doc.lineAt(range.from);
        const currentLineText = line.text;
        const selectedText = editorView.state.sliceDoc(range.from, range.to);

        let newText;

        if (syntax.startsWith('heading')) {
          const level = parseInt(syntax.slice(-1));
          newText = setHeadingLevel(currentLineText, level);
          return {
            changes: { from: line.from, to: line.to, insert: newText },
            range: EditorSelection.cursor(line.from + newText.length),
          };
        } else if (syntax === 'blockquote') {
          // 현재 라인의 가장 앞에 '>' 추가
          newText = currentLineText.startsWith('> ')
            ? currentLineText.slice(2) // 이미 '>'가 있다면 제거
            : `> ${currentLineText}`; // '>'가 없다면 추가
  
          return {
            changes: { from: line.from, to: line.to, insert: newText },
            range: EditorSelection.cursor(line.from + newText.length),
          };
        } else {
          newText = toggleInlineStyle(selectedText, syntax);
          return {
            changes: { from: range.from, to: range.to, insert: newText },
            range: EditorSelection.range(range.from, range.from + newText.length),
          };
        }
      })
    );
  };

  const handleLinkInsert = () => {
    if (!editorView) return;
  
    const linkText = "링크 텍스트";
    const markdownLink = `[${linkText}](${linkURL})`;
    const linkTextStart = 1; // [ 뒤의 시작 인덱스
    const linkTextEnd = linkTextStart + linkText.length;
  
    editorView.dispatch(
      editorView.state.changeByRange((range) => ({
        changes: { from: range.from, to: range.to, insert: markdownLink },
        range: EditorSelection.range(range.from + linkTextStart, range.from + linkTextEnd),
      }))
    );
  
    setIsModalOpen(false);
    setLinkURL('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageURL = reader.result;
      const markdownImage = `![이미지 설명](${imageURL})`;

      editorView.dispatch(
        editorView.state.changeByRange((range) => ({
          changes: { from: range.from, to: range.to, insert: markdownImage },
          range: EditorSelection.cursor(range.from + markdownImage.length),
        }))
      );
    };
    reader.readAsDataURL(file);

    setIsImageUploadOpen(false);
  };

  return (
    <Styled.MarkdownEditorContainer>
      <Styled.LeftContainer>
        <Styled.TitleInput
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Styled.Toolbar>
          <button onClick={() => applyMarkdownSyntax('heading1')}>H<sub>1</sub></button>
          <button onClick={() => applyMarkdownSyntax('heading2')}>H<sub>2</sub></button>
          <button onClick={() => applyMarkdownSyntax('heading3')}>H<sub>3</sub></button>
          <span>|</span>
          <button onClick={() => applyMarkdownSyntax('bold')}>B</button>
          <button onClick={() => applyMarkdownSyntax('italic')}>I</button>
          <button onClick={() => applyMarkdownSyntax('strikethrough')}>T</button>
          <span>|</span>
          <button onClick={() => applyMarkdownSyntax('blockquote')}>“ ”</button>
          <button onClick={() => applyMarkdownSyntax('link')}>🔗</button>
          <button onClick={() => applyMarkdownSyntax('image')}>이미지</button>
          <button onClick={() => applyMarkdownSyntax('code')}>&lt;/&gt;</button>
        </Styled.Toolbar>
        <Styled.EditorContainer ref={editorRef} />
      </Styled.LeftContainer>
      <Styled.PreviewContainer dangerouslySetInnerHTML={renderPreview()} />
      
      {isModalOpen && (
        <Styled.ModalOverlay>
          <Styled.ModalContent>
            <h3>링크 추가</h3>
            <input
              type="text"
              placeholder="URL을 입력하세요"
              value={linkURL}
              onChange={(e) => setLinkURL(e.target.value)}
            />
            <button onClick={handleLinkInsert}>확인</button>
            <button onClick={() => setIsModalOpen(false)}>취소</button>
          </Styled.ModalContent>
        </Styled.ModalOverlay>
      )}

      {isImageUploadOpen && (
        <Styled.ModalOverlay>
          <Styled.ModalContent>
            <h3>이미지 업로드</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
            />
            <button onClick={() => setIsImageUploadOpen(false)}>취소</button>
          </Styled.ModalContent>
        </Styled.ModalOverlay>
      )}
    </Styled.MarkdownEditorContainer>
  );
}

export default MarkdownEditor;
