import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLearnChapters } from '../data/learnContent';

export default function LearnIndex() {
  const { t, i18n } = useTranslation();
  const LEARN_CHAPTERS = getLearnChapters(i18n.language);

  return (
    <div className="page-section pb-28 md:pb-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <p className="label-overline text-primary mb-3">HonestSIP Masterclass</p>
          <h1 className="font-serif text-4xl md:text-5xl text-on-surface mb-4 leading-tight">
            The Rules of the Game
          </h1>
          <p className="text-on-surface-var max-w-2xl mx-auto leading-relaxed">
            Welcome to the HonestSIP Masterclass. We have stripped away the clichés, doubled the depth, and injected a modern, street-smart pulse. Read through these chapters to build a solid foundation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {LEARN_CHAPTERS.map((chapter, idx) => (
            <Link 
              key={chapter.id} 
              to={`/learn/${chapter.id}`}
              className="group section-card hover:border-primary/40 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
              style={{ minHeight: '180px' }}
            >
              <div className="absolute top-[-20%] right-[-5%] p-4 opacity-[0.03] font-serif text-[12rem] italic leading-none pointer-events-none group-hover:opacity-10 transition-opacity text-primary">
                {idx + 1}
              </div>
              <div>
                <p className="label-overline text-primary mb-3">Chapter {idx + 1}</p>
                <h2 className="font-serif text-2xl text-on-surface mb-2 relative z-10">{chapter.title}</h2>
                <p className="text-sm text-on-surface-var leading-relaxed mb-6 relative z-10">{chapter.byline}</p>
              </div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary/70 group-hover:text-primary transition-colors mt-auto relative z-10">
                Start Chapter →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
