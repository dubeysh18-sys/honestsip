import { enChapters } from './learnContent_en.jsx';
import { hiChapters } from './learnContent_hi.jsx';
import { mrChapters } from './learnContent_mr.jsx';

export const getLearnChapters = (lang = 'en') => {
  if (lang.startsWith('hi')) return hiChapters;
  if (lang.startsWith('mr')) return mrChapters;
  return enChapters;
};
