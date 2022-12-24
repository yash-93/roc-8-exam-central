import xw from 'xwind';
import styled from '@emotion/styled';
import { Draggable } from 'react-beautiful-dnd';

// import UploadedFileCard from './UploadedFileCard';

const styles = {
  cardContainer: xw`
    w-full
    py-4
    my-4
    flex
    items-center
    shadow
    hover:shadow-lg
  `,
  fileContainer: xw`
    w-11/12
    pl-8
    flex
    items-center
  `,
  cross: xw`
    p-1
    rounded-full
    bg-red-700
    cursor-pointer
  `
}

const UploadedFileCard = styled.div`
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  background-color: white;
  box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;
  overflow: hidden
`;

const FileContainer = styled.div`
  width: 85%;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  align-items: center;
`;

const Cross = styled.div`
  width: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Title = styled.span`
  margin-left: 0.5rem;
  white-space: pre-wrap;
`;

interface PropTypes {
  file?: any;
  index?: any;
  setFiles?: any;
  setDisableImageUpload?: any;
  setDisablePdfUpload?: any;
  files?: any;
  isPDF?: any;
}

const pdfIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
</svg>

const UploadedFile = ({ file, index, setFiles, setDisableImageUpload, setDisablePdfUpload, files, isPDF }: PropTypes) => {
  return (
    <Draggable draggableId={file.id} index={index}>
      {provided => (
        <UploadedFileCard
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <FileContainer>
            {/* <img
              src={URL.createObjectURL(file.fileObj)}
              alt='paper image'
              height={50}
              width={50}
              style={{ objectFit: 'cover' }}
            /> */}
            {
              isPDF ?
                <div style={{ display: 'flex', alignItems: 'center', height: '50px', width: '50px' }}>{pdfIcon}</div> :
                <img
                  src={URL.createObjectURL(file.fileObj)}
                  alt='paper image'
                  height={50}
                  width={50}
                  style={{ objectFit: 'cover' }}
                />
            }
            <Title>
              {file.fileObj?.name}
            </Title>
          </FileContainer>
          <Cross>
            <div style={{ backgroundColor: 'red', cursor: 'pointer', borderRadius: '9999px', padding: '0.25rem' }}>
              <svg
                onClick={() => {
                  if (files.length === 1) {
                    setDisableImageUpload(false);
                    setDisablePdfUpload(false);
                  }
                  console.log(files.length)
                  setFiles(files.filter((item:any) => item.id !== file.id))
                }}
                style={{ width: '1rem', color: 'white' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          </Cross>
        </UploadedFileCard>
      )}
    </Draggable>
  );
}

interface UploadedFilesPropTypes {
  files?: any;
  setFiles?: any;
  setDisableImageUpload?: any;
  setDisablePdfUpload?: any;
}

const UploadedFiles = ({ files, setFiles, setDisableImageUpload, setDisablePdfUpload }: UploadedFilesPropTypes) => {
  return (
    files.length > 0 && files.map((file: any, index: number) => {
      return (
        <UploadedFile
          file={file}
          index={index}
          key={file.id}
          setFiles={setFiles}
          setDisableImageUpload={setDisableImageUpload}
          setDisablePdfUpload={setDisablePdfUpload}
          files={files}
          isPDF={file.fileObj.type === 'application/pdf' ? true : false}
        />
      )
    })
  )
}

export default UploadedFiles;
