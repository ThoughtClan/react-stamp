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
import Slider, { SliderProps } from 'rc-slider';
import IPropertyEditorProps from '../IPropertyEditorProps';
import MathHelper from '../../../../util/MathHelper';

import 'rc-slider/assets/index.css';

import './PercentEditor.scss';

export interface IPercentEditorProps extends IPropertyEditorProps<number|null> {
  sliderProps?: SliderProps
}

export default function PercentEditor({
  value,
  onValueChange,
  sliderProps = {},
}: IPercentEditorProps) {
  return (
    <div className="percent-editor">
      <h6 className="label">Opacity</h6>

      <div className="controls">
        <div className="slider-wrapper">
          <Slider
            {...sliderProps}
            value={value ?? 0}
            step={0.01}
            onChange={onValueChange}
            min={0}
            max={1}
          />
        </div>

        <div className="input-wrapper">
          <input
            type="number"
            className="input"
            value={(value ?? 0) * 100}
            onChange={e => onValueChange(MathHelper.clamp(parseInt(e.target.value, 10) || 0, 0, 100) / 100)}
          />
        </div>
      </div>
    </div>
  );
}
