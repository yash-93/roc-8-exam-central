import xw from 'xwind';
import { useState, useContext } from 'react';
import { css } from '@emotion/css';
//@ts-ignore
import Select from 'react-select';
//@ts-ignore
import CreatableSelect from 'react-select/creatable';

import UniversityListContext from '../utils/universityListContext';
import CompetitivePapersListContext from '../utils/competitivePapersListContext';

const styles = {
  inputContainer: xw`
    w-full
    flex
    flex-col
    mb-6
  `,
  input: xw`
    w-full
    p-1.5
    mt-1
    rounded
    outline-none
    border-1 border-gray-300 border-solid
  `,
  label: xw`
    font-bold
  `
}

const dropdown = css`
  padding: 0.1rem;
  margin-top: 0.15rem;
`;

//@ts-ignore
const years = [];
for (let i = 1950; i <= 2021; i++) {
  years.push({ label: i, value: i });
}

const semesters = [
  { label: '1', value: '1' },
  { label: '2', value: '2' },
  { label: '3', value: '3' },
  { label: '4', value: '4' },
  { label: '5', value: '5' },
  { label: '6', value: '6' },
  { label: '7', value: '7' },
  { label: '8', value: '8' },
  { label: '9', value: '9' },
  { label: '10', value: '10' }
];

const courses = [
  { label: 'MCA', value: 'MCA' },
  { label: 'BCA', value: 'BCA' },
  { label: 'M.Sc.', value: 'M.Sc.' },
  { label: 'B.Sc.', value: 'B.Sc.' }
];

interface InputType {
  type?: string;
  label?: string;
  value?: string;
  options?: any;
  isRequired?: boolean;
  setShowCreateUniversityForm?: any;
  setNewUniversity?: any;
  setShowCreateCompetitivePaperForm?: any;
  setNewCompetitive?: any;
  setShowCreateCourseForm?: any;
  setNewCourse?: any;
  customStyles?: any;
  disabled?: boolean;
  onChange?: any;
  formData?: any;
}

function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

const Input = ({ type, label, value, options, isRequired, setShowCreateUniversityForm, setNewUniversity, setShowCreateCompetitivePaperForm, setNewCompetitive, setShowCreateCourseForm, setNewCourse, onChange, formData, disabled, customStyles }: InputType) => {
  const { universityList } = useContext(UniversityListContext);
  const { competitivePapersList } = useContext(CompetitivePapersListContext);

  const [university, setUniversity] = useState(null);
  const [course, setCourse] = useState(null);
  const [year, setYear] = useState(null);
  const [semester, setSemester] = useState(null);
  const [semesterSystem, setSemesterSystem] = useState(null);
  const [competitive, setCompetitive] = useState(null);

  const handleUniversityChange = (newUniversity: any) => {
    const isNew = newUniversity?.__isNew__;
    if (isNew) {
      setNewUniversity(newUniversity.value);
      setShowCreateUniversityForm(true);
    } else {
      setShowCreateUniversityForm(false);
    }
    setUniversity(newUniversity);
    onChange({
      ...formData,
      'university': newUniversity || '',
    });
  };

  const handleCompetitiveChange = (newCompetitive: any) => {
    const isNew = newCompetitive?.__isNew__;
    if (isNew) {
      setNewCompetitive(newCompetitive.value);
      setShowCreateCompetitivePaperForm(true);
    } else {
      setShowCreateCompetitivePaperForm(false);
    }
    setCompetitive(newCompetitive);
    onChange({
      ...formData,
      'competitivePaper': newCompetitive || '',
    });
  };

  const handleCourseChange = (newCourse: any) => {
    const isNew = newCourse?.__isNew__;
    if (isNew) {
      setNewCourse(newCourse.value);
      setShowCreateCourseForm(true);
    } else {
      setShowCreateCourseForm(false);
    }
    setCourse(newCourse);
    onChange({
      ...formData,
      'course': newCourse || '',
    });
  };

  return (
    <div css={styles.inputContainer} style={customStyles}>
      <label css={styles.label}>
        {label}
        {
          isRequired && (
            <span style={{ color: 'red' }}>{` *`}</span>
          )
        }
      </label>
      {
        type === 'select' ?
          <>
            {value === 'years' && (
              <Select
                value={year}
                onChange={(selectedOption: any) => {
                  setYear(selectedOption);
                  onChange({
                    ...formData,
                    'year': selectedOption.value,
                  });
                }}
                //@ts-ignore
                options={years}
                className={dropdown}
              />
            )}
            {value === 'semesters' && (
              <Select
                value={semester}
                onChange={(selectedOption: any) => {
                  setSemester(selectedOption);
                  onChange({
                    ...formData,
                    'semester': selectedOption.value,
                  });
                }}
                options={semesters}
                className={dropdown}
              />
            )}
            {value === 'universities' && (
              <CreatableSelect
                isClearable
                onChange={handleUniversityChange}
                options={universityList}
                value={university}
              />
            )}
            {value === 'courses' && (
              <CreatableSelect
                isClearable
                onChange={handleCourseChange}
                options={options}
                value={course}
              />
            )}
            {value === 'competitivePapers' && (
              <CreatableSelect
                isClearable
                onChange={handleCompetitiveChange}
                options={competitivePapersList}
                value={competitive}
              />
            )}
            {value === 'semesterSystem' && (
              <Select
                isClearable
                value={semesterSystem}
                onChange={(selectedOption: any) => {
                  setSemesterSystem(selectedOption);
                  onChange({
                    ...formData,
                    'semesterSystem': selectedOption?.value || '',
                  });
                }}
                options={options}
                styles={{
                  control: (base: any) => ({
                    ...base,
                    height: 32.5,
                    minHeight: 32.5,
                    marginTop: '0.25rem'
                  })
                }}
              />
            )}
          </>
          :
          type === 'file' ?
            <input
              type={type}
              css={styles.input}
              name={camelize(label || '')}
              value={value}
              placeholder={label}
              disabled={disabled}
              onChange={onChange}
              accept='image/jpeg, image/png'
            /> :
            <input
              type={type}
              css={styles.input}
              name={camelize(label || '')}
              value={value}
              placeholder={label}
              disabled={disabled}
              onChange={onChange}
            />
      }
    </div>
  )
}

export default Input;
