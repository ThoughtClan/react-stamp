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
import { TextEditor, FileEditor } from '../editors';
import IFileManagerProps from '../../../entities/IFileManagerProps';

export interface IImageShapePropertiesEditor extends IFileManagerProps {
  onEditShape: (properties: Array<{ key: string, value: any }>) => void;
  shape: IShape;
}

export default function ImageShapePropertiesEditor({
  onEditShape,
  shape,
  ...rest
}: IImageShapePropertiesEditor) {
  const s = (shape as unknown) as Konva.ImageConfig;

  if (!s?.type || ![ShapeType.Image].includes(s.type))
    return null;

  const onValueChanged = (key: string, value: any) => {
    onEditShape([{ key, value }]);
  };

  return (
    <div className="properties-group">
      <div className="header">
        <h4 className="title">Image</h4>
      </div>

      <div className="editors">
        <TextEditor
          value={s.alt}
          onValueChange={value => onValueChanged('alt', value ?? 'image')}
          label="Alt"
        />
        <FileEditor
          {...rest}
          value={shape.image}
          onValueChange={value => onValueChanged('image', value)}
          label="Source"
          shape={shape}
        />
      </div>
    </div>
  );
}
