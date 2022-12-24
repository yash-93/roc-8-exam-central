import xw from 'xwind';

const styles = {
  label: xw`
    text-2xl
    md:text-4xl
    font-bold
    text-gray-800
    pb-4
  `
}

interface PropTypes {
  heading?: any;
}

const Heading = ({ heading }: PropTypes) => {
  return (
    <div css={styles.label}>
      {
        heading
      }
    </div>
  )
}

export default Heading;
