import React, { useState, useEffect } from 'react';

export default function QuizBlock({ quizData }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  // Reset state when quizData changes (user navigates to next chapter)
  useEffect(() => {
    setSelected(null);
    setSubmitted(false);
  }, [quizData]);

  if (!quizData) return null;

  const handleSelect = (idx) => {
    if (submitted) return;
    setSelected(idx);
  };

  const handleSubmit = () => {
    if (selected === null) return;
    setSubmitted(true);
  };

  const isCorrect = selected === quizData.answer;

  return (
    <div className="bg-surface-low border border-primary/20 rounded-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-[0.03] blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <span className="text-2xl drop-shadow-lg">🧠</span>
        <h3 className="font-serif text-2xl text-on-surface m-0 tracking-wide">Test Your Knowledge</h3>
      </div>
      
      <p className="text-on-surface text-[1.1rem] leading-relaxed mb-8 font-medium">
        {quizData.question}
      </p>

      <div className="space-y-3 mb-8 relative z-10">
        {quizData.options.map((option, idx) => {
          let stateClass = 'border-outline-var/20 bg-surface hover:border-primary/40 text-on-surface-var';
          let icon = '';

          if (submitted) {
            if (idx === quizData.answer) {
              stateClass = 'border-success bg-success/10 text-success';
              icon = '✅';
            } else if (idx === selected) {
              stateClass = 'border-danger bg-danger/10 text-danger';
              icon = '❌';
            } else {
              stateClass = 'border-outline-var/10 bg-transparent opacity-40';
            }
          } else if (selected === idx) {
            stateClass = 'border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(255,140,0,0.1)] scale-[1.01]';
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 flex items-center justify-between ${stateClass} ${!submitted ? 'cursor-pointer active:scale-[0.99]' : 'cursor-default'}`}
            >
              <span className="text-[1.05rem] font-medium leading-relaxed">{option}</span>
              {icon && <span className="text-xl ml-3 animate-fade-in">{icon}</span>}
            </button>
          );
        })}
      </div>

      <div className="relative z-10">
        {!submitted ? (
          <button 
            onClick={handleSubmit} 
            disabled={selected === null}
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 ${selected !== null ? 'bg-primary text-on-primary hover:opacity-90 shadow-lg cursor-pointer transform hover:-translate-y-0.5' : 'bg-surface-highest/20 text-on-surface-var opacity-50 cursor-not-allowed'}`}
          >
            Check Answer
          </button>
        ) : (
          <div className={`p-5 rounded-xl text-center border animate-fade-in ${isCorrect ? 'bg-success/10 border-success/30 text-success' : 'bg-danger/10 border-danger/30 text-danger'}`}>
            <p className="font-bold text-xl mb-1.5">{isCorrect ? 'Spot On! 🎯' : 'Not Quite! 🔄'}</p>
            <p className="text-[1.05rem] opacity-90 leading-relaxed font-medium">
              {isCorrect 
                ? "You've fully grasped this concept. The foundation is set—ready for the next chapter?" 
                : "Review the section above to reinforce this concept. Financial literacy takes time—nobody learns everything on day one."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
