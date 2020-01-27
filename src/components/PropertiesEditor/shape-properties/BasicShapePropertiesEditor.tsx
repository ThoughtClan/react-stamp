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
import Konva from 'konva';
import { IPropertiesEditorProps } from '../PropertiesEditor';
import SelectedShapeContext from '../../../contexts/SelectedShapeContext';
import { ShapeType, IShape } from '../../../entities/IShape';
import { ColourEditor } from '../editors';
import Colours from '../../../util/Colours';

export default function BasicShapePropertiesEditor({
  onPropertiesChanged,
}: IPropertiesEditorProps) {
  const selectedShape = React.useContext(SelectedShapeContext) as Konva.ShapeConfig;

  if (!selectedShape?.type || ![ShapeType.Rect, ShapeType.Circle, ShapeType.Text].includes(selectedShape.type))
    return null;

  const onValueChanged = (key: string, value: string) => {
    const newShape = { ...selectedShape };

    newShape[key] = value;

    onPropertiesChanged(newShape as IShape);
  };

  return (
    <React.Fragment>
      <ColourEditor
        value={selectedShape.fill}
        onValueChange={value => onValueChanged('fill', value ?? Colours.Black)}
        label="Fill"
      />
      <ColourEditor
        value={selectedShape.stroke}
        onValueChange={value => onValueChanged('stroke', value ?? Colours.Black)}
        label="Border"
      />
    </React.Fragment>
  )
}
