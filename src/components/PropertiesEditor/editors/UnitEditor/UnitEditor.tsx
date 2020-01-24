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

export interface IUnitEditorProps extends IPropertyEditorProps<number|null> {
  unit: string;
  label: string|React.ReactNode;
  min?: number;
  max?: number;
}

/**
 * An editor for numeric values that are displayed with an associated unit.
 */
export default function UnitEditor({
  value,
  unit,
  label,
  onValueChange,
  min = Infinity,
  max = Infinity,
}: IUnitEditorProps) {
  return (
    <div className="unit-editor">
      <div className="input-wrapper">
        <span className="label">
          {label}
        </span>

        <input
          type="number"
          className="input"
          value={value ?? undefined}
          onChange={e => onValueChange(parseInt(e.target.value, 10))}
        />

        {/* TODO: actually display the unit without interfering with number input */}
      </div>
    </div>
  )
}
