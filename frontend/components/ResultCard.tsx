import { useMutation } from '@apollo/client';
import { useContext, useState } from 'react';
import xw from 'xwind';
import Link from 'next/link';
import { toast } from 'react-toastify';

import UserContext from '../utils/userContext';
import { REMOVE_BOOKMARK } from '../utils/queries';

import 'react-toastify/dist/ReactToastify.css';

toast.configure();

const styles = {
  container: xw`
    w-full
    relative
    flex
    justify-between
    items-center
    p-3
    sm:p-5
    xl:p-6
    overflow-hidden
    bg-white
    hover:bg-gray-100
    cursor-pointer
    transition-all
    border-b-1
    border-solid
    border-gray-200
  `,
  title: xw`
    font-bold
    tracking-wide
    pb-2
    text-xl
  `,
  subTitle: xw`
    text-sm
  `,
  draftTag: xw`
    text-red-500
    text-sm
  `,
  crossIcon: xw`
    text-gray-300
    hover:text-red-500
    transition-all
    transform
    hover:scale-125
  `,
  upDownArrow: xw`
    text-gray-500
    transition-all
    transform
    hover:scale-125
    cursor-pointer
  `,
}

interface PropTypes {
  paper?: any;
  isDraft?: any;
  isBookmark?: any;
  isCourse?: any;
  course?: any;
  allBookmarkedPapers?: any;
  setAllBookmarkedPapers?: any;
  customStyles?: any;
}

const ResultCard = ({ paper, isDraft, isBookmark, isCourse, course, allBookmarkedPapers, setAllBookmarkedPapers, customStyles }: PropTypes) => {
  const { user } = useContext(UserContext);

  const [removeBookmark] = useMutation(REMOVE_BOOKMARK);

  const handleRemovePaper = () => {
    removeBookmark({
      variables: {
        where: {
          id: user.id
        },
        data: {
          bookmarks: {
            disconnect: {
              id: paper.id
            }
          }
        }
      }
    })
      .then(() => {
        setAllBookmarkedPapers(allBookmarkedPapers.filter((bookmarkedPaper:any) => bookmarkedPaper.id !== paper.id));
      })
      .catch(err => {
        toast.error('Something went wrong.', {
          position: 'bottom-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      })
  }

  return (
    <>
      <div css={styles.container} style={customStyles}>
        {
          isCourse && (
            <Link href={`/course/${course.name}?id=${course?.id}`}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span css={styles.title}>
                  {
                    isCourse && (
                      <>
                        {course.name}
                      </>
                    )
                  }
                </span>
                <span css={styles.subTitle}>
                  {
                    course?.papers?.length > 0 ?
                      `${course?.papers?.length || 0} papers | ${course?.papers[course?.papers?.length - 1]?.year} - ${course?.papers[0].year}` :
                      'No papers available yet.'
                  }
                </span>
              </div>
            </Link>
          )
        }
        {
          !isCourse && (
            <Link href={`/paper/${paper?.name}?id=${paper?.id}`}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span css={styles.title}>
                  {`${paper?.course?.name} ${paper?.semester} Sem ${paper?.name}, ${paper?.year}`}
                  {
                    isDraft && (
                      <span css={styles.draftTag}>{` draft`}</span>
                    )
                  }
                </span>
                <span css={styles.subTitle}>
                  {`${paper?.university?.name} | ${paper?.course?.name} | ${paper?.semester} Semester | ${paper?.name} | ${paper?.year}`}
                </span>
              </div>
            </Link>
          )
        }
        {
          isBookmark &&
          <div css={styles.crossIcon} onClick={handleRemovePaper}>
            <svg style={{ width: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        }
      </div>
    </>
  )
}

export default ResultCard;
