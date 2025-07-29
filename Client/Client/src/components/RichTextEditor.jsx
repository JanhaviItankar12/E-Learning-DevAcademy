import React, { useEffect, useRef } from 'react';
import JoditEditor from 'jodit-react';

const RichTextEditor = ({ input, setInput }) => {
  const editor = useRef(null);
  const contentRef = useRef(input.description || '');

  // Update content on typing using polling (since onChange is unreliable in React 19)
  useEffect(() => {
    const interval = setInterval(() => {
      if (editor.current) {
        const html = editor.current.value;
        if (html !== contentRef.current) {
          contentRef.current = html;
          setInput((prev) => ({ ...prev, description: html }));
        }
      }
    }, 300); // Poll every 300ms

    return () => clearInterval(interval);
  }, [setInput]);

  return (
    <div className="border rounded">
      <JoditEditor
        ref={editor}
        value={input.description || ''}
        config={{
          readonly: false,
          placeholder: 'Enter course description...',
          height: 400,
          toolbarSticky: false,
          uploader: { insertImageAsBase64URI: true },
          buttons: [
            'source', '|', 'bold', 'italic', 'underline', 'strikethrough', '|',
            'ul', 'ol', '|', 'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', 'paragraph', '|',
            'image', 'video', 'link', '|',
            'align', 'undo', 'redo', 'hr', 'eraser', 'fullsize'
          ],
        }}
      />
    </div>
  );
};

export default RichTextEditor;
