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
import { useDrop, DragObjectWithType, DropTargetMonitor } from 'react-dnd';
import uuid from 'uuid';
import Konva from 'konva';
import ICanvasData from '../../entities/ICanvasData';
import { IShape, ShapeType } from '../../entities/IShape';
import Colours from '../../util/Colours';
import TransformableShape from '../TransformableShape';
import { ITransformableShapeProps } from '../TransformableShape/TransformableShape';
import SelectedShapeContext from '../../contexts/SelectedShapeContext';
import { IStampCreatorProps } from '../StampCreator/StampCreator';
import IFileManagerProps from '../../entities/IFileManagerProps';

import './DroppableCanvas.scss';
import { ShapeConfig } from 'konva/types/Shape';

const PLACEHOLDER_IMAGE = 'https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_large.png?format=jpg&quality=90&v=1530129081';

export interface IDroppableCanvasProps {
  canvasData: ICanvasData;
  onCanvasChanged: (data: ICanvasData) => void;
  onCreateShape?: (type: ShapeType, item: DragObjectWithType, monitor: DropTargetMonitor) => IShape;
  onSelectShape: (shape: IShape|null) => void;
}

export default function DroppableCanvas({
  canvasData = { shapes: [] },
  onCanvasChanged,
  onCreateShape,
  onSelectShape,
  onFileRemove,
  onFileDownload,
}: IDroppableCanvasProps & IFileManagerProps) {
  /**
   * Initialisation
   */
  const { shapes } = canvasData;
  const selectedShape = React.useContext(SelectedShapeContext);

  const stageRef = React.useRef<Konva.Stage|any>(null);
  const layerRef = React.useRef<Konva.Layer>(null);

  /**
   * Other hooks
   */

  React.useEffect(() => {
    if (!canvasData.height) onCanvasChanged({ ...canvasData, height: window.innerHeight });
    if (!canvasData.width) onCanvasChanged({ ...canvasData, width: window.innerWidth - 50 });
  }, []);

  const handleDrop = (item: any, monitor: DropTargetMonitor) => {
    let createdShape;

    if (typeof onCreateShape === 'function') {
      createdShape = onCreateShape(ShapeType[item.type], item, monitor);
    } else {
      createdShape = {
        id: uuid.v4(),
        type: item.type as ShapeType,
        width: 50,
        height: 50,
        draggable: true,
        x: 15,
        y: 15,
      } as ShapeConfig;

      if (createdShape.type === ShapeType.Text) {
        createdShape = createdShape as Konva.TextConfig;
        createdShape.text = 'Text';
        createdShape.fontSize = 18;
      } else if (createdShape.type === ShapeType.Image) {
        const image = new Image();
        image.alt = 'image';
        image.src = PLACEHOLDER_IMAGE;
        image.height = 250;
        image.width = 250;

        createdShape.image = image;
        createdShape.strokeWidth = 1;
        createdShape.stroke = Colours.Black;
      } else {
        createdShape.fill = Colours.Transparent;
        createdShape.stroke = Colours.Black;
        createdShape.strokeWidth = 2;
      }
    }

    setShapes([...shapes, createdShape as IShape]);
  };

  const [, drop] = useDrop({
    accept: Object.values(ShapeType),
    drop: handleDrop,
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

    targetShape.x = Math.round(event.target.x());
    targetShape.y = Math.round(event.target.y());

    setShapes(newShapes);
  }, [shapes]);

  const onContextMenu = React.useCallback(({ id, type, ...rest }: IShape, event) => {
    event.evt.preventDefault();
    setShapes(shapes.filter(s => s.id !== id));
    onSelectShape(null);

    if (type === ShapeType.Image && rest.image && typeof onFileRemove === 'function')
      onFileRemove(rest.image);
  }, [shapes]);

  const onShapeUpdate = (shape: IShape) => {
    const newShapes = [...shapes];

    const idx = newShapes.findIndex(s => s.id === shape.id);

    if (idx > -1) {
      newShapes.splice(idx, 1, { ...newShapes[idx], ...shape });
    }

    setShapes(newShapes);

    if (selectedShape?.id === shape.id) {
      onSelectShape(shape);
    }
  };

  const onCanvasClick = () => onSelectShape(null);

  const getImage = (shape: IShape) => {
    if (shape.type !== ShapeType.Image || !shape.image)
      return null;

    if (typeof shape.image === 'string') {
      const image = new Image();
      image.alt = 'image';

      if (shape.image.startsWith('https://') || shape.image.startsWith('blob:'))
        image.src = shape.image;
      else
        image.src = typeof onFileDownload === 'function'
          ? onFileDownload(shape.image)
          : PLACEHOLDER_IMAGE;

      return image;
    }

    return null;
  };

  /**
   * Renders
   */

  const renderShape = (shape: IShape) => {
    const { type, ...rest } = shape;

    let s = null;

    switch (shape.type) {
      case ShapeType.Rect:
        s = ReactKonva.Rect;
        break;

      case ShapeType.Circle:
        s = ReactKonva.Circle;
        break;

      case ShapeType.Text:
        s = ReactKonva.Text;
        break;

      case ShapeType.Image:
        s = ReactKonva.Image;
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
      image: getImage(shape) ?? undefined,
    };

    return <TransformableShape key={rest.id} {...shape} {...additionalProps} />;
  };

  return (
    <div className="canvas" ref={drop}>
      <ReactKonva.Stage
        ref={stageRef}
        height={canvasData.height ?? window.innerHeight}
        width={canvasData.width ?? window.innerWidth - 50}
        style={{ backgroundColor: Colours.White }}
      >
        <ReactKonva.Layer ref={layerRef} _useStrictMode>
          {
            canvasData.shapes.map(renderShape)
          }
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    </div>
  );
}
