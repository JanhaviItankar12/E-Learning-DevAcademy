import React from 'react';
import { Editor } from '@tinymce/tinymce-react';

const RichTextEditor = ({ input, setInput }) => {
  const handleChange = (content) => {
    setInput({ ...input, description: content });
  };

  return (
    <Editor
      apiKey="xgk5g0l6prc8eyzza4vf4o5n22n62e7yvmwhouy5ued0s4ms"
      value={input.description || ""} // Controlled value
      onEditorChange={handleChange}
      init={{
        height: 300,
        menubar: false,
        plugins: [
          'lists', 'link', 'autolink', 'preview', 'anchor',
          'searchreplace', 'code', 'wordcount', 'fontsize'
        ],
        toolbar:
          'undo redo | formatselect fontsizeselect | bold italic underline | ' +
          'alignleft aligncenter alignright | bullist numlist | link | code preview',
        fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 24pt 36pt',
        branding: false,
        placeholder: "Enter course description...",
      }}
    />
  );
};

export default RichTextEditor;
