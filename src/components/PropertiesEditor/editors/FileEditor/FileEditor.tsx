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

export interface IFileEditorProps extends IPropertyEditorProps<string|number|null> {
  label: string;
  shape: IShape;
  acceptedTypes?: string[];
}

export default function FileEditor({
  label,
  shape,
  value,
  onValueChange,
  onFileUpload,
  onFileRemove,
  acceptedTypes = [],
}: IFileEditorProps & IFileManagerProps) {
  const input = React.useRef<HTMLInputElement>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      onValueChange(null);
      return;
    }

    const file = e.target.files[0];

    if (!acceptedTypes.includes(file.type)) {
      window.alert('Incompatible file type');

      if (input.current)
        input.current.value = '';

      return;
    }

    let newValue: string|number|null;

    if (typeof onFileUpload === 'function')
      newValue = onFileUpload(file, shape);
    else
      newValue = URL.createObjectURL(file);


    if (input.current)
      input.current.value = '';

    if (value && typeof onFileRemove === 'function') {
      onFileRemove(value);
    }

    onValueChange(newValue);
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
