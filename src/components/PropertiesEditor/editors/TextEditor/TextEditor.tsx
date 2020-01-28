/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 ThoughtClan
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import React from 'react';
import IPropertyEditorProps from '../IPropertyEditorProps';

import './TextEditor.scss';

export interface ITextEditorProps extends IPropertyEditorProps<string|undefined|null> {
  label: string;
  multiline?: boolean;
}

export default function TextEditor({
  value,
  onValueChange,
  label,
  multiline,
}: ITextEditorProps) {
  const props = {
    className: "input",
    value: value ?? undefined,
    onChange: (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) => onValueChange(e.target.value),
  };

  return (
    <div className="text-editor">
      <h6 className="label">{label}</h6>

      {
        multiline
          ? <textarea rows={7} {...props} />
          : <input {...props} />
      }
    </div>
  )
}
