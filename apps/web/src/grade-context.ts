import { createContext, useContext } from 'react';
import type { Grade } from './data';

// The grade picked in the hero, so menu links and subject tiles open the app at that grade.
export const GradeContext = createContext<{ grade: Grade | null; setGrade: (g: Grade) => void }>({ grade: null, setGrade: () => {} });

export const useGrade = () => useContext(GradeContext);

/** A link into the app for the chosen grade, or the app's grade picker when none is chosen. */
export const appLink = (grade: Grade | null, subject: string) => (grade ? `/app/grade/${grade}/${subject}` : '/app/');
