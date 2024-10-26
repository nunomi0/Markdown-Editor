import React, { useState, useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap } from '@codemirror/view';
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

  return (
    <Styled.MarkdownEditorContainer>
      <Styled.LeftContainer>
        <Styled.TitleInput
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Styled.EditorContainer ref={editorRef} />
      </Styled.LeftContainer>
      <Styled.PreviewContainer dangerouslySetInnerHTML={renderPreview()} />
    </Styled.MarkdownEditorContainer>
  );
}

export default MarkdownEditor;
