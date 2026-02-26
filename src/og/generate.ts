import satori from '@cf-wasm/satori/workerd'
import { Resvg } from '@cf-wasm/resvg/workerd'

const LEVEL_COLORS = ['#F3F4F6', '#FEF3C7', '#FFDBC1', '#D1FAE5']
const LEVEL_LABELS = ['L0 · LAB NOTE', 'L1 · EXPERIMENT', 'L2 · PROJECT', 'L3 · PRODUCT']
const ACCENT = '#FF4F00'
const INK = '#111111'
const PAPER = '#FDFCF8'

interface OGOptions {
  title: string
  subtitle?: string
  level?: number
  date?: string
  type?: 'entry' | 'journal' | 'default'
}

const fetchFont = async (family: string, weight: number) => {
  const url = `https://fonts.googleapis.com/css2?family=${family.replace(' ', '+')}:wght@${weight}&display=swap`
  const css = await fetch(url).then((r) => r.text())
  const fontUrl = css.match(/src: url\((.+?)\)/)?.[1]
  if (!fontUrl) throw new Error(`Font not found: ${family}`)
  return fetch(fontUrl).then((r) => r.arrayBuffer())
}

export const generateOGImage = async (options: OGOptions): Promise<ArrayBuffer> => {
  const { title, subtitle, level, date, type = 'default' } = options

  // Load fonts
  const [interBold, interRegular, instrumentSerif] = await Promise.all([
    fetchFont('Inter', 700),
    fetchFont('Inter', 400),
    fetchFont('Instrument Serif', 400),
  ])

  const isJournal = type === 'journal'
  const isEntry = type === 'entry'
  const levelColor = level !== undefined ? LEVEL_COLORS[level] : PAPER
  const levelLabel = level !== undefined ? LEVEL_LABELS[level] : null

  const svg = await satori(
    {
      type: 'div',
      props: {
        style: {
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: PAPER,
          fontFamily: 'Inter',
          position: 'relative',
          overflow: 'hidden',
        },
        children: [
          // Top accent bar
          {
            type: 'div',
            props: {
              style: {
                width: '100%',
                height: '8px',
                backgroundColor: ACCENT,
              },
            },
          },
          // Header row
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '24px 48px',
                borderBottom: `2px solid ${INK}`,
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 18,
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase' as const,
                      color: INK,
                    },
                    children: isJournal ? 'THE REGISTER' : 'ESCALAY',
                  },
                },
                levelLabel
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 14,
                          fontWeight: 700,
                          letterSpacing: '0.2em',
                          padding: '4px 16px',
                          border: `2px solid ${INK}`,
                          backgroundColor: levelColor,
                          color: INK,
                        },
                        children: levelLabel,
                      },
                    }
                  : {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 14,
                          fontWeight: 700,
                          letterSpacing: '0.15em',
                          color: ACCENT,
                        },
                        children: isJournal ? 'DEEP DIVE' : 'THE LOG STUDIO',
                      },
                    },
              ],
            },
          },
          // Main content
          {
            type: 'div',
            props: {
              style: {
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '48px 48px',
                gap: '16px',
              },
              children: [
                date
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 14,
                          fontWeight: 400,
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase' as const,
                          color: '#888',
                        },
                        children: date,
                      },
                    }
                  : null,
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: title.length > 40 ? 48 : 64,
                      fontWeight: 700,
                      fontFamily: 'Instrument Serif',
                      lineHeight: 1.0,
                      color: INK,
                      maxWidth: '900px',
                    },
                    children: title,
                  },
                },
                subtitle
                  ? {
                      type: 'div',
                      props: {
                        style: {
                          fontSize: 22,
                          lineHeight: 1.4,
                          color: '#555',
                          maxWidth: '750px',
                        },
                        children: subtitle,
                      },
                    }
                  : null,
              ].filter(Boolean),
            },
          },
          // Bottom bar
          {
            type: 'div',
            props: {
              style: {
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 48px',
                borderTop: `2px solid ${INK}`,
                backgroundColor: isEntry && level !== undefined ? levelColor : 'transparent',
              },
              children: [
                {
                  type: 'div',
                  props: {
                    style: {
                      fontSize: 13,
                      fontWeight: 400,
                      letterSpacing: '0.1em',
                      color: '#888',
                    },
                    children: 'escalay.space',
                  },
                },
                {
                  type: 'div',
                  props: {
                    style: {
                      width: 40,
                      height: 40,
                      backgroundColor: INK,
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                      fontFamily: 'Instrument Serif',
                    },
                    children: 'E.',
                  },
                },
              ],
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: 'Inter', data: interBold, weight: 700 },
        { name: 'Inter', data: interRegular, weight: 400 },
        { name: 'Instrument Serif', data: instrumentSerif, weight: 400 },
      ],
    },
  )

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
  })

  return resvg.render().asPng().buffer
}
