import React from 'react'

import { StampCreator } from '@naoey/react-stamp'

import '@naoey/react-stamp/dist/index.css';

export default function App() {
  const [canvas, setCanvas] = React.useState({
    height: 1000,
    width: 1000,
    shapes: [],
  });

  return (
    <StampCreator
      onCanvasChanged={setCanvas}
      canvasData={canvas}
    />
  )
}
