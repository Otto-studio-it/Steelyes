import { redirect } from 'next/navigation'

type CaseStudyPageProps = {
  params: { slug: string }
}

/** Individual case studies stay offline until approved content arrives. */
export default function CaseStudyPage(_props: CaseStudyPageProps) {
  redirect('/case-study')
}
