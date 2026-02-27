type EventProperties = Record<string, string | number | boolean>

export const track = (event: string, properties?: EventProperties) => {
  if (typeof window !== 'undefined' && window.posthog?.capture) {
    window.posthog.capture(event, properties)
  }
}
