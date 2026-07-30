import { redirect } from 'next/navigation'

/** Individual case studies stay offline until approved content arrives. */
export default function CaseStudyPage() {
  redirect('/case-study')
}
