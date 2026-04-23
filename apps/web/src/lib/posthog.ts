import { PostHog } from 'posthog-node'

let posthogClient: PostHog | undefined

export function getPostHogClient(): PostHog {
  if (!posthogClient) {
    posthogClient = new PostHog(process.env.POSTHOG_API_KEY!, {
      host: process.env.POSTHOG_HOST,
      enableExceptionAutocapture: true,
    })
  }
  return posthogClient
}
