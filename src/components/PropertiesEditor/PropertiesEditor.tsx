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

import * as React from 'react';
import { IShape } from '../../entities/IShape';
import classNames from 'classnames';
import SelectedShapeContext from '../../contexts/SelectedShapeContext';

import { Vector2DEditor, UnitEditor } from './editors';
import MathHelper from '../../util/MathHelper';

import './PropertiesEditor.scss';

export interface IPropertiesEditorProps {
  onPropertiesChanged: (shape: IShape) => void;
}

export default function PropertiesEditor({
  onPropertiesChanged,
}: IPropertiesEditorProps) {
  const selectedShape = React.useContext(SelectedShapeContext);

  const onEditShape = (properties: Array<{ key: string, value: any }>) => {
    const newShape = { ...selectedShape } as IShape;

    properties.forEach(({ key, value }) => newShape[key] = value);

    onPropertiesChanged(newShape);
  };

  const renderEditor = () => {
    if (!selectedShape) return null;

    return (
      <React.Fragment>
        <div className="properties-group">
          <div className="header">
            <h4 className="title">Layout</h4>
          </div>

          <div className="editors--group">
            <Vector2DEditor
              value={{ x: selectedShape?.x, y: selectedShape?.y }}
              onValueChange={(v) => onEditShape(Object.entries(v).map(([key, value]) => ({ key, value })))}
            />
            <Vector2DEditor
              value={{ x: selectedShape?.width, y: selectedShape?.height }}
              onValueChange={(v) => onEditShape([{ key: 'width', value: v.x }, { key: 'height', value: v.y }])}
              labelX="w"
              labelY="h"
            />
            <UnitEditor
              label="r"
              value={selectedShape?.rotation ?? 0}
              onValueChange={(v) => onEditShape([{ key: 'rotation', value: MathHelper.getAbsoluteRotation(v) }])}
              unit="°"
              min={0}
              max={360}
            />
          </div>
        </div>

        <div className="properties-group">
          <div className="header">
            <h4 className="title">Appearance</h4>
          </div>

          <div className="editors">
          </div>
        </div>
      </React.Fragment>
    )
  };

  return (
    <div
      className={classNames({
        'properties-editor': true,
        'properties-editor--empty': selectedShape === null,
      })}
    >
      {
        selectedShape === null
          ? <h4>No shape selected.</h4>
          : renderEditor()
      }
    </div>
  )
}
