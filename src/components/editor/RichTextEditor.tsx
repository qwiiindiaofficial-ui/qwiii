import { useRef, useEffect, useCallback } from 'react';
import {
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Strikethrough, Heading1, Heading2, Undo, Redo,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const ToolButton = ({
  onClick, title, active, children,
}: { onClick: () => void; title: string; active?: boolean; children: React.ReactNode }) => (
  <button
    type="button"
    title={title}
    onMouseDown={e => { e.preventDefault(); onClick(); }}
    className={`p-1.5 rounded hover:bg-muted/70 transition-colors ${active ? 'bg-primary/20 text-primary' : 'text-muted-foreground'}`}
  >
    {children}
  </button>
);

const FONT_SIZES = ['10', '12', '14', '16', '18', '20', '24', '28', '32'];
const FONTS = ['Helvetica', 'Arial', 'Times New Roman', 'Courier New', 'Georgia'];

const RichTextEditor = ({ value, onChange, placeholder, minHeight = '200px' }: RichTextEditorProps) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || '';
      }
    }
    isInternalChange.current = false;
  }, [value]);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    editorRef.current?.focus();
    isInternalChange.current = true;
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const handleInput = useCallback(() => {
    isInternalChange.current = true;
    onChange(editorRef.current?.innerHTML || '');
  }, [onChange]);

  const queryCmd = (cmd: string) => {
    try { return document.queryCommandState(cmd); } catch { return false; }
  };

  return (
    <div className="border border-border rounded-lg overflow-hidden bg-background">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-border bg-muted/20">
        <select
          onMouseDown={e => e.stopPropagation()}
          onChange={e => exec('fontName', e.target.value)}
          className="h-7 px-1.5 text-xs bg-muted/30 border border-border rounded text-foreground focus:outline-none mr-1"
          defaultValue="Arial"
        >
          {FONTS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>

        <select
          onMouseDown={e => e.stopPropagation()}
          onChange={e => exec('fontSize', e.target.value)}
          className="h-7 px-1.5 text-xs bg-muted/30 border border-border rounded text-foreground focus:outline-none mr-1"
          defaultValue="3"
          title="Font size"
        >
          <option value="1">8</option>
          <option value="2">10</option>
          <option value="3">12</option>
          <option value="4">14</option>
          <option value="5">18</option>
          <option value="6">24</option>
          <option value="7">32</option>
        </select>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolButton title="Bold (Ctrl+B)" onClick={() => exec('bold')}>
          <Bold size={14} />
        </ToolButton>
        <ToolButton title="Italic (Ctrl+I)" onClick={() => exec('italic')}>
          <Italic size={14} />
        </ToolButton>
        <ToolButton title="Underline (Ctrl+U)" onClick={() => exec('underline')}>
          <Underline size={14} />
        </ToolButton>
        <ToolButton title="Strikethrough" onClick={() => exec('strikeThrough')}>
          <Strikethrough size={14} />
        </ToolButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolButton title="Heading 1" onClick={() => exec('formatBlock', '<h1>')}>
          <Heading1 size={14} />
        </ToolButton>
        <ToolButton title="Heading 2" onClick={() => exec('formatBlock', '<h2>')}>
          <Heading2 size={14} />
        </ToolButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolButton title="Align Left" onClick={() => exec('justifyLeft')}>
          <AlignLeft size={14} />
        </ToolButton>
        <ToolButton title="Align Center" onClick={() => exec('justifyCenter')}>
          <AlignCenter size={14} />
        </ToolButton>
        <ToolButton title="Align Right" onClick={() => exec('justifyRight')}>
          <AlignRight size={14} />
        </ToolButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolButton title="Bullet List" onClick={() => exec('insertUnorderedList')}>
          <List size={14} />
        </ToolButton>
        <ToolButton title="Numbered List" onClick={() => exec('insertOrderedList')}>
          <ListOrdered size={14} />
        </ToolButton>

        <div className="w-px h-5 bg-border mx-1" />

        <ToolButton title="Undo" onClick={() => exec('undo')}>
          <Undo size={14} />
        </ToolButton>
        <ToolButton title="Redo" onClick={() => exec('redo')}>
          <Redo size={14} />
        </ToolButton>

        <div className="w-px h-5 bg-border mx-1" />

        <div className="flex items-center gap-1">
          <label className="text-xs text-muted-foreground">Color:</label>
          <input
            type="color"
            className="w-6 h-6 rounded cursor-pointer border border-border"
            onInput={e => exec('foreColor', (e.target as HTMLInputElement).value)}
            title="Text color"
          />
        </div>
      </div>

      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        data-placeholder={placeholder}
        style={{ minHeight }}
        className={`
          p-4 text-sm text-foreground focus:outline-none overflow-y-auto
          [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-2
          [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:mb-2
          [&_ul]:list-disc [&_ul]:ml-6
          [&_ol]:list-decimal [&_ol]:ml-6
          [&_li]:mb-1
          empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/50
        `}
      />
    </div>
  );
};

export default RichTextEditor;
