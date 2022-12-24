import xw from 'xwind';
import Link from 'next/link';
import { toast } from 'react-toastify';

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
}

interface PropTypes {
  course?: any;
  isDraft?: any;
  customStyles?: any;
}

const CourseCard = ({ course, isDraft, customStyles }: PropTypes) => {
  return (
    <div css={styles.container} style={customStyles}>
      <Link href={`/course/${course.name}?id=${course?.id}`}>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span css={styles.title}>
            {course.name}
            {
              isDraft && (
                <span css={styles.draftTag}>{` draft`}</span>
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
    </div>
  )
}

export default CourseCard;
