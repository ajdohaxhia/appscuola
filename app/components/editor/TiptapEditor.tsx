'use client';

import React, { useEffect } from 'react';
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Highlight from '@tiptap/extension-highlight';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { lowlight } from 'lowlight';
import Link from '@tiptap/extension-link';
import { BoldIcon, ItalicIcon, UnderlineIcon, StrikethroughIcon, 
         ListIcon, ListOrderedIcon, CodeIcon, QuoteIcon, 
         CheckSquareIcon, LinkIcon, RotateCcwIcon, RotateCwIcon } from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  setEditor?: (editor: Editor | null) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange, setEditor }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        },
      }),
      Highlight,
      TaskList,
      TaskItem.configure({
        nested: true,
        HTMLAttributes: {
          class: 'flex items-start gap-2 my-1',
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary-dark dark:text-primary-light underline',
        },
      }),
      CodeBlockLowlight.configure({
        lowlight,
      }),
      Placeholder.configure({
        placeholder: 'Scrivi qui la tua nota...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (setEditor && editor) {
      setEditor(editor);
    }
    
    return () => {
      if (setEditor) {
        setEditor(null);
      }
    };
  }, [editor, setEditor]);

  useEffect(() => {
    // Aggiorna il contenuto solo quando cambia la prop e l'editor è montato
    if (editor && editor.getHTML() !== content) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) {
    return null;
  }

  const MenuButton = ({ onClick, active, icon: Icon, title }: { 
    onClick: () => void, 
    active: boolean, 
    icon: React.ElementType,
    title: string 
  }) => (
    <button
      onClick={onClick}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 ${
        active ? 'text-primary-dark dark:text-primary-light' : 'text-gray-600 dark:text-gray-300'
      }`}
      title={title}
    >
      <Icon size={18} />
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-gray-200 dark:border-gray-700 p-1 flex flex-wrap gap-1">
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive('bold')}
          icon={BoldIcon}
          title="Grassetto"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive('italic')}
          icon={ItalicIcon}
          title="Corsivo"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive('strike')}
          icon={StrikethroughIcon}
          title="Barrato"
        />
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive('bulletList')}
          icon={ListIcon}
          title="Elenco puntato"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive('orderedList')}
          icon={ListOrderedIcon}
          title="Elenco numerato"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={editor.isActive('taskList')}
          icon={CheckSquareIcon}
          title="Lista di controllo"
        />
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive('codeBlock')}
          icon={CodeIcon}
          title="Blocco di codice"
        />
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive('blockquote')}
          icon={QuoteIcon}
          title="Citazione"
        />
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />
        
        <MenuButton
          onClick={() => {
            const url = window.prompt('URL');
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
            }
          }}
          active={editor.isActive('link')}
          icon={LinkIcon}
          title="Inserisci link"
        />
        
        <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1 self-center" />
        
        <MenuButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          icon={RotateCcwIcon}
          title="Annulla"
        />
        <MenuButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          icon={RotateCwIcon}
          title="Ripeti"
        />
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        <EditorContent 
          editor={editor} 
          className="prose prose-sm dark:prose-invert max-w-none h-full"
        />
      </div>
    </div>
  );
};

export default TiptapEditor; 