import xw from 'xwind';

import ResultCard from '../ResultCard';

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
  `,
}

interface PropTypes {
  course?: any;
}

const CourseDetailsSection = ({ course }: PropTypes) => {
  return (
    <div style={{ width: '100%' }}>
      <div css={styles.header} style={{ display: 'flex', justifyContent: 'center' }}>
        <span style={{ fontSize: '1.75rem', fontWeight: 'bold' }}>
          {course.name}
        </span>
      </div>
      <div css={styles.contentSection}>
        <div style={{ width: '100%', paddingTop: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 'bold' }}>University :</span>
            {` ${course?.university?.name || ''}`}
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 'bold' }}>Code :</span>
            {` ${course?.courseCode || ''}`}
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 'bold' }}>Duration :</span>
            {` ${course?.duration || ''} years`}
          </div>
          <div style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>
            <span style={{ fontWeight: 'bold' }}>Semesters :</span>
            {` ${parseInt(course?.semesterSystem) * parseFloat(course?.duration)}`}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailsSection;
