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
    <div className="bg-[#1c1b1b] border border-[rgba(255,183,125,0.15)] rounded-2xl p-6 md:p-8 relative overflow-hidden">
      {/* Background glow decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-mango-text opacity-[0.03] blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <span className="text-2xl drop-shadow-lg">🧠</span>
        <h3 className="font-serif text-2xl text-on-surface m-0 tracking-wide">Test Your Knowledge</h3>
      </div>
      
      <p className="text-on-surface text-[1.1rem] leading-relaxed mb-8 font-medium">
        {quizData.question}
      </p>

      <div className="space-y-3 mb-8 relative z-10">
        {quizData.options.map((option, idx) => {
          let stateClass = 'border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.02)] hover:border-[rgba(255,183,125,0.4)] text-on-surface-var';
          let icon = '';

          if (submitted) {
            if (idx === quizData.answer) {
              stateClass = 'border-green-500 bg-[rgba(34,197,94,0.1)] text-green-300';
              icon = '✅';
            } else if (idx === selected) {
              stateClass = 'border-red-500 bg-[rgba(239,68,68,0.1)] text-red-300';
              icon = '❌';
            } else {
              stateClass = 'border-[rgba(255,255,255,0.05)] bg-transparent opacity-40';
            }
          } else if (selected === idx) {
            stateClass = 'border-mango-text bg-[rgba(255,183,125,0.1)] text-mango-text shadow-[0_0_15px_rgba(255,183,125,0.1)] scale-[1.01]';
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
            className={`w-full py-4 rounded-xl font-bold uppercase tracking-wider transition-all duration-300 ${selected !== null ? 'bg-mango-text text-[#131313] hover:opacity-90 shadow-lg cursor-pointer transform hover:-translate-y-0.5' : 'bg-[rgba(255,255,255,0.05)] text-[rgba(255,255,255,0.2)] cursor-not-allowed'}`}
          >
            Check Answer
          </button>
        ) : (
          <div className={`p-5 rounded-xl text-center border animate-fade-in ${isCorrect ? 'bg-[rgba(34,197,94,0.08)] border-green-500/30 text-green-300' : 'bg-[rgba(239,68,68,0.08)] border-red-500/30 text-red-300'}`}>
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
