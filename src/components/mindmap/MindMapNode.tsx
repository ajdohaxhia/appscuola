import React, { memo, useState, useRef, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { cn } from '@/utils/cn';
import { Button } from '../ui/button';
import { Plus, X, Palette, Image as ImageIcon } from 'lucide-react';
import { Input } from '../ui/input';
import { ColorPicker } from '../ui/color-picker';

const MindMapNode = ({
  data,
  isConnectable,
  selected,
  id,
}: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [nodeColor, setNodeColor] = useState(data.color || '#ffffff');
  const [textColor, setTextColor] = useState(data.textColor || '#000000');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleLabelSubmit = () => {
    setIsEditing(false);
    data.label = label;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLabelSubmit();
    }
  };

  const handleColorChange = (color: string) => {
    setNodeColor(color);
    data.color = color;
  };

  const handleTextColorChange = (color: string) => {
    setTextColor(color);
    data.textColor = color;
  };

  return (
    <div
      className={cn(
        'px-4 py-2 shadow-md rounded-md border-2 border-stroke-200',
        selected && 'border-primary',
        'min-w-[150px]'
      )}
      style={{
        backgroundColor: nodeColor,
        color: textColor,
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
      <div className="flex items-center justify-between gap-2">
        {isEditing ? (
          <Input
            ref={inputRef}
            value={label}
            onChange={handleLabelChange}
            onBlur={handleLabelSubmit}
            onKeyDown={handleKeyDown}
            className="h-6 text-sm"
          />
        ) : (
          <div
            className="flex-1 cursor-pointer"
            onClick={() => setIsEditing(true)}
          >
            {label}
          </div>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => setShowColorPicker(!showColorPicker)}
          >
            <Palette className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={() => data.onAddChild?.(id)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {showColorPicker && (
        <div className="absolute z-10 mt-2">
          <ColorPicker
            value={nodeColor}
            onChange={handleColorChange}
            onTextColorChange={handleTextColorChange}
          />
        </div>
      )}
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-primary"
      />
    </div>
  );
};

export default memo(MindMapNode); 