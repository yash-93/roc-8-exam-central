import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import xw from 'xwind';
//@ts-ignore
import Select from 'react-select';
import { useRouter } from 'next/router';

import ResultCard from '../ResultCard';
import {
  GET_PAPERS_BY_UNIVERSITY_COURSE_NAME,
  GET_PAPERS_BY_UNIVERSITY_COURSE_NAME_SEMESTER,
  GET_PAPERS_BY_UNIVERSITY_COURSE_YEAR,
  GET_PAPERS_BY_UNIVERSITY_COURSE_SEMESTER_YEAR
} from '../../utils/queries';

const styles = {
  header: xw`
    w-full
    flex
    flex-col
    md:flex-row
    justify-between
    items-center
    py-2
    px-4
    bg-blue-500
    text-white
    font-bold
    tracking-wide
  `,
  contentSection: xw`
    w-full
    flex
    flex-col
    justify-center
    items-center
    p-6
    mb-8
    shadow
    border-1 border-solid border-gray-100
  `,
}

interface PropTypes {
  course?: any;
  semesters?: any;
  minYear?: any;
  maxYear?: any;
}

const PapersSection = ({ course, semesters, minYear, maxYear }: PropTypes) => {
  const router = useRouter();

  let papers = [];

  const qUniversity = course?.university?.name || '';
  const qCourse = course?.name || '';
  const qSemester = router.query?.semester || '';
  const qYear = router.query?.year || '';

  const [year, setYear] = useState(qYear?.length > 0 ? { value: qYear, label: qYear } : { value: '', label: 'year' });
  const [semester, setSemester] = useState(qSemester?.length > 0 ? { value: qSemester, label: qSemester } : { value: '', label: 'semester' });

  const { data: papersByUniversityCourse } = useQuery(GET_PAPERS_BY_UNIVERSITY_COURSE_NAME, {
    variables: {
      where: {
        AND: [
          { university: { name: { equals: qUniversity } } },
          { course: { name: { equals: qCourse } } }
        ]
      }
    }
  });
  if (papersByUniversityCourse && papersByUniversityCourse.papers) {
    papers = papersByUniversityCourse.papers;
  }

  const { data: papersByUniversityCourseSemester } = useQuery(GET_PAPERS_BY_UNIVERSITY_COURSE_NAME_SEMESTER, {
    variables: {
      where: {
        AND: [
          { university: { name: { equals: qUniversity } } },
          { course: { name: { equals: qCourse } } },
          { semester: { equals: parseInt(semester.value.toString()) } }
        ]
      }
    }
  });
  if (papersByUniversityCourseSemester && papersByUniversityCourseSemester.papers) {
    papers = papersByUniversityCourseSemester.papers;
  }

  const { data: papersByUniversityCourseYear } = useQuery(GET_PAPERS_BY_UNIVERSITY_COURSE_YEAR, {
    variables: {
      where: {
        AND: [
          { university: { name: { equals: qUniversity } } },
          { course: { name: { equals: qCourse } } },
          { year: { equals: parseInt(year.value.toString()) } }
        ]
      }
    }
  });
  if (papersByUniversityCourseYear && papersByUniversityCourseYear.papers) {
    papers = papersByUniversityCourseYear.papers;
  }

  const { data: papersByUniversityCourseSemesterYear } = useQuery(GET_PAPERS_BY_UNIVERSITY_COURSE_SEMESTER_YEAR, {
    variables: {
      where: {
        AND: [
          { university: { name: { equals: qUniversity } } },
          { course: { name: { equals: qCourse } } },
          { year: { equals: parseInt(year.value.toString()) } },
          { semester: { equals: parseInt(semester.value.toString()) } }
        ]
      }
    }
  });
  if (papersByUniversityCourseSemesterYear && papersByUniversityCourseSemesterYear.papers) {
    papers = papersByUniversityCourseSemesterYear.papers;
  }

  let semesterDropDownOptions = [];
  for (let i = 1; i <= semesters; i++)
    semesterDropDownOptions.push({ label: i.toString(), value: i.toString() });

  let yearDropDownOptions = [];
  for (let i = 0; i < parseInt(maxYear) - parseInt(minYear) + 1; i++)
    yearDropDownOptions.push({ label: minYear + i, value: minYear + i });

  return (
    <div style={{ width: '100%' }}>
      <div css={styles.header}>
        <span>Papers</span>
        <div style={{ display: 'flex', fontWeight: 'normal', color: 'black' }}>
          <div style={{ width: '100%', maxWidth: '150px', minWidth: '135px', margin: '0.5rem' }}>
            <Select
              value={semester}
              options={semesterDropDownOptions}
              onChange={(selectedOption: any) => setSemester(selectedOption || { label: '', value: '' })}
            />
          </div>
          <div style={{ width: '100%', maxWidth: '150px', minWidth: '100px', margin: '0.5rem' }}>
            <Select
              value={year}
              options={yearDropDownOptions}
              onChange={(selectedOption: any) => setYear(selectedOption || { label: '', value: '' })}
            />
          </div>
        </div>
      </div>
      <div css={styles.contentSection}>
        {
          papers?.map((paper: any) => (
            <ResultCard key={paper.id} paper={paper} isCourse={false} />
          ))
        }
      </div>
    </div>
  )
}

export default PapersSection;
