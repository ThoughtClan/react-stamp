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
import { IShape, ShapeType } from '../../entities/IShape';
import { IDroppableCanvasProps } from '../DroppableCanvas';
import IFileManagerProps from '../../entities/IFileManagerProps';
import Colours from '../../util/Colours';
import ICanvasData from '../../entities/ICanvasData';

export interface ICanvasProps {
  canvasData: ICanvasData;
  onLoadEnd?: () => void,
}

/**
 * Basically a copy of @see StampCreator except it renders only the canvas for the sake of the server side image generation.
 */
export default function Canvas({
  onFileDownload,
  canvasData,
  onLoadEnd,
}: ICanvasProps & Partial<IFileManagerProps>) {
  const downloadedFiles = React.useRef({});
  const loadedImages = React.useRef({});

  const [images, setImages] = React.useState<string[]>([]);

  React.useEffect(() => {
    const images = canvasData.shapes.filter(s => s.type === ShapeType.Image);

    console.log('Checking if any images to load', images.length, typeof onLoadEnd);

    if (images.length === 0) {
      if (typeof onLoadEnd === 'function')
        onLoadEnd();

      return;
    }

    images.forEach(downloadImage);
  }, [JSON.stringify(canvasData)]);

  React.useEffect(() => {
    const expectedImages = canvasData.shapes.filter(s => s.type === ShapeType.Image).length;

    if (typeof onLoadEnd === 'function' && expectedImages > 0 && images.length === expectedImages)
      setTimeout(() => onLoadEnd(), 1000);
  }, [JSON.stringify(images), JSON.stringify(canvasData)]);

  const downloadImage = (shape: IShape) => {
    if (shape.type !== ShapeType.Image || !shape.image)
      return null;

    if (typeof shape.image === 'string') {
      const image = new Image();
      image.alt = 'image';

      // TODO: re-draw layer after image is changed; its currently not displaying the new image until next render

      if (shape.image.startsWith('https://') || shape.image.startsWith('blob:')) {
        image.src = shape.image;
      } else if (downloadedFiles.current[shape.image]) {
        image.src = downloadedFiles.current[shape.image];
      } else if (typeof onFileDownload === 'function') {
        downloadedFiles.current[shape.image] = onFileDownload(shape.image);
        image.src = downloadedFiles.current[shape.image];
      } else {
        image.src = '';
      }

      image.onload = function() {
        loadedImages.current[shape.image] = image;
        setImages([...images, shape.image]);
      };

      return image;
    }

    return null;
  };

  const renderShape = (shape: IShape) => {
    const { type, ...rest } = shape;

    let Shape: any;

    switch (shape.type) {
      case ShapeType.Rect:
        Shape = ReactKonva.Rect;
        break;

      case ShapeType.Circle:
        Shape = ReactKonva.Circle;
        break;

      case ShapeType.Text:
        Shape = ReactKonva.Text;
        break;

      case ShapeType.Image:
        Shape = ReactKonva.Image;
        break;

      default:
        Shape = null;
        break;
    }

    const additionalProps = {
      image: images.includes(shape.image) ? loadedImages.current[shape.image] : undefined,
      draggable: false,
    };

    return <Shape key={rest.id} {...shape} {...additionalProps} />;
  };

  return (
    <div className="canvas">
      <ReactKonva.Stage
        height={canvasData.height ?? window.innerHeight}
        width={canvasData.width ?? window.innerWidth - 50}
        style={{ backgroundColor: Colours.Transparent }}
      >
        <ReactKonva.Layer _useStrictMode>
          {
            canvasData.shapes.map(renderShape)
          }
        </ReactKonva.Layer>
      </ReactKonva.Stage>
    </div>
  );
}
