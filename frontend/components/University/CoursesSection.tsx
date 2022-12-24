import { useQuery } from '@apollo/client';
import xw from 'xwind';
import { Fragment, useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import { css } from '@emotion/css';
import Loader from 'react-loader-spinner';

import CourseCard from '../CourseCard';
import { GET_PAGINATED_UNIVERSITY_COURSES } from '../../utils/queries';

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const styles = {
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
  `
};

const pagination = css`
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 1%;
    padding-bottom: 1%;
    a {
      color: gray;
    }
  `;

const pageClass = css`
    font-weight: bold;
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;

const pagination__link__classname = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    width: 40px;
    border-bottom: 3px solid white;
    &:hover {
      border-bottom: 3px solid #3B82F6;
    }
  `;

const pagination__link = css`
    font-weight: bold;
    cursor: pointer;
    margin-right: 20px;
    margin-left: 20px;
  `;

const pagination__link__active = css`
    a {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 40px;
      width: 40px;
      border-bottom: 3px solid #3B82F6;
      & {
        color: #3B82F6;
      }
    }
  `;

const pagination__link__disabled = css`
    a {
      color: rgb(198, 197, 202);
    }
  `;

  interface PropTypes {
    chunkSize?: any;
    universityName?: any;
  }
  
  const CoursesSection = ({ chunkSize, universityName }: PropTypes) => {
  const { data, loading } = useQuery(GET_PAGINATED_UNIVERSITY_COURSES, {
    variables: {
      where: {
        university: {
          name: {
            equals: universityName
          }
        }
      }
    }
  })

  const [filteredCourses, setFilteredCourses] = useState(data?.allCourses || []);
  const [currentPageCourses, setCurrentPageCourses] = useState([]);

  const PER_PAGE = chunkSize;

  useEffect(() => {
    setFilteredCourses(data?.courses || []);
    let newCourses = data?.courses?.slice(0, 0 + PER_PAGE);
    setCurrentPageCourses(newCourses);
  }, [data?.courses]);

  const handlePaginationClick = ({ selected: selectedPage }: any) => {
    const offset = selectedPage * PER_PAGE;
    let newCourses = filteredCourses.slice(offset, offset + PER_PAGE);
    setCurrentPageCourses(newCourses);
  }

  const pageCount = Math.ceil(filteredCourses?.length / PER_PAGE);

  return (
    <div style={{ width: '100%' }}>
      <div css={styles.header} style={{ backgroundColor: '#CEE4FE', borderTop: '1px solid white', color: 'GrayText' }}>
        <span>Courses Offered</span>
        <svg style={{ width: '2rem', cursor: 'pointer', opacity: 0, pointerEvents: 'none' }} xmlns='http://www.w3.org/2000/svg' className='h-6 w-6' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6v6m0 0v6m0-6h6m-6 0H6' />
        </svg>
      </div>
      <div css={styles.contentSection} id='list' >
        {
          loading && (
            <div style={{ width: '100%', height: '100px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Loader
                type='TailSpin'
                color='#000'
                height={50}
                width={50}
              />
            </div>
          )
        }
        {
          currentPageCourses?.map((course:any) => (
            <CourseCard
              key={course.id}
              course={course}
              isDraft={course.status === 'draft' ? true : false}
            />
          ))
        }
        <div style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
          {/* @ts-ignore */}
          <ReactPaginate
            previousLabel={`<`}
            nextLabel={'>'}
            pageCount={pageCount}
            onPageChange={handlePaginationClick}
            containerClassName={`${pagination}`}
            pageClassName={`${pageClass}`}
            pageLinkClassName={`${pagination__link__classname}`}
            previousLinkClassName={`${pagination__link}`}
            nextLinkClassName={`${pagination__link}`}
            disabledClassName={`${pagination__link__disabled}`}
            activeClassName={`${pagination__link__active}`}
          />
        </div>
      </div>
    </div>
  )
}

export default CoursesSection;
