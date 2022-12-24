import { useQuery } from '@apollo/client';
import { useState } from 'react';
import xw from 'xwind';
//@ts-ignore
import Select from 'react-select';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { Carousel } from 'react-responsive-carousel';

import Container from './Container';
import PaddedContainer from './PaddedContainer';
import Heading from './Heading';
import Footer from './Footer';
import {
  GET_UNIVERSITY_COURSES,
  GET_COURSE_SEMESTER,
  GET_CATEGORIZED_COMPETITIVE_PAPERS
} from '../utils/queries';

import 'react-responsive-carousel/lib/styles/carousel.min.css';

const styles = {
  heading: xw`
    font-bold
    text-xl
    sm:text-2xl
    tracking-wide
    text-center
  `,
  searchContainer: xw`
    w-10/12
    xl:w-7/12
    flex
    flex-col
    justify-center
    items-center
    my-20
  `,
  tabSection: xw`
    w-full
    flex
  `,
  tab: xw`
    py-2
    px-4
    flex
    justify-center
    items-center
    cursor-pointer
    font-bold
    text-sm
    md:text-base
    text-center
    text-gray-700
    border-2 border-gray-100 border-solid
    border-b-0
  `,
  tabActive: xw`
    py-2
    px-4
    flex
    cursor-pointer
    font-bold
    text-sm
    md:text-base
    text-center
    text-white
    justify-center
    items-center
    bg-blue-500
  `,
  filterSection: xw`
    w-full
    flex
    flex-col
    md:flex-row
    justify-center
    items-center
    p-4
    shadow-xl
    border-2 border-solid border-gray-100
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
    border-2 border-solid border-blue-500
  `,
  imgContainer: xw`
    flex
  `,
  carousel: xw`
    w-screen
    overflow-hidden
  `,
  imgBox: xw`
    w-full
    flex
    md:block
  `,
  img: xw`
    max-h-full
    max-w-full
    object-cover
  `,
  banner: xw`
    w-full
    flex
    flex-col
    md:flex-wrap
    md:flex-row
    justify-center
    bg-gray-100
    px-4
    py-16
  `,
  stat: xw`
    flex
    flex-col
    text-center
    mx-16
    my-8
    md:my-0
    text-gray-600
  `,
  statCount: xw`
    text-5xl
    sm:text-6xl
    lg:text-7xl
    font-bold
  `,
  statTitle: xw`
    text-xl
  `,
  contributeBannerContainer: xw`
    w-full
    flex
    flex-col
    justify-center
    items-center
    text-center
  `,
  contactIconsContainer: xw`
    w-full
    flex
    flex-col
    md:flex-row
    justify-center
    items-center
    mt-8
  `,
  aboutSectionContainer: xw`
    w-full
    flex
    flex-col
    md:flex-row
    justify-between
    items-center
  `,
  visuals: xw`
    h-40
    w-40
    md:h-80
    md:w-80
    rounded-full
  `,
  aboutSectionContent: xw`
    w-full
    mt-4
    md:mt-0
    flex
    flex-col
    justify-center
    items-center
    text-center
  `,
  socialIcon: xw`
    w-16
    h-16
    my-2
    md:my-0
    sm:w-24
    sm:h-24
    md:w-28
    md:h-28
    mx-4
    cursor-pointer
  `
};

const tabs = ['University Exams'];

interface StatPropTypes {
  count?: any;
  title?: any;
}

const Stat = ({ count, title }: StatPropTypes) => {
  return (
    <div css={styles.stat}>
      <span css={styles.statCount}>
        {count}
      </span>
      <span css={styles.statTitle}>
        {title}
      </span>
    </div>
  )
}

interface SocialContactPropTypes {
  icon?: any;
}

const SocialContact = ({ icon }: SocialContactPropTypes) => {
  return (
    <img src={icon} css={styles.socialIcon} />
  )
}

interface HomePropTypes {
  allUniversities?: any;
  allCompetitivePapers?: any;
  allPapers?: any;
  allUsers?: any;
}

