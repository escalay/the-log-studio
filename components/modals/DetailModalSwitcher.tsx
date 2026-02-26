
import React, { useEffect } from 'react';
import { Entry, MaturityLevel } from '../../types';
import { LabNoteDetail } from './LabNoteDetail';
import { ExperimentDetail } from './ExperimentDetail';
import { ProjectDetail } from './ProjectDetail';
import { ProductDetail } from './ProductDetail';

export const DetailModalSwitcher = ({ entry, onClose }: { entry: Entry, onClose: () => void }) => {
    useEffect(() => {
        // Prevent background scrolling when modal is open
        document.body.style.overflow = 'hidden';
        
        // Restore background scrolling when modal closes
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

     switch (entry.level) {
        case MaturityLevel.L0: return <LabNoteDetail entry={entry} onClose={onClose} />;
        case MaturityLevel.L1: return <ExperimentDetail entry={entry} onClose={onClose} />;
        case MaturityLevel.L2: return <ProjectDetail entry={entry} onClose={onClose} />;
        case MaturityLevel.L3: return <ProductDetail entry={entry} onClose={onClose} />;
        default: return <ProjectDetail entry={entry} onClose={onClose} />;
    }
}
