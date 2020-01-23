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
import ReactKonva from 'react-konva';
import { IShape } from '../../entities/IShape';
import Konva from 'konva';

export interface ITransformableShapeProps {
  isSelected?: boolean;
  onUpdate: (shape: IShape) => void;
  Shape: ReactKonva.KonvaNodeComponent<Konva.Shape, Konva.ShapeConfig>|null;
}

export default function TransformableShape({
  isSelected,
  onUpdate,
  Shape,
  ...rest
}: ITransformableShapeProps & IShape) {
  const shapeRef = React.useRef<Konva.Shape>(null);
  const transformRef = React.useRef<Konva.Transformer>(null);

  const shape = !Shape ? null : (
    <Shape
      {...rest}
      ref={shapeRef}
      onTransformEnd={() => {
        const node = shapeRef.current;

        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        const newShape: IShape = { ...rest };

        newShape.width = node.width() * scaleX;
        newShape.height = node.height() * scaleY;

        node.scaleX(1);
        node.scaleY(1);

        onUpdate(newShape);
      }}
    />
  );

  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      transformRef.current?.setNode(shapeRef.current);
      transformRef.current?.getLayer()?.batchDraw();
    }
  }, [isSelected]);

  if (!shape) return null;

  if (isSelected) {
    return (
      <React.Fragment>
        {shape}
        <ReactKonva.Transformer
          ref={transformRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      </React.Fragment>
    );
  }

  return shape;
}
