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

import './Vector2DEditor.scss';
import IPropertyEditorProps from '../IPropertyEditorProps';

interface ICoordinatesEditorProps extends IPropertyEditorProps<IVector2D> {
  labelX?: string;
  labelY?: string;
}

/**
 * An editor for an x, y value pair with customisable labels for the x and y values.
 */
export default function CoordinatesEditor({
  labelX = 'X',
  labelY = 'Y',
  value,
  onValueChange,
}: ICoordinatesEditorProps) {
  const onChange = (axis: 'x'|'y', v: string) => {
    if (typeof value === 'object') {
      onValueChange({ ...value, [axis]: parseInt(v, 10) } as IVector2D);
    }
  }

  return (
    <div className="coordinates-editor">
      <div className="input-wrapper">
        <span className="label">
          {labelX}
        </span>
        <input
          className="input"
          type="number"
          value={value?.x}
          onChange={e => onChange('x', e.target.value)}
        />
      </div>
      <div className="input-wrapper">
        <span className="label">
          {labelY}
        </span>
        <input
          className="input"
          type="number"
          value={value?.y}
          onChange={e => onChange('y', e.target.value)}
        />
      </div>
    </div>
  )
}
