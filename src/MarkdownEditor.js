// MarkdownEditor.js
import React, { useState } from 'react';
import EditorSection from './EditorSection';
import PreviewSection from './PreviewSection';
import * as Styled from './Styled/MarkdownEditor.styles';

export default function MarkdownEditor() {
  const [markdownContent, setMarkdownContent] = useState('');
  const [title, setTitle] = useState('');

  return (
    <Styled.MarkdownEditorContainer>
      <EditorSection
        title={title}
        setTitle={setTitle}
        setMarkdownContent={setMarkdownContent}
      />
      <PreviewSection title={title} markdownContent={markdownContent} />
    </Styled.MarkdownEditorContainer>
  );
}
