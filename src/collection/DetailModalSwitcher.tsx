import { useEffect } from 'react'
import { MaturityLevel, type Entry } from '@/types'
import { LabNoteDetail } from './modals/LabNoteDetail'
import { ExperimentDetail } from './modals/ExperimentDetail'
import { ProjectDetail } from './modals/ProjectDetail'
import { ProductDetail } from './modals/ProductDetail'

export const DetailModalSwitcher = ({ entry, onClose }: { entry: Entry; onClose: () => void }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  switch (entry.level) {
    case MaturityLevel.L0: return <LabNoteDetail entry={entry} onClose={onClose} />
    case MaturityLevel.L1: return <ExperimentDetail entry={entry} onClose={onClose} />
    case MaturityLevel.L2: return <ProjectDetail entry={entry} onClose={onClose} />
    case MaturityLevel.L3: return <ProductDetail entry={entry} onClose={onClose} />
    default: return <ProjectDetail entry={entry} onClose={onClose} />
  }
}
