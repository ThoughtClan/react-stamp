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
import IFileManagerProps from '../../../../entities/IFileManagerProps';
import IPropertyEditorProps from '../IPropertyEditorProps';
import { IShape } from '../../../../entities/IShape';

import './FileEditor.scss';

export interface IFileEditorProps extends IPropertyEditorProps<string|null> {
  label: string;
  shape: IShape;
}

export default function FileEditor({
  label,
  shape,
  onValueChange,
  onFileUpload,
}: IFileEditorProps & IFileManagerProps) {
  const input = React.useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      onValueChange(null);
      return;
    }

    const file = e.target.files[0];
    const url = URL.createObjectURL(file);

    if (typeof onFileUpload === 'function')
      onFileUpload(file, shape);

    if (input.current)
      input.current.value = '';

    onValueChange(url);
  }

  return (
    <div className="file-editor">
      <h6 className="label">{label}</h6>

      <input
        ref={input}
        type="file"
        onChange={onChange}
        className="input"
      />
    </div>
  )
}
