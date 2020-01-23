import React from 'react'

import { StampCreator } from '@thoughtclan/react-stamp'

import '@thoughtclan/react-stamp/dist/index.css';

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
