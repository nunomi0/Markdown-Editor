import React, { useState, useEffect, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, placeholder } from '@codemirror/view';
import { markdown } from '@codemirror/lang-markdown';
import { defaultKeymap } from '@codemirror/commands';
import { EditorSelection } from '@codemirror/state';
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

  const applyMarkdownSyntax = (syntax) => {
    if (!editorView) return;
  
    editorView.dispatch(
      editorView.state.changeByRange((range) => {
        const selectedText = editorView.state.sliceDoc(range.from, range.to);
        let newText = '';
  
        switch (syntax) {
          case 'heading1':
            newText = `# ${selectedText}`;
            break;
          case 'heading2':
            newText = `## ${selectedText}`;
            break;
          case 'heading3':
            newText = `### ${selectedText}`;
            break;
          case 'bold':
            newText = `**${selectedText}**`;
            break;
          case 'italic':
            newText = `*${selectedText}*`;
            break;
          case 'strikethrough':
            newText = `~~${selectedText}~~`;
            break;
          case 'blockquote':
            newText = `> ${selectedText}`;
            break;
          case 'link':
            newText = `[${selectedText}](url)`;
            break;
          case 'image':
            newText = `![${selectedText}](image-url)`;
            break;
          case 'code':
            newText = `\`\`\`\n${selectedText}\n\`\`\``;
            break;
          default:
            newText = selectedText;
        }
  
        return {
          changes: { from: range.from, to: range.to, insert: newText },
          range: EditorSelection.cursor(range.from + newText.length),
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
