import xw from 'xwind';
import Link from 'next/link';

import PaddedContainer from './PaddedContainer';

const styles = {
  footer: xw`
    w-full
    bg-gray-100
  `,
  section: xw`
    flex
    flex-col
    md:flex-row
  `,
  sectionEntry: xw`
    m-1
    cursor-pointer
    text-gray-500
    hover:text-gray-600
  `
}

interface PropTypes {
  title?: any;
  universities?: any;
}

function camelize(str: string) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/\s+/g, '');
}

const pages = ['Home', 'Contributions', 'Add Paper'];

const emailIcon = <svg style={{ width: '1.5rem' }} xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
</svg>

const Section = ({ title, universities }: PropTypes) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <span style={{ fontWeight: 'bold', margin: '0.25rem' }}>{title}</span>
      {
        title === 'Contact Us' && (
          <>
            <span>Exam Central</span>
            2620,  Mudlick Road
            <br></br>
            Walla Walla, WA
            <br></br>
            Washington - 99362
            <br></br>
            <br></br>
            <div style={{ display: 'flex', color: 'gray' }}>
              {emailIcon}
              <p style={{ marginLeft: '0.5rem' }}>heisenberg@meramail.com</p>
            </div>
          </>
        )
      }
      {
        universities && (
          <>
            {
              universities?.map((university: any, index: number) => {
                if (index > 4) {
                  return;
                }
                return (
                  <Link
                    key={index}
                    href={`/university/${university.name}?id=${university.id}`}
                  >
                    <span
                      key={index}
                      css={styles.sectionEntry}
                    >
                      {university?.name}
                    </span>
                  </Link>
                )
              })
            }
          </>
        )
      }
      {
        title === 'Links' && (
          <>
            {
              pages?.map((page, index) => (
                <Link key={index} href={page !== 'Home' ? `/${camelize(page)}`: ''}>
                  <span
                    css={styles.sectionEntry}
                  >
                    {page}
                  </span>
                </Link>
              ))
            }
          </>
        )
      }
    </div>
  )
}

const Footer = ({ universities }: PropTypes) => {
  return (
    <footer css={styles.footer}>
      <PaddedContainer customStyles={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
        <div css={styles.section} style={{ width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-evenly' }}>
          <Section title='Contact Us'></Section>
          <Section title='Links'></Section>
          <Section title='Universities' universities={universities}></Section>
        </div>
        <p style={{ marginTop: '2rem' }}>Copyright &#169; Exam Central 2021</p>
      </PaddedContainer>
    </footer>
  )
}

export default Footer;
