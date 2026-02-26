
import React from 'react';
import { Entry, MaturityLevel } from '../../types';
import { LabNoteCard } from './LabNoteCard';
import { ExperimentCard } from './ExperimentCard';
import { ProjectCard } from './ProjectCard';
import { ProductCard } from './ProductCard';

export const EntryCardSwitcher = ({ entry, onClick }: { entry: Entry; onClick: () => void }) => {
    switch (entry.level) {
        case MaturityLevel.L0: return <LabNoteCard entry={entry} onClick={onClick} />;
        case MaturityLevel.L1: return <ExperimentCard entry={entry} onClick={onClick} />;
        case MaturityLevel.L2: return <ProjectCard entry={entry} onClick={onClick} />;
        case MaturityLevel.L3: return <ProductCard entry={entry} onClick={onClick} />;
        default: return <ProjectCard entry={entry} onClick={onClick} />;
    }
};
