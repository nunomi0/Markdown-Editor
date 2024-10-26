import React, { useState, useEffect, useRef } from 'react';
import { EditorState, EditorSelection } from '@codemirror/state';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { defaultKeymap } from '@codemirror/commands';
import { marked } from 'marked';
import * as Styled from './MarkdownEditor.styles';

function MarkdownEditor() {
  const editorRef = useRef(null);
  const [editorView, setEditorView] = useState(null);
  const [markdownContent, setMarkdownContent] = useState('');
  const [title, setTitle] = useState('');

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

  const toggleMarkdownSyntax = (text, syntax) => {
    const syntaxPairs = {
      heading1: /^# (.*)$/,
      heading2: /^## (.*)$/,
      heading3: /^### (.*)$/,
      bold: /^\*\*(.*)\*\*$/,
      italic: /^\*(.*)\*$/,
      strikethrough: /^~~(.*)~~$/,
      blockquote: /^> (.*)$/,
      link: /^\[(.*)\]\(.*\)$/,
      image: /^!\[(.*)\]\(.*\)$/,
      code: /^```([\s\S]*?)```$/,
    };
    const syntaxWraps = {
      heading1: '# ',
      heading2: '## ',
      heading3: '### ',
      bold: '**',
      italic: '*',
      strikethrough: '~~',
      blockquote: '> ',
      link: ['[', '](url)'],
      image: ['![', '](image-url)'],
      code: ['```\n', '\n```'],
    };

    const regex = syntaxPairs[syntax];
    if (regex && regex.test(text)) {
      return text.replace(regex, '$1');
    }

    const wrap = syntaxWraps[syntax];
    if (Array.isArray(wrap)) {
      return `${wrap[0]}${text}${wrap[1]}`;
    }
    return `${wrap}${text}${wrap}`;
  };

  const applyMarkdownSyntax = (syntax) => {
    if (!editorView) return;

    editorView.dispatch(
      editorView.state.changeByRange((range) => {
        const selectedText = editorView.state.sliceDoc(range.from, range.to);
        const newText = toggleMarkdownSyntax(selectedText, syntax);
        
        // 설정한 텍스트 길이에 맞추어 선택 영역을 유지합니다.
        const newSelection = EditorSelection.range(range.from, range.from + newText.length);

        return {
          changes: { from: range.from, to: range.to, insert: newText },
          range: newSelection,
        };
      })
    );
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
    </Styled.MarkdownEditorContainer>
  );
}

export default MarkdownEditor;
