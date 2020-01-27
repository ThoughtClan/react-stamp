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

import { ChromePicker } from 'react-color';
import Colours from '../../../../util/Colours';

import PickerIcon from '../../../../assets/img/color-picker.png';

import './ColourEditor.scss';

export interface IColourEditorProps extends IPropertyEditorProps<string|null|undefined> {
  label: string;
}

export default function ColourEditor({
  value,
  onValueChange,
  label,
}: IColourEditorProps) {
  const [isShowingPicker, setShowingPicker] = React.useState(false);

  const onChangeComplete = React.useCallback((colour) => {
    onValueChange(colour.hex);
  }, []);

  const onToggle = () => {
    setShowingPicker(!isShowingPicker);
  };

  return (
    <div className="colour-editor">
      <div className="info-strip">
        <div className="indicator" style={{ backgroundColor: value ?? 'rgba(0, 0, 0, 0)' }} />

        <div className="label-wrapper">
          <span className="label">{label}</span>
        </div>

        <button
          className="picker-toggle"
          onClick={onToggle}
        >
          <img src={PickerIcon} alt="picker_icon" height="100%" width="100%" />
        </button>
      </div>

      {
        isShowingPicker
          ? (
            <div className="picker-wrapper">
              <ChromePicker
                disableAlpha
                color={value ?? Colours.Black}
                onChangeComplete={onChangeComplete}
              />
            </div>
          )
          : null
      }
    </div>
  );
}
