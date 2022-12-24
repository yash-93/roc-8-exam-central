import { useMutation, useQuery } from '@apollo/client';
import xw from 'xwind';
import { useRouter } from 'next/router';
import { useEffect, useState, useContext } from 'react';
import { toast } from 'react-toastify';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import jsPDF from 'jspdf';
import Loader from 'react-loader-spinner';
import { SegmentedControl } from '@keystone-ui/segmented-control';

import Input from '../../components/Input';
import UploadedFiles from './UploadedFiles';
import CreateUniversityForm from '../CreateUniversityForm';
import CreateCourseForm from '../CreateCourseForm';
import CreateCompetitivePaperForm from '../CreateCompetitivePaperForm';
import Backdrop from '../Backdrop';
import RenderPDF from '../RenderPDF';
import { CREATE_PAPER, GET_UNIVERSITY_COURSES } from '../../utils/queries';
import CourseListContext from '../../utils/courseListContext';
import UserContext from '../../utils/userContext';

import 'react-toastify/dist/ReactToastify.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

toast.configure();

const styles = {
  formContainer: xw`
    w-full
    lg:w-4/5
    xl:w-4/6
    2xl:w-4/5
    py-8
    px-8
    shadow
    border-1 border-solid border-gray-100
  `,
  header: xw`
    w-full
    flex
    justify-between
    items-center
    py-2
    px-4
    bg-blue-500
    text-white
    font-bold
    tracking-wide
    shadow-lg
  `,
  bottomSection: xw`
    w-full
    flex
    justify-center
    sm:justify-end
    items-center
    mt-8
  `,
  nextBtn: xw`
    flex
    font-bold
    cursor-pointer
    transition-all
    text-blue-500
    hover:text-blue-700
  `,
  uploadSection: xw`
    w-full
    flex
    flex-col
    justify-center
    items-center
    border-1
    border-dashed
    border-gray-400
    rounded
    my-4
    py-6
    transition-all
  `,
  button: xw`
    flex
    justify-center
    items-center
    py-2
    px-4
    my-2
    md:my-0
    whitespace-nowrap
    rounded
    bg-blue-500
    text-white
    font-bold
    cursor-pointer
    mx-1
  `,
  transparentButton: xw`
    flex
    justify-center
    items-center
    py-1
    px-2
    my-2
    md:my-0
    whitespace-nowrap
    rounded
    text-blue-500
    border-blue-500
    border-2
    border-solid
    font-bold
    cursor-pointer
    hover:bg-blue-500
    hover:text-white
    transition-all
  `,
  buttonsContainer: xw`
    flex
    flex-col
    sm:flex-row
  `,
  fileUploadSectionHeader: xw`
    w-full
    flex
    justify-between
    items-center
  `
};

let globalIndex = 0;

const paperTypes = ['University'];

const initialValues: {
  name: string;
  paperCode: string;
  year: number;
  semester: number;
  type: string;
  original: any;
  university: any;
  course: any;
  competitivePaper: any;
} = {
  name: '',
  paperCode: '',
  year: 0,
  semester: 0,
  type: 'University',
  original: null,
  university: null,
  course: null,
  competitivePaper: null
};

