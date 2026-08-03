import { PostHog } from 'posthog-node'

let client: PostHog | null = null

function getPostHogServer(): PostHog | null {
  const key = process.env.POSTHOG_API_KEY ?? process.env.NEXT_PUBLIC_POSTHOG_KEY
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://eu.i.posthog.com'

  if (!key) {
    return null
  }

  if (!client) {
    client = new PostHog(key, { host, flushAt: 1, flushInterval: 0 })
  }

  return client
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, string | number | boolean | null>,
): Promise<void> {
  const posthog = getPostHogServer()
  if (!posthog) {
    return
  }

  posthog.capture({
    distinctId,
    event,
    properties: {
      product: 'configurator',
      ...properties,
    },
  })

  await posthog.shutdown()
  client = null
}