const Home = ({ allUniversities, allCompetitivePapers, allPapers, allUsers }: HomePropTypes) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [university, setUniversity] = useState({ value: '', label: 'select university' });
  const [course, setCourse] = useState({ value: '', label: 'select course' });
  const [semester, setSemester] = useState({ value: '', label: 'select semester' });
  const [competitivePaper, setCompetitivePaper] = useState({ value: '', label: 'select paper', slug: '' });
  const [year, setYear] = useState({ value: '', label: 'select year' });

  //@ts-ignore
  const CompetitivePapersDropDown = [];
  allCompetitivePapers?.map((compPaper: any) => {
    CompetitivePapersDropDown.push({ label: compPaper.name, value: compPaper.name, slug: compPaper.slug });
  })

  let yearsDropDownOptions = [];
  const { data: compPaperYearsRange } = useQuery(GET_CATEGORIZED_COMPETITIVE_PAPERS, {
    variables: {
      where: {
        slug: {
          equals: competitivePaper.slug
        }
      }
    }
  })
  if (compPaperYearsRange && compPaperYearsRange.competitivePapers.length > 0) {
    let len = compPaperYearsRange.competitivePapers[0].papers?.length;
    let maxYear = parseInt(compPaperYearsRange.competitivePapers[0].papers[0]?.year);
    let minYear = parseInt(compPaperYearsRange.competitivePapers[0].papers[len - 1]?.year);
    for (let i = maxYear; i >= minYear; i--) {
      yearsDropDownOptions.push({ label: i, value: i });
    }
  }

  //@ts-ignore
  const UniversityDropDownOptions = [];
  allUniversities?.map((university: any) => {
    UniversityDropDownOptions.push({ label: university.name, value: university.name });
  })

  //@ts-ignore
  let coursesDropDownOptions = [];
  const { data: universityCourses } = useQuery(GET_UNIVERSITY_COURSES, {
    variables: {
      where: {
        name: { equals: university.value }
      }
    }
  })
  if (universityCourses && universityCourses.universities.length > 0) {
    universityCourses.universities[0].courses.map((course: any) => {
      coursesDropDownOptions.push({ label: course.name, value: course.name });
    })
  }

  let semesterDropDownOptions = [];
  const { data: courseSemester } = useQuery(GET_COURSE_SEMESTER, {
    variables: {
      where: {
        AND: {
          name: { equals: course.value },
          university: { name: { equals: university.value } }
        }
      }
    }
  })
  if (courseSemester && courseSemester.courses.length > 0) {
    let totalSemesters = parseInt(courseSemester.courses[0].semesterSystem) * parseFloat(courseSemester.courses[0].duration);
    for (let i = 1; i <= totalSemesters; i++) semesterDropDownOptions.push({ label: i, value: i });
  }

  const handleSearch = () => {
    if (tabs[activeTab] === 'University Exams') {
      router.push(`/results?type=${tabs[activeTab]}${university.value !== '' ? `&university=${university.value}` : ``}${course.value !== '' ? `&course=${course.value}` : ``}${semester.value !== '' ? `&semester=${semester.value}` : ``}`);
    } else {
      router.push(`/results?type=${tabs[activeTab]}${competitivePaper.value !== '' ? `&slug=${competitivePaper.slug}` : ``}${competitivePaper.value !== '' ? `&competitivePaper=${competitivePaper.value}` : ``}${year.value !== '' ? `&year=${year.value}` : ``}`);
    }
  }

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: -1 }}>
      <div css={styles.imgContainer}>
        <Carousel showThumbs={false} showIndicators width='100%' css={styles.carousel} infiniteLoop>
          <div css={styles.imgBox} style={{ height: '60vh', position: 'relative' }}>
            <Image
              alt=''
              src='https://images.unsplash.com/photo-1580974852861-c381510bc98a?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=976&q=80'
              fill={true}
              css={styles.img}
            />
          </div>
          <div css={styles.imgBox} style={{ height: '60vh', position: 'relative' }}>
            <Image
              alt=''
              src='https://images.unsplash.com/photo-1581120083654-150513117cbf?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1934&q=80'
              fill={true}
              css={styles.img}
            />
          </div>
          <div css={styles.imgBox} style={{ height: '60vh', position: 'relative' }}>
            <Image
              alt=''
              src='https://images.unsplash.com/photo-1497633762265-9d179a990aa6?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80'
              fill={true}
              css={styles.img}
            />
          </div>
          <div css={styles.imgBox} style={{ height: '60vh', position: 'relative' }}>
            <Image
              alt=''
              src='https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1048&q=80'
              fill={true}
              css={styles.img}
            />
          </div>
          <div css={styles.imgBox} style={{ height: '60vh', position: 'relative' }}>
            <Image
              alt=''
              src='https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1050&q=80'
              fill={true}
              css={styles.img}
            />
          </div>
        </Carousel>

      </div>
      <Container>
        <span css={styles.heading}>
          {/* Find previous year question papers of universities and competitive exams. */}
          Find previous year question papers of universities.
        </span>

        <div css={styles.searchContainer}>
          <div css={styles.tabSection}>
            {
              tabs.map((tab, index) => (
                <div css={activeTab === index ? styles.tabActive : styles.tab} key={index} onClick={() => setActiveTab(index)} >
                  <span>{tab}</span>
                </div>
              ))
            }
          </div>
          <div css={styles.filterSection}>
            {
              tabs[activeTab] === 'University Exams' && (
                <>
                  <div style={{ width: '100%', maxWidth: '250px', margin: '0.5rem' }}>
                    <Select
                      value={university}
                      //@ts-ignore
                      options={UniversityDropDownOptions}
                      onChange={(selectedOption: any) => setUniversity(selectedOption)}
                      styles={{
                        input: () => ({
                          height: '40px'
                        })
                      }}
                    />
                  </div>
                  <div style={{ width: '100%', maxWidth: '250px', margin: '0.5rem' }}>
                    <Select
                      value={course}
                      //@ts-ignore
                      options={coursesDropDownOptions}
                      onChange={(selectedOption: any) => {
                        setCourse(selectedOption);
                      }}
                      styles={{
                        input: () => ({
                          height: '40px'
                        })
                      }}
                    />
                  </div>
                  <div style={{ width: '100%', maxWidth: '250px', margin: '0.5rem' }}>
                    <Select
                      value={semester}
                      //@ts-ignore
                      options={semesterDropDownOptions}
                      onChange={(selectedOption: any) => {
                        setSemester(selectedOption);
                      }}
                      styles={{
                        input: () => ({
                          height: '40px'
                        })
                      }}
                    />
                  </div>
                </>
              )
            }
            {
              tabs[activeTab] === 'Competitive Exams' && (
                <>
                  <div style={{ width: '100%', maxWidth: '250px', margin: '0.5rem' }}>
                    <Select
                      value={competitivePaper}
                      //@ts-ignore
                      options={CompetitivePapersDropDown}
                      onChange={(selectedOption: any) => {
                        setCompetitivePaper(selectedOption);
                      }}
                      styles={{
                        input: () => ({
                          height: '40px'
                        })
                      }}
                    />
                  </div>
                  <div style={{ width: '100%', maxWidth: '250px', margin: '0.5rem' }}>
                    <Select
                      value={year}
                      //@ts-ignore
                      options={yearsDropDownOptions}
                      onChange={(selectedOption: any) => {
                        setYear(selectedOption);
                      }}
                      styles={{
                        input: () => ({
                          height: '40px'
                        })
                      }}
                    />
                  </div>
                </>
              )
            }
            {
              (university.value !== '' || competitivePaper.value !== '') ?
                <div css={styles.button} onClick={handleSearch}>
                  Search
                </div> :
                <div css={styles.button} style={{ pointerEvents: 'none', backgroundColor: 'gray', border: '2px solid gray' }} >
                  Search
                </div>
            }
          </div>
        </div>
      </Container>

      {/* Asking to contribute BANNER */}
      <Container customStyles={{ paddingTop: '0px' }}>
        <div css={styles.banner}>
          <div css={styles.contributeBannerContainer}>
            <Heading heading='Are you a student or alumini?' />
            <p>
              Exam Central is a collection of question papers of most Indian universities and competitive exams.
              You can also be a part of it and help to the community.
              <br></br>
              Check out the contribution page to get started.
            </p>
            <Link
              href='/contributions'
            >
              <div css={styles.button} style={{ marginTop: '1rem' }}>
                Contribute Here
              </div>
            </Link>
          </div>
        </div>
      </Container>

      <PaddedContainer>
        <div css={styles.aboutSectionContainer}>
          <img
            src='https://images.unsplash.com/photo-1560785496-3c9d27877182?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=967&q=80'
            css={styles.visuals}
          />
          <div css={styles.aboutSectionContent}>
            <Heading heading='Got exam? Nothing to worry' />
            <p>
              Look into our huge collection of previous year university and competitive exam question papers according to your requirement.
              <br></br>
              Still not able to find question paper? Drop a request.
            </p>
          </div>
        </div>
      </PaddedContainer>

      {/* Stats BANNER */}
      <Container>
        <div css={styles.banner}>
          <Stat count={allPapers?.length || '-'} title='Papers' />
          <Stat count={allUsers?.length || '-'} title='Active Users' />
          <Stat count={null || '-'} title='Daily Views' />
          <Stat count={allUniversities?.length || '-'} title='Universities' />
        </div>
      </Container>

      {/* Connect with us */}
      <PaddedContainer>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
          <Heading heading='Contact us here' />
          <div css={styles.contactIconsContainer}>
            <SocialContact icon='iFacebook.svg' />
            <SocialContact icon='iLinkedin.svg' />
            <SocialContact icon='iTwitter.svg' />
            <SocialContact icon='iInstagram.svg' />
          </div>
        </div>
      </PaddedContainer>

      <Footer universities={allUniversities} />
    </div>
  )
}

export default Home;
