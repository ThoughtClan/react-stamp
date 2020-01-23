/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2020 naoey
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
import ReactKonva from 'react-konva';
import { useDrop } from 'react-dnd';
import uuid from 'uuid';
import Konva from 'konva';
import ICanvasData from '../../entities/ICanvasData';
import { IShape, ShapeType } from '../../entities/IShape';

export interface IDroppableCanvasProps {
  canvasData: ICanvasData;
  onCanvasChanged: (data: ICanvasData) => void;
  height?: number;
  width?: number;
}

export default function DroppableCanvas({
  canvasData = { shapes: [] },
  onCanvasChanged,
}: IDroppableCanvasProps) {
  const { shapes } = canvasData;

  const stageRef = React.useRef<Konva.Stage|any>(null);
  const layerRef = React.useRef<Konva.Layer>(null);

  React.useEffect(() => {
    if (!canvasData.height) onCanvasChanged({ ...canvasData, height: window.innerHeight });
    if (!canvasData.width) onCanvasChanged({ ...canvasData, width: window.innerWidth - 50 });
  }, []);

  const setShapes = React.useCallback((s: IShape[]) => {
    onCanvasChanged({ ...canvasData, shapes: s });
  }, [onCanvasChanged]);

  const [, drop] = useDrop({
    accept: [ShapeType.Rect, ShapeType.Circle],
    drop: (item) => {
      setShapes([
        ...shapes,
        {
          id: uuid.v4(),
          type: item.type as ShapeType,
          width: 50,
          height: 50,
          fill: '#000',
          draggable: true,
          x: 15,
          y: 15,
          onContextMenu: (e: any) => {
            e.evt.preventDefault();
            setShapes(shapes.slice(0, shapes.length - 2))
          },
        },
      ])
    },
  })

  React.useEffect(() => {
    const con = stageRef.current?.container();

    if (!con) return;

    con.addEventListener('dragover', (e: React.MouseEvent) => {
      e.preventDefault();
    });
  }, []);

  const renderShape = (shape: any) => {
    const { type, ...rest } = shape;

    switch (shape.type) {
      case 'RECT':
        return <ReactKonva.Rect {...rest} />;

      case 'CIRC':
        return <ReactKonva.Circle {...rest} />;

      default:
        return null;
    }
  }

  return (
    <div className="canvas" ref={drop}>
      <ReactKonva.Stage
        ref={stageRef}
        height={canvasData.height ?? window.innerHeight}
        width={canvasData.width ?? window.innerWidth - 50}
        style={{ backgroundColor: '#A4A4A4' }}
      >
        <ReactKonva.Layer ref={layerRef} _useStrictMode>
          {
            canvasData.shapes.map(renderShape)
          }
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    </div>
  )
}
