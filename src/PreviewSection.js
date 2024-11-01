// PreviewSection.js
import React from 'react';
import { marked } from 'marked';
import * as Styled from './Styled/MarkdownEditor.styles';

export default function PreviewSection({ title, markdownContent }) {
  const renderPreview = () => {
    const previewTitle = title || '제목을 입력하세요';
    return { __html: marked(`# ${previewTitle}\n${markdownContent}`) };
  };

  return <Styled.PreviewContainer dangerouslySetInnerHTML={renderPreview()} />;
}
