import { useEffect, useRef, useCallback } from 'react'
import { MaturityLevel, type Entry } from '@/types'
import { track } from '@/lib/analytics'
import { LabNoteDetail } from './modals/LabNoteDetail'
import { ExperimentDetail } from './modals/ExperimentDetail'
import { ProjectDetail } from './modals/ProjectDetail'
import { ProductDetail } from './modals/ProductDetail'

export const DetailModalSwitcher = ({ entry, onClose }: { entry: Entry; onClose: () => void }) => {
  const openedAt = useRef(Date.now())

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        track('entry_modal_closed', {
          entry_id: entry.id,
          entry_level: entry.level,
          close_method: 'escape',
          time_spent_ms: Date.now() - openedAt.current,
        })
        onClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [entry, onClose])

  const handleClose = useCallback(() => {
    track('entry_modal_closed', {
      entry_id: entry.id,
      entry_level: entry.level,
      close_method: 'click',
      time_spent_ms: Date.now() - openedAt.current,
    })
    onClose()
  }, [entry, onClose])

  switch (entry.level) {
    case MaturityLevel.L0: return <LabNoteDetail entry={entry} onClose={handleClose} />
    case MaturityLevel.L1: return <ExperimentDetail entry={entry} onClose={handleClose} />
    case MaturityLevel.L2: return <ProjectDetail entry={entry} onClose={handleClose} />
    case MaturityLevel.L3: return <ProductDetail entry={entry} onClose={handleClose} />
    default: return <ProjectDetail entry={entry} onClose={handleClose} />
  }
}
