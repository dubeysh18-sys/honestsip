import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getLearnChapters } from '../data/learnContent';
import QuizBlock from '../components/QuizBlock';

export default function LearnChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const LEARN_CHAPTERS = getLearnChapters(i18n.language);

  const chapterIndex = LEARN_CHAPTERS.findIndex(c => c.id === id);
  const chapter = chapterIndex >= 0 ? LEARN_CHAPTERS[chapterIndex] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }, [id]);

  if (!chapter) {
    return (
      <div className="page-section text-center py-20">
        <h2 className="text-2xl font-serif text-on-surface mb-4">Chapter Not Found</h2>
        <button onClick={() => navigate('/learn')} className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg hover:opacity-90 transition-opacity">Return to Masterclass</button>
      </div>
    );
  }

  const nextChapter = chapterIndex < LEARN_CHAPTERS.length - 1 ? LEARN_CHAPTERS[chapterIndex + 1] : null;
  const prevChapter = chapterIndex > 0 ? LEARN_CHAPTERS[chapterIndex - 1] : null;

  return (
    <div className="page-section pb-28 md:pb-12 max-w-7xl mx-auto flex flex-col md:flex-row gap-8 relative">
      
      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden flex items-center justify-between bg-surface-low p-4 rounded-xl border border-outline-var/10 sticky top-20 z-20 shadow-md">
        <span className="font-serif text-primary font-medium">Chapter {chapterIndex + 1} of {LEARN_CHAPTERS.length}</span>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-on-surface text-sm border border-outline-var/20 px-3 py-1.5 rounded bg-surface-highest/20"
        >
          {sidebarOpen ? 'Close Menu' : 'Course Menu ▾'}
        </button>
      </div>

      {/* Sidebar (Left list) */}
      <aside className={`w-full md:w-80 flex-shrink-0 ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <div className="sticky top-28">
          <h2 className="font-serif text-[1.4rem] text-on-surface mb-6 hidden md:block">Masterclass Syllabus</h2>
          <div className="flex flex-col gap-2 relative">
            {/* Connecting visual line for desktop */}
            <div className="absolute left-[1.15rem] top-6 bottom-6 w-[2px] bg-outline-var/10 z-0 hidden md:block" />
            
            {LEARN_CHAPTERS.map((c, idx) => {
              const isActive = c.id === chapter.id;
              return (
                <Link 
                  key={c.id} 
                  to={`/learn/${c.id}`}
                  className={`relative z-10 px-4 py-3 rounded-xl transition-all duration-200 border flex items-center gap-3 ${
                    isActive 
                      ? 'bg-surface-low border-primary/20 shadow-sm' 
                      : 'border-transparent hover:bg-surface-highest/30 opacity-70 hover:opacity-100'
                  }`}
                >
                  <div className={`w-9 h-9 flex-shrink-0 rounded-full flex items-center justify-center text-[0.85rem] font-bold font-serif shadow-sm transition-colors ${
                    isActive ? 'bg-primary text-on-primary' : 'bg-surface-high text-on-surface-var border border-outline-var/10'
                  }`}>
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`block font-serif text-[1.05rem] ${isActive ? 'text-primary' : 'text-on-surface'}`} style={{ lineHeight: 1.3 }}>
                      {c.title}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Main Content (Right side) */}
      <main className={`flex-1 min-w-0 transition-opacity duration-300 ${sidebarOpen ? 'opacity-30 md:opacity-100 pointer-events-none md:pointer-events-auto' : 'opacity-100'}`}>
        <div className="bg-surface sm:bg-transparent sm:border-none border border-outline-var/5 sm:p-0 p-6 rounded-2xl shadow-xl sm:shadow-none">
          <header className="mb-10">
            <p className="label-overline text-primary mb-3 tracking-widest">CHAPTER {chapterIndex + 1}</p>
            <h1 className="font-serif text-4xl md:text-[3.25rem] text-on-surface mb-6 leading-[1.1]">
              {chapter.title}
            </h1>
            <p className="text-[1.15rem] leading-[1.6] text-on-surface-var italic border-l-[3px] border-primary pl-5 py-1 bg-surface-highest/10 rounded-r-lg">
              {chapter.byline}
            </p>
          </header>

          <div className="text-on-surface-var leading-[1.8] text-[1.1rem]">
            {chapter.content}
          </div>

          <div className="my-14 border-t border-outline-var/10"></div>

          <section>
            <QuizBlock quizData={chapter.quiz} />
          </section>

          <div className="flex justify-between items-center mt-10 bg-surface-low p-5 rounded-xl border border-outline-var/10">
            {prevChapter ? (
              <Link to={`/learn/${prevChapter.id}`} className="text-on-surface-var hover:text-on-surface transition-colors text-sm flex items-center gap-2">
                <span>←</span> <span className="hidden sm:inline">{prevChapter.title}</span><span className="sm:hidden">Prev</span>
              </Link>
            ) : <div />}
            
            {nextChapter ? (
              <Link to={`/learn/${nextChapter.id}`} className="text-primary font-bold text-[0.95rem] text-right flex items-center gap-2 hover:opacity-80 transition-opacity">
                <span>Next <span className="hidden sm:inline">Chapter</span></span> <span>→</span>
              </Link>
            ) : (
              <span className="text-primary font-bold text-sm text-right flex items-center gap-2 opacity-50 cursor-default">
                End of Masterclass 🏆
              </span>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
