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
import StencilItem from '../StencilItem';
import { IShape, ShapeType } from '../../entities/IShape';

import './Stencil.scss';

import IconRectangle from '../../assets/img/rect.png';
import IconCircle from '../../assets/img/circle.png';
import IconText from '../../assets/img/quote.png';
import IconImage from '../../assets/img/image.png';

interface IShapeMeta extends Partial<IShape> {
  name: string;
  iconUrl: string;
  type: ShapeType;
  // TODO: move default properties for all shapes here
}

const ITEMS: IShapeMeta[] = [{
  type: ShapeType.Rect,
  name: 'Rectangle',
  iconUrl: IconRectangle,
}, {
  type: ShapeType.Circle,
  name: 'Circle',
  iconUrl: IconCircle,
}, {
  type: ShapeType.Text,
  name: 'Text',
  iconUrl: IconText,
}, {
  type: ShapeType.Image,
  name: 'Image',
  iconUrl: IconImage,
}];

export default function Stencil() {
  return (
    <div className="stencil">
      {
        ITEMS.map(i => <StencilItem {...i} key={i.type} />)
      }
    </div>
  );
}
