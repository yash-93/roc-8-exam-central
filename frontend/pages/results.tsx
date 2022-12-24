import { ApolloClient, InMemoryCache, useQuery } from '@apollo/client';
import xw from 'xwind';
import { useState, useEffect } from 'react';
//@ts-ignore
import Select from 'react-select';
import ReactPaginate from 'react-paginate';
import { css } from '@emotion/css';
import { useRouter } from 'next/router';
import Head from 'next/head';

import Navbar from '../components/Navbar';
import PaddedContainer from '../components/PaddedContainer';
import CompetitivePaperCard from '../components/CompetitivePaperCard';
import UniversityPaperCard from '../components/UniversityPaperCard';
import parseCookies from '../lib/cookieParser';
import {
  GET_PAPERS_BY_UNIVERSITY_NAME,
  GET_PAPERS_BY_UNIVERSITY_COURSE_NAME,
  GET_PAPERS_BY_UNIVERSITY_COURSE_NAME_SEMESTER,
  GET_UNIVERSITIES,
  GET_UNIVERSITY_COURSES,
  GET_COURSE_SEMESTER,
  GET_COMPETITIVE_PAPERS,
  GET_COMPETITIVE_PAPERS_BY_NAME,
  GET_COMPETITIVE_PAPERS_BY_NAME_YEAR,
  GET_CATEGORIZED_COMPETITIVE_PAPERS
} from '../utils/queries';

const styles = {
  container: xw`
      w-full
      border-1
      border-solid
      border-gray-200
      shadow-xl
      overflow-hidden
    `,
  header: xw`
      w-full
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
      md:flex-row
      justify-center
      items-center
      p-6
      mb-8
      shadow
      border-1 border-solid border-gray-100
    `,
  label: xw`
      font-bold
      text-2xl
    `,
}

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
  papers?: any;
  allUniversities?: any;
  allCompetitivePapers?: any;
}

