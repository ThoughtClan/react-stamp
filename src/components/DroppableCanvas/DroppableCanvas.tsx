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
import { useDrop, DragObjectWithType, DropTargetMonitor } from 'react-dnd';
import uuid from 'uuid';
import Konva from 'konva';
import ICanvasData from '../../entities/ICanvasData';
import { IShape, ShapeType } from '../../entities/IShape';
import Colours from '../../util/colours';
import TransformableShape from '../TransformableShape';
import { ITransformableShapeProps } from '../TransformableShape/TransformableShape';

export interface IDroppableCanvasProps {
  canvasData: ICanvasData;
  onCanvasChanged: (data: ICanvasData) => void;
  onCreateShape?: (type: ShapeType, item: DragObjectWithType, monitor: DropTargetMonitor) => IShape;
}

export default function DroppableCanvas({
  canvasData = { shapes: [] },
  onCanvasChanged,
  onCreateShape,
}: IDroppableCanvasProps) {
  /**
   * Initialisation
   */
  const { shapes } = canvasData;

  const stageRef = React.useRef<Konva.Stage|any>(null);
  const layerRef = React.useRef<Konva.Layer>(null);

  const [selectedShape, setSelectedShape] = React.useState<IShape|null>(null);

  /**
   * Other hooks
   */

  React.useEffect(() => {
    if (!canvasData.height) onCanvasChanged({ ...canvasData, height: window.innerHeight });
    if (!canvasData.width) onCanvasChanged({ ...canvasData, width: window.innerWidth - 50 });
  }, []);

  const [, drop] = useDrop({
    accept: [ShapeType.Rect, ShapeType.Circle],
    drop: (item, monitor) => {
      const createdShape: IShape = typeof onCreateShape === 'function'
        ? onCreateShape(ShapeType[item.type], item, monitor)
        : {
          id: uuid.v4(),
          type: item.type as ShapeType,
          width: 50,
          height: 50,
          fill: Colours.Transparent,
          stroke: Colours.Black,
          strokeWidth: 2,
          draggable: true,
          x: 15,
          y: 15,
        };

      setShapes([...shapes, createdShape]);
    },
  });

  React.useEffect(() => {
    const con = stageRef.current?.container();

    if (!con) return;

    con.addEventListener('dragover', (e: React.MouseEvent) => {
      e.preventDefault();
    });
  }, []);

  /**
   * Event listeners and callbacks
   */

  const setShapes = React.useCallback((s: IShape[]) => {
    onCanvasChanged({ ...canvasData, shapes: s });
  }, [onCanvasChanged]);

  const onDragEnd = React.useCallback(({ id }: IShape, event) => {
    const newShapes = [...shapes];

    const targetShape = shapes.find(s => s.id === id);

    if (!targetShape) return;

    targetShape.x = event.target.x();
    targetShape.y = event.target.y();

    setShapes(newShapes);
  }, [shapes]);

  const onContextMenu = React.useCallback(({ id }: IShape, event) => {
    event.evt.preventDefault();
    setShapes(shapes.filter(s => s.id !== id));
    setSelectedShape(null);
  }, [shapes]);

  const onSelectShape = React.useCallback((s: IShape) => setSelectedShape(s), []);

  const onShapeUpdate = (shape: IShape) => {
    const newShapes = [...shapes];

    const idx = newShapes.findIndex(s => s.id === shape.id);

    if (idx > -1) {
      newShapes.splice(idx, 1, { ...newShapes[idx], ...shape });
    }

    setShapes(newShapes);

    if (selectedShape?.id === shape.id) {
      setSelectedShape(shape);
    }
  };

  const onCanvasClick = React.useCallback(() => {
    setSelectedShape(null);
  }, []);

  /**
   * Renders
   */

  const renderShape = (shape: IShape) => {
    const { type, ...rest } = shape;

    let s = null;

    switch (shape.type) {
      case 'RECT':
        s = ReactKonva.Rect;
        break;

      case 'CIRC':
        s = ReactKonva.Circle;
        break;

      case 'TEXT':
        s = ReactKonva.Text;
        break;

      default:
        s = null;
        break;
    }

    const additionalProps: ITransformableShapeProps & Konva.ShapeConfig = {
      Shape: s,
      onUpdate: onShapeUpdate,
      isSelected: selectedShape?.id === shape.id,
      onContextMenu: (e: Konva.KonvaEventObject<MouseEvent>) => onContextMenu(shape, e),
      onClick: (e: Konva.KonvaEventObject<MouseEvent>) => {
        e.evt.stopPropagation();
        onSelectShape(shape);
      },
      onDragEnd: (e: Konva.KonvaEventObject<DragEvent>) => onDragEnd(shape, e),
    };

    return <TransformableShape key={rest.id} {...shape} {...additionalProps} />;
  };

  return (
    <div className="canvas" ref={drop}>
      <ReactKonva.Stage
        ref={stageRef}
        height={canvasData.height ?? window.innerHeight}
        width={canvasData.width ?? window.innerWidth - 50}
        style={{ backgroundColor: Colours.Transparent }}
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
