import { useMutation } from '@apollo/client';
import { useEffect, useState, useContext } from 'react';
import xw from 'xwind';
import { toast } from 'react-toastify';
import Loader from 'react-loader-spinner';

import Input from './Input';
import CompetitivePapersListContext from '../utils/competitivePapersListContext';
import { CREATE_COMPETITIVE } from '../utils/queries';

import 'react-toastify/dist/ReactToastify.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

toast.configure();

const styles = {
  container: xw`
    relative
    w-full
    p-4
    rounded
    border-1
    border-solid
    border-gray-300
    transition-all
    flex
    flex-col
    items-center
    bg-gray-50
    mb-4
  `,
  hidden: xw`
    h-0
    overflow-hidden
    transition-all
  `,
  label: xw`
    text-sm
    font-bold
  `,
  inlineEle: xw`
    p-1.5
    border-1 border-gray-300 border-solid
    mt-1
    outline-none
    rounded
    dark:bg-gray-700
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
};

const initialValues: {
  name: string;
} = {
  name: ''
};

interface PropTypes {
  isVisible?: any;
  name?: any;
  setIsVisible?: any;
  setNewCompetitive?: any;
  mainFormData?: any;
  setMainFormData?: any;
}

const CreateCompetitivePaperForm = ({ isVisible, name, setIsVisible, setNewCompetitive, mainFormData, setMainFormData }: PropTypes) => {
  const { competitivePapersList, setCompetitivePapersList } = useContext(CompetitivePapersListContext);

  const [formData, setFormData] = useState(initialValues);
  const [enableSubmit, setEnableSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [createCompetitive] = useMutation(CREATE_COMPETITIVE);

  useEffect(() => {
    setFormData({
      ...formData,
      'name': name
    })
  }, [name]);

  useEffect(() => {
    if (formData.name.length > 0)
      setEnableSubmit(true);
    else
      setEnableSubmit(false);
  }, [formData]);

  const handleClose = () => {
    setIsVisible(false);
    setFormData(initialValues)
  }

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setIsLoading(true);
    // @ts-ignore
    window.grecaptcha.ready(() => {
      // @ts-ignore
      window.grecaptcha.execute(process.env.RECAPTCHA_SITE_KEY_V3, { action: 'submit' })
        .then(async (token:any) => {
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
            setIsLoading(false);
          } else {
            createCompetitive({
              variables: {
                data: {
                  name: formData.name
                }
              }
            })
              .then(({ data }) => {
                let newCompetitive = { label: data.createCompetitivePaper.name, value: data.createCompetitivePaper.name, id: data.createCompetitivePaper.id }
                setCompetitivePapersList([...competitivePapersList, newCompetitive]);
                setNewCompetitive(newCompetitive);
                setMainFormData({
                  ...mainFormData,
                  'competitivePaper': newCompetitive || '',
                });
                setIsLoading(false);
                handleClose();
              })
              .catch(err => {
                console.log(err);
                toast.error('Unable to create!', {
                  position: 'bottom-right',
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                })
                setIsLoading(false);
              })
          }
        });
    });
  }

  return (
    <div css={!isVisible ? styles.hidden : styles.container}>
      {
        isLoading && (
          <div style={{ position: 'absolute', top: 0, width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'black', opacity: '0.2' }}>
            <Loader
              type='TailSpin'
              color='#ffffff'
              height={50}
              width={50}
            />
          </div>
        )
      }
      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <label css={styles.label}>Create University</label>
        <svg style={{ width: '1rem', cursor: 'pointer' }} onClick={handleClose} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <br></br>
      <div style={{ width: '100%' }}>
        <div style={{ width: '100%', display: 'flex' }}>
          <Input
            type='text'
            label='Name'
            value={name}
            isRequired={true}
            customStyles={{ marginRight: '1rem', fontSize: '0.75rem' }}
            disabled
          />
        </div>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {
            enableSubmit ?
              <button type='submit' css={styles.button} onClick={handleSubmit}>
                Create
              </button> :
              <button type='submit' css={styles.button} style={{ backgroundColor: 'gray', pointerEvents: 'none' }}>
                Create
              </button>
          }
        </div>
      </div>
    </div>
  )
}

export default CreateCompetitivePaperForm;
