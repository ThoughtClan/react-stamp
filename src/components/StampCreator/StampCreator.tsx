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
import { DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import Stencil from '../Stencil';
import DroppableCanvas, { IDroppableCanvasProps } from '../DroppableCanvas';
import PropertiesEditor, { IPropertiesEditorProps } from '../PropertiesEditor';
import { IShape } from '../../entities/IShape';

import SelectedShapeContext from '../../contexts/SelectedShapeContext';

import './StampCreator.scss';

export interface IStampCreatorProps {
  /**
   * Handler for files uploaded to, for instance, image shapes on the canvas. The stamp creator expects a unique numeric or string
   * identifier to be returned by this handler which will be used to reference the given file in all future instances.
   *
   * @param {File} file The file object being uploaded
   * @param {IShape} shape The shape which is the target recipient of the @see file
   * @returns {string|number} A unique identifier representing the uploaded file
   */
  onFileUpload: (file: File, shape: IShape) => string|number;

  /**
   * Handler for retrieving files previously handled by @see onFileUpload for use in the canvas.
   *
   * @param {string|number} identifier The unique identifier that would have been returned by @see onFileUpload during upload
   * @returns {File} The file object corresponding to the given indentifier
   */
  onFileDownload: (identifier: string|number) => File;

  /**
   * Handler for clearing files that were previously handled by @see onFileUpload for use in the canvas. Invoked whenever the file's
   * recipient shape is deleted from the canvas.
   *
   * @param {string|number} identifier The unique identifier that would have been returned by @see onFileUpload during upload
   */
  onFileRemove: (identifier: string|number) => void;
}

// TODO: move canvas and property editor props into separate objects in stamp creator props
export default function StampCreator(props: IStampCreatorProps & IDroppableCanvasProps & IPropertiesEditorProps) {
  const [selectedShape, setSelectedShape] = React.useState<IShape|null>(null);

  React.useEffect(() => {
    // We need to update selected shape whenever its value changes in the shapes data
    if (!selectedShape) return;

    const shape = props.canvasData.shapes.find(s => s.id === selectedShape.id);

    if (!shape)
      setSelectedShape(null);
    else
      setSelectedShape(shape);
  }, [props.canvasData]);

  const onPropertiesChanged = (shape: IShape) => {
    const index = props.canvasData?.shapes.findIndex(s => s.id === shape.id);

    if (!isNaN(index)) {
      const newData = { ...props.canvasData };

      newData.shapes.splice(index, 1, shape);

      props.onCanvasChanged(newData);
    }
  };

  return (
    <div className="stamp-creator">
      <SelectedShapeContext.Provider value={selectedShape}>
        <DndProvider backend={HTML5Backend}>
          <Stencil />
          <DroppableCanvas {...props} onSelectShape={setSelectedShape} />
        </DndProvider>

        <PropertiesEditor onPropertiesChanged={onPropertiesChanged} />
      </SelectedShapeContext.Provider>
    </div>
  )
}
