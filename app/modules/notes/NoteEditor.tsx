'use client';

import React, { useState, useEffect, KeyboardEvent } from 'react';
import { XIcon, PlusIcon } from 'lucide-react';
import TiptapEditor from '@/app/components/editor/TiptapEditor';
import { Editor } from '@tiptap/react';
import { SaveIcon, TagIcon, Hash, Check, Clock } from 'lucide-react';
import { Note } from '@/app/lib/db';

interface NoteEditorProps {
  note: Note | null;
  onSave: (note: Note) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({ note, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setTags([...note.tags]);
      setSaveStatus('idle');
      setLastSaved(note.updatedAt instanceof Date ? note.updatedAt : note.updatedAt ? new Date(note.updatedAt) : null);
    } else {
      setTitle('');
      setContent('');
      setTags([]);
      setSaveStatus('idle');
      setLastSaved(null);
    }
  }, [note]);

  useEffect(() => {
    if (saveStatus !== 'idle') return;

    const saveTimer = setTimeout(() => {
      if (title !== note?.title || content !== note?.content || !arraysEqual(tags, note?.tags ?? [])) {
        saveNote();
      }
    }, 3000);

    return () => clearTimeout(saveTimer);
  }, [title, content, tags, note, saveStatus]);

  const saveNote = async () => {
    if (!note) return;
    setSaveStatus('saving');
    try {
      const noteToSave: Note = {
        ...note,
        title,
        content,
        tags,
        updatedAt: new Date()
      };
      await onSave(noteToSave);
      setSaveStatus('saved');
      setLastSaved(noteToSave.updatedAt);
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      console.error("Error saving note:", error);
      setSaveStatus('error');
    }
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    if (saveStatus !== 'saving') setSaveStatus('idle');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    if (saveStatus !== 'saving') setSaveStatus('idle');
  };

  const handleTagChange = (newTags: string[]) => {
    setTags(newTags);
    if (saveStatus !== 'saving') setSaveStatus('idle');
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      handleTagChange([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleTagChange(tags.filter(tag => tag !== tagToRemove));
  };

  const arraysEqual = (a: string[], b: string[]) => {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, index) => val === sortedB[index]);
  };

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <div className="text-center">
          <p className="mb-2 text-xl">Seleziona una nota o creane una nuova</p>
          <p>Le tue note appariranno qui</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Titolo della nota"
          className="w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 dark:placeholder-gray-500"
        />
        
        <div className="flex flex-wrap items-center mt-3 gap-2">
          <TagIcon size={18} className="text-gray-400" />
          
          {tags.map((tag, index) => (
            <div 
              key={index} 
              className="flex items-center px-2 py-1 rounded-md bg-primary-light/20 dark:bg-primary-dark/20 text-sm"
            >
              <Hash size={14} className="mr-1 text-primary-dark dark:text-primary-light" />
              <span className="text-primary-dark dark:text-primary-light">{tag}</span>
              <button 
                onClick={() => removeTag(tag)}
                className="ml-1 text-gray-500 hover:text-red-500"
              >
                <XIcon size={14} />
              </button>
            </div>
          ))}
          
          <div className="flex items-center">
            <input
              type="text"
              value={tagInput}
              onChange={e => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Aggiungi tag..."
              className="bg-transparent border-none outline-none text-sm placeholder-gray-400 dark:placeholder-gray-500"
            />
            <button
              onClick={addTag}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <PlusIcon size={16} />
            </button>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <TiptapEditor 
          content={content} 
          onChange={handleContentChange}
          setEditor={setEditor}
        />
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 flex justify-between items-center">
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center">
          {saveStatus === 'saving' && <><Clock size={14} className="mr-1.5 animate-spin" /> Salvataggio...</>}
          {saveStatus === 'saved' && <><Check size={14} className="mr-1.5 text-green-500" /> Salvato.</>}
          {saveStatus === 'error' && <><XIcon size={14} className="mr-1.5 text-red-500" /> Errore salvataggio.</>}
          {saveStatus === 'idle' && lastSaved && <>Ultimo salvataggio: {lastSaved.toLocaleTimeString('it-IT')}</>}
          {saveStatus === 'idle' && !lastSaved && <>Pronto per salvare</>}
        </div>
        
        <button
          onClick={() => saveNote()}
          disabled={saveStatus === 'saving'}
          className={`flex items-center px-4 py-2 rounded-md text-white font-semibold transition-colors ${saveStatus === 'saving' ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          <SaveIcon size={16} className="mr-2" />
          Salva Ora
        </button>
      </div>
    </div>
  );
};

export default NoteEditor; 