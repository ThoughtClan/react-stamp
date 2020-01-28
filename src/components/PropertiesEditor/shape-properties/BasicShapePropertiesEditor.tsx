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
import { ShapeType, IShape } from '../../../entities/IShape';
import { ColourEditor, UnitEditor } from '../editors';

interface IBasicShapePropertiesEditorProps {
  onEditShape: (properties: Array<{ key: string, value: any }>) => void;
  shape: IShape;
}

export default function BasicShapePropertiesEditor({
  onEditShape,
  shape,
}: IBasicShapePropertiesEditorProps) {
  const s = shape as Konva.ShapeConfig;

  if (!s?.type || !Object.values(ShapeType).includes(s.type))
    return null;

  const onValueChanged = (key: string, value: string) => {
    onEditShape([{ key, value }]);
  };

  return (
    <div className="properties-group">
      <div className="header">
        <h4 className="title">Shape</h4>
      </div>

      <div className="editors">
        <ColourEditor
          value={s.fill}
          onValueChange={value => onEditShape([{ key: 'fill', value }])}
          label="Fill"
        />
        <ColourEditor
          value={s.stroke}
          onValueChange={value => onEditShape([{ key: 'stroke', value }])}
          label="Border"
        />
      </div>

      <div className="editors--group">
        <UnitEditor
          min={0}
          value={s.strokeWidth ?? 1}
          onValueChange={value => onEditShape([{ key: 'strokeWidth', value }])}
          label="Border"
          unit="pt"
        />
      </div>
    </div>
  );
}
