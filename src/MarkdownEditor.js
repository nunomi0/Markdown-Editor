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

    return regex.test(text) ? text.replace(regex, '$1') : `${wrap}${text}${wrap}`;
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

    // Block style에 따라 적용 또는 제거
    if (style === 'code') {
      return regex.test(text) ? text.replace(regex, '$1') : `${wrap[0]}${text}${wrap[1]}`;
    }
    return regex.test(text) ? text.replace(regex, '$1') : `${wrap}${text}`;
  };

  const setHeadingLevel = (currentLineText, level) => {
    const headingLevels = ['# ', '## ', '### '];
    const strippedText = currentLineText.replace(/^#+\s*/, '');
    return headingLevels[level - 1] + strippedText;
  };

  const applyMarkdownSyntax = (syntax) => {
    if (!editorView) return;

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
        } else if (syntax === 'blockquote' || syntax === 'code') {
          newText = toggleBlockStyle(selectedText || currentLineText, syntax);
          const from = selectedText ? range.from : line.from;
          const to = selectedText ? range.to : line.to;
          return {
            changes: { from, to, insert: newText },
            range: EditorSelection.cursor(from + newText.length),
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
