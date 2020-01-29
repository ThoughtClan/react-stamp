import React from 'react'

import { StampCreator, StampViewer } from '@thoughtclan/react-stamp'

import '@thoughtclan/react-stamp/dist/index.css';

export default function App() {
  const [canvas, setCanvas] = React.useState({
    height: 1000,
    width: 1000,
    shapes: [],
  });

  const files = React.useRef({});

  React.useEffect(() => {
    if (window.__puppeteer) {
      setCanvas(window.__puppeteer);
      window.__screenGrabReady = true;
    }
  }, []);

  const onUploadFile = (file) => {
    const key = Object.keys(files.current).length.toString();

    files.current[key] = file;

    return key;
  };

  // can be replaced with any HTTP url in actual use, for ex., upload the image to a CDN when this canvas is saved to a server
  // and use a static URL to load the image onto the canvas there on out.
  const onDownloadFile = (key) => files.current[key] instanceof File ? URL.createObjectURL(files.current[key]) : '';

  const onRemoveFile = (key) => delete files.current[key];

  const props = {
    canvasData: canvas,
    onFileDownload: onDownloadFile,
    onFileUpload: onUploadFile,
    onFileRemove: onRemoveFile,
  };

  // hijack the example app in the server-side image generator also
  return window.__puppeteer ? <StampViewer {...props} /> : <StampCreator {...props} onCanvasChanged={setCanvas} />;
}
