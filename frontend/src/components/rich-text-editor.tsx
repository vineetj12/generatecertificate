'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect } from 'react';
import { Bold, Italic, List, ListOrdered, RemoveFormatting } from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // disable headings if not needed, keep formatting simple
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[140px] max-h-[250px] overflow-y-auto px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none leading-relaxed prose prose-sm dark:prose-invert max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Sync value from parent if it changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 dark:focus-within:ring-offset-slate-950 transition-all duration-200">
      {/* Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex-wrap">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive('bold') ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive('italic') ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive('bulletList') ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors ${
            editor.isActive('orderedList') ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-300'
          }`}
          title="Ordered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <div className="w-px h-5 bg-slate-200 dark:bg-slate-800 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
          title="Clear Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content */}
      <div className="tiptap-editor relative">
        <EditorContent editor={editor} />
        {editor.isEmpty && placeholder && (
          <div className="absolute top-3 left-4 text-sm text-slate-400 dark:text-slate-500 pointer-events-none">
            {placeholder}
          </div>
        )}
      </div>
    </div>
  );
}
