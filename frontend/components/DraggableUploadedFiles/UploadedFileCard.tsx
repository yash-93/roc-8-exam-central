import xw from 'xwind';

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

const pdfIcon = <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
</svg>

interface PropTypes {
  title?: any;
  src?: any;
  isPDF?: any;
}

const UploadedFileCard = ({ title, src, isPDF }: PropTypes) => {
  return (
    <div css={styles.cardContainer}>
      <div css={styles.fileContainer}>
        {
          isPDF ?
            <div style={{ display: 'flex', alignItems: 'center', height: '50px', width: '50px' }}>{pdfIcon}</div>
            :
            <img
              src={URL.createObjectURL(src)}
              alt='paper image' height={50} width={50}
              style={{ objectFit: 'cover' }}
            />
        }
        <span style={{ marginLeft: '0.5rem' }}>{title}</span>
      </div>
      <div
        css={styles.cross}
      // onClick={() => {
      //   handler(gallery.filter(item => item.id !== galleryElement.id))
      // }}
      >
        <svg style={{ width: '1rem', color: 'white' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
    </div>
  )
}

export default UploadedFileCard;
