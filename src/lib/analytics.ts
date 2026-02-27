type EventProperties = Record<string, string | number | boolean>

export const track = (event: string, properties?: EventProperties) => {
  if (typeof window !== 'undefined' && window.op?.track) {
    window.op.track(event, properties)
  }
}