const Results = ({ papers, allUniversities, allCompetitivePapers }: PropTypes) => {
  const router = useRouter();

  const qUniversity = router.query?.university || '';
  const qCourse = router.query?.course || '';
  const qSemester = router.query?.semester || '';
  const qCompetitivePaper = router.query?.competitivePaper || '';
  const qYear = router.query?.year || '';
  const qSlug = router.query?.slug || '';

  const [filteredPapers, setFilteredPapers] = useState(papers);
  const [currentPagePapers, setCurrentPagePapers] = useState([]);
  const [university, setUniversity] = useState(qUniversity?.length > 0 ? { value: qUniversity, label: qUniversity } : { value: '', label: 'select university' });
  const [course, setCourse] = useState(qCourse?.length > 0 ? { value: qCourse, label: qCourse } : { value: '', label: 'select course' });
  const [semester, setSemester] = useState(qSemester?.length > 0 ? { value: qSemester, label: qSemester } : { value: '', label: 'select semester' });
  const [competitivePaper, setCompetitivePaper] = useState(qCompetitivePaper?.length > 0 ? { value: qCompetitivePaper, label: qCompetitivePaper, slug: qSlug } : { value: '', label: 'select paper', slug: '' });
  const [year, setYear] = useState(qYear?.length > 0 ? { value: qYear, label: qYear } : { value: '', label: 'select year' });

  //@ts-ignore
  const CompetitivePapersDropDownOptions = [];
  allCompetitivePapers?.map((paper: any) => {
    CompetitivePapersDropDownOptions.push({ label: paper.name, value: paper.name, slug: paper.slug });
  })

  let yearsDropDownOptions = [];
  const { data: compPaperYearsRange } = useQuery(GET_CATEGORIZED_COMPETITIVE_PAPERS, {
    variables: {
      where: {
        slug: { equals: qSlug }
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
        name: {
          equals: university.value
        }
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

  const PER_PAGE = 5;

  useEffect(() => {
    setFilteredPapers(papers);
    setUniversity(qUniversity?.length > 0 ? { value: qUniversity, label: qUniversity } : { value: '', label: 'select university' });
    setCourse(qCourse?.length > 0 ? { value: qCourse, label: qCourse } : { value: '', label: 'select course' });
    setSemester(qSemester?.length > 0 ? { value: qSemester, label: qSemester } : { value: '', label: 'select semester' });
    setCompetitivePaper(qCompetitivePaper?.length > 0 ? { value: qCompetitivePaper, label: qCompetitivePaper, slug: qSlug } : { value: '', label: 'select paper', slug: '' });
    setYear(qYear?.length > 0 ? { value: qYear, label: qYear } : { value: '', label: 'select year' });
    let newPapers = papers?.slice(0, 0 + PER_PAGE);
    setCurrentPagePapers(newPapers);
  }, [papers, qUniversity, qCourse, qSemester, qCompetitivePaper, qYear]);

  const handlePaginationClick = ({ selected: selectedPage }: any) => {
    const offset = selectedPage * PER_PAGE;
    let newComments = filteredPapers.slice(offset, offset + PER_PAGE);
    setCurrentPagePapers(newComments);
  }

  const pageCount = Math.ceil(filteredPapers?.length / PER_PAGE);

  const handleUniversityChange = (selectedOption: any) => {
    setUniversity(selectedOption);
    router.push(`/results?type=University Exams${selectedOption.value !== '' ? `&university=${selectedOption.value}` : ``}`);
  }

  const handleCourseChange = (selectedOption: any) => {
    setCourse(selectedOption);
    router.push(`/results?type=University Exams${university.value !== '' ? `&university=${university.value}` : ``}${selectedOption.value !== '' ? `&course=${selectedOption.value}` : ``}`);
  }

  const handleSemesterChange = (selectedOption: any) => {
    setSemester(selectedOption);
    router.push(`/results?type=University Exams${university.value !== '' ? `&university=${university.value}` : ``}${course.value !== '' ? `&course=${course.value}` : ``}${selectedOption.value !== '' ? `&semester=${selectedOption.value}` : ``}`);
  }

  const handleCompetitivePaperChange = (selectedOption: any) => {
    setCompetitivePaper(selectedOption);
    router.push(`/results?type=Competitive Exams${selectedOption.value !== '' ? `&slug=${selectedOption.slug}` : ``}${selectedOption.value !== '' ? `&competitivePaper=${selectedOption.value}` : ``}`);
  }

  const handleYearChange = (selectedOption: any) => {
    setYear(selectedOption);
    router.push(`/results?type=Competitive Exams${competitivePaper.value !== '' ? `&slug=${competitivePaper.slug}` : ``}${competitivePaper.value !== '' ? `&competitivePaper=${competitivePaper.value}` : ``}${selectedOption.value !== '' ? `&year=${selectedOption.value}` : ``}`);
  }

  return (
    <>
      <Head>
        <script>
          (adsbygoogle = window.adsbygoogle || []).push({ });
        </script>
      </Head>
      <Navbar />
      <PaddedContainer>
        <ins className="adsbygoogle"
          style={{
            display: "block"
          }}
          data-ad-client="ca-pub-1214784612359324"
          data-ad-slot="2211959433"
          data-ad-format="auto"
          data-full-width-responsive="true">
        </ins>
        <div style={{ width: '100%' }}>
          <div css={styles.header}>
            Filter
          </div>
          <div css={styles.contentSection}>
            {
              router?.query?.type === 'University Exams' && (
                <>
                  <div style={{ width: '100%', maxWidth: '250px', margin: '0.5rem' }}>
                    <Select
                      value={university}
                      //@ts-ignore
                      options={UniversityDropDownOptions}
                      onChange={handleUniversityChange}
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
                      onChange={handleCourseChange}
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
                      onChange={handleSemesterChange}
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
              router?.query?.type === 'Competitive Exams' && (
                <>
                  <div style={{ width: '100%', maxWidth: '250px', margin: '0.5rem' }}>
                    <Select
                      value={competitivePaper}
                      //@ts-ignore
                      options={CompetitivePapersDropDownOptions}
                      onChange={handleCompetitivePaperChange}
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
                      onChange={handleYearChange}
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
          </div>
        </div>
        <div css={styles.container}>
          {
            currentPagePapers?.map((paper, index) => {
              if (qUniversity)
                //@ts-ignore
                return <UniversityPaperCard key={index} paper={paper} isDraft={paper.status === 'draft' ? true : false} />
              else if (qCompetitivePaper)
                //@ts-ignore
                return <CompetitivePaperCard key={index} paper={paper} isDraft={paper.status === 'draft' ? true : false} />
            })
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
      </PaddedContainer>
    </>
  )
}

export async function getServerSideProps(ctx: any) {
  const university = ctx.query?.university;
  const course = ctx.query?.course;
  const semester = ctx.query?.semester;
  const competitivePaper = ctx.query?.competitivePaper;
  const year = ctx.query?.year;
  const slug = ctx.query?.slug;

  const cookieData = parseCookies(ctx.req);
  const client = new ApolloClient({
    // uri: 'http://localhost:3000/api/graphql',
    uri: `${process.env.GRAPHQL_URL}`,
    cache: new InMemoryCache()
  });

  let allUniversities = null;
  let allCompetitivePapers = null;
  let papers = null;

  if (cookieData['keystonejs-session']) {
    const { data: universitiesData } = await client.query({
      query: GET_UNIVERSITIES,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    });
    allUniversities = universitiesData.universities;

    const { data: competitivePapers } = await client.query({
      query: GET_COMPETITIVE_PAPERS,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    });
    allCompetitivePapers = competitivePapers.competitivePapers;

    if (competitivePaper && year) {
      const { data } = await client.query({
        query: GET_COMPETITIVE_PAPERS_BY_NAME_YEAR,
        variables: {
          where: {
            slug: { equals: slug }
          },
          year: parseInt(year)
        },
        context: {
          headers: {
            Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
          }
        }
      });
      papers = data.competitivePapers[0]?.papers;
    } else if (competitivePaper) {
      const { data } = await client.query({
        query: GET_COMPETITIVE_PAPERS_BY_NAME,
        variables: {
          where: {
            slug: { equals: slug }
          }
        },
        context: {
          headers: {
            Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
          }
        }
      });
      papers = data.competitivePapers[0]?.papers;
    }

    if (university && course && semester) {
      const { data } = await client.query({
        query: GET_PAPERS_BY_UNIVERSITY_COURSE_NAME_SEMESTER,
        variables: {
          where: {
            AND: [
              { university: { name: { equals: university } } },
              { course: { name: { equals: course } } },
              { semester: { equals: parseInt(semester) } }
            ]
          }
        },
        context: {
          headers: {
            Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
          }
        }
      });
      papers = data.papers;
    } else if (university && course) {
      const { data } = await client.query({
        query: GET_PAPERS_BY_UNIVERSITY_COURSE_NAME,
        variables: {
          where: {
            AND: [
              { university: { name: { equals: university } } },
              { course: { name: { equals: course } } }
            ]
          }
        },
        context: {
          headers: {
            Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
          }
        }
      });
      papers = data.papers;
    } else if (university) {
      const { data } = await client.query({
        query: GET_PAPERS_BY_UNIVERSITY_NAME,
        variables: {
          where: {
            university: {
              name: {
                equals: university
              }
            }
          }
        },
        context: {
          headers: {
            Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
          }
        }
      });
      papers = data.papers;
    }
  } else {
    const { data: universitiesData } = await client.query({
      query: GET_UNIVERSITIES
    });
    allUniversities = universitiesData.universities;

    const { data: competitivePapers } = await client.query({
      query: GET_COMPETITIVE_PAPERS,
      context: {
        headers: {
          Cookie: `keystonejs-session=${cookieData['keystonejs-session']}`
        }
      }
    });
    allCompetitivePapers = competitivePapers.competitivePapers;

    if (competitivePaper && year) {
      const { data } = await client.query({
        query: GET_COMPETITIVE_PAPERS_BY_NAME_YEAR,
        variables: {
          where: {
            slug: { equals: slug }
          },
          year: parseInt(year)
        }
      });
      papers = data.competitivePapers[0]?.papers;
    } else if (competitivePaper) {
      const { data } = await client.query({
        query: GET_COMPETITIVE_PAPERS_BY_NAME,
        variables: {
          where: {
            slug: { equals: slug }
          }
        }
      });
      papers = data.competitivePapers[0]?.papers;
    }

    if (university && course && semester) {
      const { data } = await client.query({
        query: GET_PAPERS_BY_UNIVERSITY_COURSE_NAME_SEMESTER,
        variables: {
          where: {
            AND: [
              { university: { name: { equals: university } } },
              { course: { name: { equals: course } } },
              { semester: { equals: parseInt(semester) } }
            ]
          }
        },
      });
      papers = data.papers;
    } else if (university && course) {
      const { data } = await client.query({
        query: GET_PAPERS_BY_UNIVERSITY_COURSE_NAME,
        variables: {
          where: {
            AND: [
              { university: { name: { equals: university } } },
              { course: { name: { equals: course } } }
            ]
          }
        },
      });
      papers = data.papers;
    } else if (university) {
      const { data } = await client.query({
        query: GET_PAPERS_BY_UNIVERSITY_NAME,
        variables: {
          where: {
            university: {
              name: {
                equals: university
              }
            }
          }
        },
      });
      papers = data.papers;
    }
  }

  return {
    props: {
      papers: papers || null,
      allUniversities: allUniversities || null,
      allCompetitivePapers: allCompetitivePapers || null,
    }
  }
}

export default Results;