const AddPaperForm = () => {
  const router = useRouter();

  const { user } = useContext(UserContext);

  const { courseList, setCourseList } = useContext(CourseListContext);

  const [page, setPage] = useState(1);
  const [files, setFiles] = useState([]);
  const [disableImageUpload, setDisableImageUpload] = useState(false);
  const [disablePdfUpload, setDisablePdfUpload] = useState(false);
  const [fileUploadError, setFileUploadError] = useState(null);
  const [pdfGenStart, setPdfGenStart] = useState(false);
  const [generatedPDF, setGeneratedPDF] = useState(null);
  const [ddoc, setDdoc] = useState(null);
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [preview, setPreview] = useState(false);
  const [showCreateUniversityForm, setShowCreateUniversityForm] = useState(false);
  const [showCreateCourseForm, setShowCreateCourseForm] = useState(false);
  const [showCreateCompetitivePaperForm, setShowCreateCompetitivePaperForm] = useState(false);
  const [newUniversity, setNewUniversity] = useState('');
  const [newCourse, setNewCourse] = useState('');
  const [newCompetitive, setNewCompetitive] = useState('');
  const [formData, setFormData] = useState(initialValues);
  const [paperType, setPaperType] = useState(0);

  const { data: selectedUniversity } = useQuery(GET_UNIVERSITY_COURSES, {
    variables: {
      where: {
        name: {
          equals: formData.university?.value
        }
      }
    }
  })

  useEffect(() => {
    //@ts-ignore
    let tempCourseList = [];
    selectedUniversity?.universities[0]?.courses?.map((course: any) => {
      tempCourseList.push({ label: course?.name, value: course?.value, id: course?.id });
    })
    //@ts-ignore
    setCourseList(tempCourseList);
  }, [selectedUniversity?.universities[0]?.courses]);

  const [createPaper] = useMutation(CREATE_PAPER);

  useEffect(() => {
    if (files.length === 0) {
      setPreview(false);
      setFormData({
        ...formData,
        'original': null
      })
      setDdoc(null);
    }
    setPreview(false);
    setGeneratedPDF(null);
  }, [files]);

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const reorder = (list: any, startIndex: any, endIndex: any) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result: any) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const reorderedTestFiles = reorder(
      files,
      result.source.index,
      result.destination.index
    );
    //@ts-ignore
    setFiles(reorderedTestFiles);
  }

  const handlePrevClick = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  }

  const handleNextClick = () => {
    if (page < 2) {
      setPage(page + 1);
    }
  }

  const handleChoosePaperImageFiles = () => {
    //@ts-ignore
    document.getElementById('paperImageFiles').click();
  }

  const handleChoosePaperPdf = () => {
    //@ts-ignore
    document.getElementById('paperPdf').click();
  }

  const getFileExtAndSize = (fileObj: any) => {
    return {
      fileSize: ((fileObj.size / 1024) / 1024).toFixed(4),
      extension: fileObj.name.substring(fileObj.name.lastIndexOf('.') + 1)
    }
  }

  const handleImageFilesUpload = (e: any) => {
    if (e?.target?.files?.length > 0) {
      let toBeUploaded = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const { fileSize } = getFileExtAndSize(e.target.files[i]);
        if (parseFloat(fileSize) > 1.5) {
          //@ts-ignore
          setFileUploadError('Please upload image with size not greater than 1.5MB.');
          continue;
        }
        globalIndex += 1;
        toBeUploaded.push({ id: globalIndex.toString(), fileObj: e.target.files[i] });
        setFileUploadError(null);
      }
      //@ts-ignore
      setFiles([...files, ...toBeUploaded]);
    } else if (e?.dataTransfer?.files?.length > 0) {
      let toBeUploaded = [];
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        const { fileSize } = getFileExtAndSize(e.dataTransfer.files[0]);
        if (parseFloat(fileSize) > 1.5) {
          //@ts-ignore
          setFileUploadError('Please upload image with size not greater than 1.5MB.');
          continue;
        }
        globalIndex += 1;
        toBeUploaded.push({ id: globalIndex.toString(), fileObj: e.dataTransfer.files[i] });
        setFileUploadError(null);
      }
      //@ts-ignore
      setFiles([...files, ...toBeUploaded]);
    }
    setDisablePdfUpload(true);
  }

  const handlePdfFileUpload = (e: any) => {
    if (e?.target?.files?.length > 0) {
      const { fileSize } = getFileExtAndSize(e.target.files[0]);
      if (parseFloat(fileSize) > 10.0) {
        //@ts-ignore
        setFileUploadError('PDF size can not exceed 10MB.')
      } else {
        globalIndex++;
        //@ts-ignore
        setFiles([...files, { id: globalIndex.toString(), fileObj: e.target.files[0] }]);
        setDisableImageUpload(true);
        setDisablePdfUpload(true);
        setFileUploadError(null);
        setFormData({
          ...formData,
          'original': e.target.files[0]
        })
      }
    } else if (e?.dataTransfer?.files?.length > 0) {
      const { fileSize } = getFileExtAndSize(e.dataTransfer.files[0]);
      if (parseFloat(fileSize) > 10.0) {
        //@ts-ignore
        setFileUploadError('PDF size can not exceed 10MB.')
      } else {
        globalIndex++;
        //@ts-ignore
        setFiles([...files, { id: globalIndex.toString(), fileObj: e.dataTransfer.files[0] }]);
        setDisableImageUpload(true);
        setDisablePdfUpload(true);
        setFileUploadError(null);
        setFormData({
          ...formData,
          'original': e.tdataTransferarget.files[0]
        })
      }
    }
  }

  const handleFileDragOver = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    var dropZone = document.getElementById('dropZone');
    //@ts-ignore
    dropZone.style.borderColor = 'blue';
    //@ts-ignore
    dropZone.style.borderWidth = 'thick';
    //@ts-ignore
    dropZone.style.backgroundColor = '#DBEAFE';
    e.dataTransfer.dropEffect = 'copy';
  }

  const handleFileDragLeave = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    var dropZone = document.getElementById('dropZone');
    //@ts-ignore
    dropZone.style.borderColor = '#A1A1AA';
    //@ts-ignore
    dropZone.style.borderWidth = 'thin';
    //@ts-ignore
    dropZone.style.backgroundColor = 'white';
  }

  const handleFileDrop = (e: any) => {
    e.stopPropagation();
    e.preventDefault();
    var dropZone = document.getElementById('dropZone');
    //@ts-ignore
    dropZone.style.borderColor = '#A1A1AA';
    //@ts-ignore
    dropZone.style.borderWidth = 'thin';
    //@ts-ignore
    dropZone.style.backgroundColor = 'white';
    const fileList = e.dataTransfer.files;
    if (files.length === 0 && fileList.length > 1 && fileList[0].type === 'application/pdf') {
      //@ts-ignore
      setFileUploadError('You can not upload more than one PDF.');
      return;
    }
    if (fileList.length === 1 && fileList[0].type === 'application/pdf') {
      if (files.length > 0) {
        //@ts-ignore
        setFileUploadError('You can not upload more than one PDF.')
      } else {
        handlePdfFileUpload(e);
      }
    } else {
      handleImageFilesUpload(e);
    }
  }

  const handleSubmitUniversityPaper = async (blobToPdfFile: any) => {
    // @ts-ignore
    window.grecaptcha.ready(() => {
      // @ts-ignore
      window.grecaptcha.execute(process.env.RECAPTCHA_SITE_KEY_V3, { action: 'submit' })
        .then(async (token: any) => {
          const res = await fetch('/api/recaptchav3', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'g-recaptcha-response': token
            })
          });
          const data = await res.json();
          if (data.error) {
            toast.error('Human verification failed!', {
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          } else {
            if (formData.name === '' || formData.paperCode === '' || formData.year === 0 || formData.semester === 0 || !formData.university || !formData.course) {
              toast.error('Fill all the details!', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            } else {
              if (formData.original || blobToPdfFile) {
                createPaper({
                  variables: {
                    data: {
                      name: formData.name,
                      paperCode: formData.paperCode,
                      year: formData.year,
                      semester: parseInt(formData.semester.toString()),
                      uploadedBy: {
                        connect: {
                          id: user.id
                        }
                      },
                      original: {
                        upload: formData.original || blobToPdfFile
                      },
                      university: {
                        connect: {
                          id: formData.university.id
                        }
                      },
                      course: {
                        connect: {
                          id: formData.course.id
                        }
                      },
                    }
                  }
                })
                  .then(({ data }) => {
                    console.log(data);
                    router.push(`/paper/${data.createPaper.name}?id=${data.createPaper.id}`);
                  })
                  .catch(err => {
                    toast.error('Unable to create paper!', {
                      position: 'bottom-right',
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                  })
              } else {
                toast.error('No file to upload!', {
                  position: 'bottom-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })
              }
            }
          }
        });
    });
  }

  const handleSubmitCompetitivePaper = async (blobToPdfFile: any) => {
    // @ts-ignore
    window.grecaptcha.ready(() => {
      // @ts-ignore
      window.grecaptcha.execute(process.env.RECAPTCHA_SITE_KEY_V3, { action: 'submit' })
        .then(async (token: any) => {
          const res = await fetch('/api/recaptchav3', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'g-recaptcha-response': token
            })
          });
          const data = await res.json();
          if (data.error) {
            toast.error('Human verification failed!', {
              position: 'bottom-right',
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
            })
          } else {
            if (formData.name === '' || formData.paperCode === '' || formData.year === 0 || !formData.competitivePaper) {
              toast.error('Fill all the details!', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
            } else {
              if (formData.original || blobToPdfFile) {
                createPaper({
                  variables: {
                    data: {
                      name: formData.name,
                      paperCode: formData.paperCode,
                      year: formData.year,
                      type: 'competitive',
                      original: {
                        upload: formData.original || blobToPdfFile
                      },
                      competitivePaper: {
                        connect: {
                          id: formData.competitivePaper.id
                        }
                      }
                    }
                  }
                })
                  .then(({ data }) => {
                    router.push(`/paper/${data.createPaper.name}?id=${data.createPaper.id}`);
                  })
                  .catch(err => {
                    toast.error('Unable to create paper!', {
                      position: 'bottom-right',
                      autoClose: 3000,
                      hideProgressBar: false,
                      closeOnClick: true,
                      pauseOnHover: true,
                      draggable: true,
                      progress: undefined,
                    })
                  })
              } else {
                toast.error('No file to upload!', {
                  position: 'bottom-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })
              }
            }
          }
        });
    });
  }

  const getDataURIs = (imgObj: any, index: number, totalFiles: any, cb: any) => {
    const reader = new FileReader();
    reader.onload = () => {
      let img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function () {
        var canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        var ctx = canvas.getContext('2d');
        //@ts-ignore
        ctx.save();
        ctx?.drawImage(img, 0, 0);
      }
      //@ts-ignore
      img.src = reader.result;
      if (index === totalFiles - 1) {
        setPdfGenStart(false);
        setPreview(true);
      }
      cb(reader.result);
    }
    reader.readAsDataURL(imgObj);
  }

  const closeBackdrop = (e: any) => {
    if (!e.target.id)
      setShowBackdrop(false);
  }

  const handleSegmentedControlChange = (i: any) => {
    setPaperType(i);
    setFormData({
      ...formData,
      'type': paperTypes[i],
    });
  }
  return (
    <>
      {
        showBackdrop &&
        <Backdrop hide={closeBackdrop}>
          <div id='generatedPdfPreview'>
            {/* @ts-ignore */}
            <RenderPDF pdf={ddoc.output('bloburi')} />
          </div>
        </Backdrop>
      }
      {
        pdfGenStart &&
        <Backdrop customStyles={{ opacity: 0.7 }}>
          <div style={{ width: '100%', height: '90%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Loader
              type='TailSpin'
              color='#ffffff'
              height={50}
              width={50}
            />
          </div>
        </Backdrop>
      }
      <form
        css={styles.formContainer}
        onSubmit={paperTypes[paperType] === 'University' ? (
          async (e) => {
            e.preventDefault();
            if (formData.name === '' || formData.paperCode === '' || formData.year === 0 || formData.semester === 0 || !formData.university || !formData.course || !formData.original) {
              toast.error('Fill all the details!', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
              return;
            }
            setPdfGenStart(true);
            var doc = new jsPDF('p', 'mm', 'a4');
            var width = doc.internal.pageSize.getWidth();
            var height = doc.internal.pageSize.getHeight();
            files.map((file, index) => {
              //@ts-ignore
              getDataURIs(file.fileObj, index, files.length, (uri) => {
                doc.addImage(uri, 'jpeg', 0, 0, width, height);
                if (index !== files.length - 1) doc.addPage();
                if (index === files.length - 1) {
                  //@ts-ignore
                  setDdoc(doc);
                  let blobToPdfFile = new File([doc.output('blob')], 'paper.pdf', {
                    type: 'application/pdf'
                  });
                  setPdfGenStart(false);
                  handleSubmitUniversityPaper(blobToPdfFile);
                }
              });
            })
          }
        ) : (
          async (e) => {
            e.preventDefault();
            if (formData.name === '' || formData.paperCode === '' || formData.year === 0 || !formData.competitivePaper || !formData.original) {
              toast.error('Fill all the details!', {
                position: 'bottom-right',
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              })
              return;
            }
            setPdfGenStart(true);
            var doc = new jsPDF('p', 'mm', 'a4');
            var width = doc.internal.pageSize.getWidth();
            var height = doc.internal.pageSize.getHeight();
            files.map((file, index) => {
              //@ts-ignore
              getDataURIs(file.fileObj, index, files.length, (uri) => {
                doc.addImage(uri, 'jpeg', 0, 0, width, height);
                if (index !== files.length - 1) doc.addPage();
                if (index === files.length - 1) {
                  //@ts-ignore
                  setDdoc(doc);
                  let blobToPdfFile = new File([doc.output('blob')], 'paper.pdf', {
                    type: 'application/pdf'
                  });
                  setPdfGenStart(false);
                  handleSubmitCompetitivePaper(blobToPdfFile);
                }
              });
            })
          }
        )}
      >
        {
          page === 1 && (
            <>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                <SegmentedControl
                  segments={paperTypes}
                  animate={true}
                  onChange={handleSegmentedControlChange}
                  marginBottom='large'
                  initialIndex={paperType}
                />
              </div>
              <Input
                type='text'
                label='Name'
                value={formData.name}
                isRequired={true}
                onChange={handleInputChange}
              />
              {
                paperTypes[paperType] === 'Competitive' && (
                  <>
                    <Input
                      type='select'
                      label='Papers'
                      value='competitivePapers'
                      isRequired={true}
                      formData={formData}
                      onChange={setFormData}
                      setShowCreateCompetitivePaperForm={setShowCreateCompetitivePaperForm}
                      setNewCompetitive={setNewCompetitive}
                    />
                    <CreateCompetitivePaperForm
                      isVisible={showCreateCompetitivePaperForm}
                      setIsVisible={setShowCreateCompetitivePaperForm}
                      name={newCompetitive}
                      setNewCompetitive={setNewCompetitive}
                      mainFormData={formData}
                      setMainFormData={setFormData}
                    />
                  </>
                )
              }
              {
                paperTypes[paperType] === 'University' && (
                  <>
                    <Input
                      type='select'
                      label='University'
                      value='universities'
                      isRequired={true}
                      formData={formData}
                      onChange={setFormData}
                      setShowCreateUniversityForm={setShowCreateUniversityForm}
                      setNewUniversity={setNewUniversity}
                    />
                    <CreateUniversityForm
                      isVisible={showCreateUniversityForm}
                      setIsVisible={setShowCreateUniversityForm}
                      name={newUniversity}
                      setNewUniversity={setNewUniversity}
                      mainFormData={formData}
                      setMainFormData={setFormData}
                    />
                    <Input
                      type='select'
                      label='Course'
                      value='courses'
                      options={courseList}
                      isRequired={true}
                      formData={formData}
                      onChange={setFormData}
                      setShowCreateCourseForm={setShowCreateCourseForm}
                      setNewCourse={setNewCourse}
                    />
                    <CreateCourseForm
                      isVisible={showCreateCourseForm}
                      setIsVisible={setShowCreateCourseForm}
                      name={newCourse}
                      setNewCourse={setNewCourse}
                      university={formData.university}
                      mainFormData={formData}
                      setMainFormData={setFormData}
                    />
                  </>
                )
              }
              <Input
                type='select'
                label='Year'
                value='years'
                isRequired={true}
                formData={formData}
                onChange={setFormData}
              />
              {
                paperTypes[paperType] === 'University' && (
                  <Input
                    type='select'
                    label='Semester'
                    value='semesters'
                    isRequired={true}
                    formData={formData}
                    onChange={setFormData}
                  />
                )
              }
              <Input
                type='text'
                label='Paper Code'
                value={formData.paperCode}
                isRequired={true}
                onChange={handleInputChange}
              />
            </>
          )
        }
        {
          page === 2 && (
            <div>
              <span style={{ fontWeight: 'bold', width: '100%', display: 'flex', justifyContent: 'center', fontSize: '1.25rem' }}>Upload Files</span>
              <div css={styles.uploadSection} id='dropZone' onDrop={handleFileDrop} onDragOver={handleFileDragOver} onDragLeave={handleFileDragLeave}>
                <svg style={{ width: '5rem', marginBottom: '0.75rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span style={{ fontWeight: 'bold' }}>{`Drag & Drop your files here`}</span>
                <span style={{ fontWeight: 'bold', marginTop: '0.75rem' }}>OR</span>
                <div css={styles.buttonsContainer}>
                  <div
                    css={styles.button}
                    style={{
                      marginTop: '0.75rem',
                      pointerEvents: `${disableImageUpload ? 'none' : 'auto'}`,
                      backgroundColor: `${disableImageUpload ? 'gray' : '#3B82F6'}`
                    }}
                    onClick={handleChoosePaperImageFiles}
                  >
                    Browse Images
                  </div>
                  <div
                    css={styles.button}
                    style={{
                      marginTop: '0.75rem',
                      pointerEvents: `${disablePdfUpload ? 'none' : 'auto'}`,
                      backgroundColor: `${disablePdfUpload ? 'gray' : '#3B82F6'}`
                    }}
                    onClick={handleChoosePaperPdf}
                  >
                    Choose PDF
                  </div>
                </div>
                <input
                  type='file'
                  name='paperImageFiles'
                  id='paperImageFiles'
                  accept='image/jpeg, image/png'
                  onChange={handleImageFilesUpload}
                  hidden
                  multiple
                />
                <input
                  type='file'
                  name='paperPdf'
                  id='paperPdf'
                  accept='application/pdf'
                  onChange={handlePdfFileUpload}
                  hidden
                />
              </div>
              <span style={{ width: '100%', display: 'flex', justifyContent: 'center', color: 'red' }}>{fileUploadError}</span>
              <div style={{ marginTop: '2rem' }}>
                <div css={styles.fileUploadSectionHeader}>
                  <span style={{ fontWeight: 'bold' }}>Uploaded Files</span>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId='list'>
                    {(provided: any) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        <UploadedFiles
                          files={files}
                          setFiles={setFiles}
                          setDisableImageUpload={setDisableImageUpload}
                          setDisablePdfUpload={setDisablePdfUpload}
                        />
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>

                {/* preview button */}
                {
                  (files.length > 0 && !disableImageUpload && disablePdfUpload) && (
                    <div css={styles.button} onClick={async () => {
                      setPdfGenStart(true);
                      var doc = new jsPDF('p', 'mm', 'a4');
                      var width = doc.internal.pageSize.getWidth();
                      var height = doc.internal.pageSize.getHeight();
                      files.map((file, index) => {
                        //@ts-ignore
                        getDataURIs(file.fileObj, index, files.length, (uri) => {
                          doc.addImage(uri, 'jpeg', 0, 0, width, height);
                          if (index !== files.length - 1) doc.addPage();
                          if (index === files.length - 1) {
                            //@ts-ignore
                            setDdoc(doc);
                            let blobToPdfFile = new File([doc.output('blob')], 'paper.pdf', {
                              type: 'application/pdf'
                            });
                            //@ts-ignore
                            setGeneratedPDF(blobToPdfFile);
                            setFormData({
                              ...formData,
                              'original': blobToPdfFile
                            })
                          }
                        });
                      })
                      setTimeout(() => {
                        setShowBackdrop(true);
                      }, 1000);
                    }}>
                      Show Preview
                      <svg style={{ width: '1rem', marginLeft: '0.25rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </div>
                  )
                }
              </div>
            </div>
          )
        }
        <div css={styles.bottomSection}>
          <div css={styles.nextBtn} onClick={handlePrevClick}>
            <svg style={{ width: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </div>
          <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}></div>
          {
            page !== 2 ?
              <div css={styles.nextBtn} onClick={handleNextClick}>
                Next
                <svg style={{ width: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
              :
              <button type='submit' css={styles.transparentButton}>
                Submit
              </button>
          }
        </div>
      </form >
    </>
  )
}

export default AddPaperForm;
