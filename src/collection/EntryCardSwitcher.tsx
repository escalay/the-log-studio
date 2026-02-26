import { MaturityLevel, type Entry } from '@/types'
import { LabNoteCard } from './cards/LabNoteCard'
import { ExperimentCard } from './cards/ExperimentCard'
import { ProjectCard } from './cards/ProjectCard'
import { ProductCard } from './cards/ProductCard'

export const EntryCardSwitcher = ({ entry, onClick }: { entry: Entry; onClick: () => void }) => {
  switch (entry.level) {
    case MaturityLevel.L0: return <LabNoteCard entry={entry} onClick={onClick} />
    case MaturityLevel.L1: return <ExperimentCard entry={entry} onClick={onClick} />
    case MaturityLevel.L2: return <ProjectCard entry={entry} onClick={onClick} />
    case MaturityLevel.L3: return <ProductCard entry={entry} onClick={onClick} />
    default: return <ProjectCard entry={entry} onClick={onClick} />
  }
}
