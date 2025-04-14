import React, { useState } from 'react';
import { cn } from '@/utils/cn';
import { Button } from './button';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Input } from './input';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  onTextColorChange?: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({
  value,
  onChange,
  onTextColorChange,
}) => {
  const [color, setColor] = useState(value);
  const [textColor, setTextColor] = useState('#000000');

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setColor(newColor);
    onChange(newColor);
  };

  const handleTextColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value;
    setTextColor(newColor);
    if (onTextColorChange) {
      onTextColorChange(newColor);
    }
  };

  return (
    <div className="flex flex-col gap-2 p-2">
      <div className="flex items-center gap-2">
        <span className="text-sm">Background:</span>
        <Input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="h-8 w-8 p-0"
        />
        <span className="text-sm">{color}</span>
      </div>
      {onTextColorChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm">Text:</span>
          <Input
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            className="h-8 w-8 p-0"
          />
          <span className="text-sm">{textColor}</span>
        </div>
      )}
    </div>
  );
};

export { ColorPicker }; 