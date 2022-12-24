import xw from 'xwind';
import { Worker, Viewer, RenderPage, RenderPageProps } from '@react-pdf-viewer/core';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import '@react-pdf-viewer/toolbar/lib/styles/index.css';

const styles = {
  pdfContainer: xw`
    flex
    justify-center
    max-h-full
  `
};

interface PropTypes {
  paper?: any;
  pdf?: any;
}

const RenderPDF = ({ paper, pdf }: PropTypes) => {
  console.log(`${process.env.SERVER_URL}${paper.source.url}`);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const renderPage: RenderPage = (props: RenderPageProps) => (
    <>
      {props.canvasLayer.children}
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          height: '100%',
          justifyContent: 'center',
          left: 0,
          position: 'absolute',
          top: 0,
          width: '100%',
        }
        }>
        <div
          style={{
            color: 'rgba(0, 0, 0, 0.03)',
            fontSize: `${4 * props.scale}rem`,
            fontWeight: 'bold',
            textTransform: 'uppercase',
            transform: 'rotate(-45deg)',
            userSelect: 'none',
          }}
        >
          Exam Central
        </div>
      </div>
      {props.annotationLayer.children}
      {props.textLayer.children}
    </>
  )

  return (
    <Worker workerUrl='https://unpkg.com/pdfjs-dist@2.6.347/build/pdf.worker.min.js'>
      <div css={styles.pdfContainer} style={{ height: '750px', display: 'flex', justifyContent: 'center', marginTop: '5%', marginBottom: '5%' }}>
        <div style={{ width: '800px' }}>
          {
            paper &&
            <Viewer
              fileUrl={`${process.env.SERVER_URL}${paper.source.url}`}
              // fileUrl={`https://documentcloud.adobe.com/view-sdk-demo/PDFs/Bodea%20Brochure.pdf`}
              renderPage={renderPage}
              plugins={[defaultLayoutPluginInstance]}
            />
          }
          {
            pdf &&
            <Viewer
              fileUrl={pdf}
              renderPage={renderPage}
            />
          }
        </div>
      </div>
    </Worker>
  )
}

export default RenderPDF;
