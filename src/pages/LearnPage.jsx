import React, { useState } from 'react';
import { 
  GitBranch, 
  CalendarDays, 
  FileText, 
  Repeat2, 
  CheckCircle, 
  Infinity, 
  ChevronDown, 
  Volume2, 
  ChevronLeft 
} from 'lucide-react';


import { tensesData } from '../data/tensesData';
// -----------------------------------------------------------

function LearnPage() {
  const [activeTense, setActiveTense] = useState('all-tenses');
  const [showDetails, setShowDetails] = useState(false);
  const [expandedTime, setExpandedTime] = useState(null);
  const [voiceType, setVoiceType] = useState('active');

  const showTenseDetails = (tenseId) => {
    setActiveTense(tenseId);
    setShowDetails(true);
    setVoiceType('active');
  };

  const hideTenseDetails = () => {
    setActiveTense('all-tenses');
    setShowDetails(false);
  };

  const toggleExpandTime = (time) => {
    setExpandedTime(expandedTime === time ? null : time);
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);

      // Get all available voices
      const voices = window.speechSynthesis.getVoices();

      // Pick a female voice (prioritize English)
      const femaleVoice = voices.find(
        (voice) =>
          voice.lang.startsWith('en') && 
          voice.name.toLowerCase().includes('female')
      ) || voices.find((voice) => voice.lang.startsWith('en')); // fallback to any English voice

      if (femaleVoice) {
        utterance.voice = femaleVoice;
      }

      utterance.rate = 1;      // Normal speed
      utterance.pitch = 1.2;   // Slightly higher pitch for clarity

      window.speechSynthesis.speak(utterance);
    }
  };


  const getAspectIcon = (aspect) => {
    switch (aspect) {
      case 'Simple': return FileText;
      case 'Continuous': return Repeat2;
      case 'Perfect': return CheckCircle;
      case 'Perfect Continuous': return Infinity;
      default: return CalendarDays;
    }
  };

  const getTenseTitle = (tenseId) => {
    const data = tensesData[tenseId];
    if (data) return data.title;
    return tenseId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) + ' Tense';
  };

  // --- ENHANCED renderTenseDetails with Card Styling ---
  const renderTenseDetails = (tenseId) => {
    const data = tensesData[tenseId];
    if (!data) {
      return (
        <p className="text-gray-600 dark:text-gray-400 text-lg p-6 text-center">
          The detailed structure, formula, usage rules, and complex examples for this tense will be displayed here.
        </p>
      );
    }

    const currentVoice = data[voiceType];
    const description = voiceType === 'active'
      ? 'Subject performs the action. The sentence structure focuses on the doer.'
      : 'Object receives the action. The structure focuses on the auxiliary verb and the Past Participle (Verb 3).';

    return (
      <div className="space-y-6">
        {/* Voice Description Bar - Added dark-mode aware classes */}
        <div className="p-4 bg-blue-50 dark:bg-blue-900/40 rounded-lg border-l-4 border-blue-600">
          <p className="text-gray-700 dark:text-gray-300 text-lg">
            <strong>Voice Description:</strong> {description}
          </p>
        </div>

        <div className="space-y-4">
          {currentVoice && currentVoice.length > 0 ? currentVoice.map((formItem, index) => (
            <div key={index} className="bg-white dark:bg-gray-700 p-5 rounded-xl shadow-lg border border-gray-200 dark:border-gray-600 hover:shadow-xl transition-shadow">
              <h5 className={`font-extrabold text-xl md:text-2xl mb-3 ${voiceType === 'active' ? 'text-indigo-600 dark:text-indigo-400' : 'text-green-600 dark:text-green-400'}`}>
                {formItem.form}
              </h5>
              
              {/* Structure Section - Added dark-mode aware classes */}
              <div className="mb-2">
                <strong className="text-gray-700 dark:text-gray-300 text-base md:text-lg">Structure: </strong>
                <code className="bg-gray-100 dark:bg-gray-800 p-2 rounded-md font-mono text-base text-red-700 break-words block mt-1">
                  {formItem.structure}
                </code>
              </div>

              {/* Example Section with Speaker - Added dark-mode aware classes */}
              <div className="flex items-start gap-3 mt-4 pt-3 border-t border-gray-100 dark:border-gray-600">
                <strong className="text-gray-700 dark:text-gray-300 text-base md:text-lg shrink-0">Example:</strong>
                <p className="text-gray-800 dark:text-gray-100 text-lg flex-grow">
                  {formItem.example}
                </p>
                <button
                  onClick={() => speak(formItem.example)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 transition p-1 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/50 shrink-0"
                  title="Listen"
                >
                  <Volume2 className="w-6 h-6" />
                </button>
              </div>
            </div>
          )) : (
            <div className="text-center p-6 text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-lg">
               No structure examples found for {getTenseTitle(tenseId)} in **{voiceType} voice**.
            </div>
          )}
        </div>
      </div>
    );
  };
  // --- END ENHANCED renderTenseDetails ---

  return (
    <div className="min-h-screen text-gray-900 dark:text-gray-100 relative ">

      {/* BACK BUTTON - Added dark-mode aware classes */}
      {showDetails && (
        <button
          onClick={hideTenseDetails}
          className="fixed top-4 left-4 z-50 text-blue-600 hover:text-blue-800 transition p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg dark:text-blue-400 dark:hover:text-blue-600"
        >
          <ChevronLeft className="w-8 h-8 stroke-[2]" />
        </button>
      )}

      {/* MAIN CONTENT CONTAINER */}
      <main className="flex flex-col items-center justify-center min-h-screen w-full p-4 md:p-6">
        
        {/* Title for the Tense Tree/List View */}
        {!showDetails && (
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-gray-800 dark:text-gray-200">
            English Tenses Structure
          </h2>
        )}

        <div className="max-w-6xl mx-auto w-full">
          {!showDetails ? (
            <div className="tense-tree-container overflow-x-auto p-5 flex flex-col justify-center">

              {/* Desktop Tree/Diagram View - Added dark-mode aware classes */}
              <div className="hidden lg:flex flex-col items-center">
                <div className="relative pb-10">
                  <button
                    onClick={() => showTenseDetails('all-tenses')}
                    className="flex items-center gap-2 px-8 py-4 bg-indigo-900 text-white font-bold rounded-lg hover:bg-indigo-800 transition-all duration-300 transform hover:scale-105 text-lg shadow-xl"
                  >
                    <GitBranch className="w-6 h-6" /> All Tenses (12)
                  </button>
                  <div className="absolute bottom-0 left-1/2 translate-x-1 w-0.5 h-10 bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Tense Grid for Desktop/Diagram */}
                <ul className="flex flex-wrap justify-center gap-8 md:gap-20 relative pt-10 w-full">
                  <div className="absolute top-0 w-[720px] h-0.5 bg-gray-200 dark:bg-gray-700" style={{ left: '50%', transform: 'translateX(-50%)' }}></div>
                  {['Present', 'Past', 'Future'].map((time, idx) => (
                    <li key={idx} className="flex flex-col items-center gap-4 relative min-w-[200px]">
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 -translate-y-6 w-0.5 h-10 bg-gray-200 dark:bg-gray-700"></div>
                      <button
                        disabled
                        className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 min-w-[160px] transition-all duration-300 transform hover:scale-105 text-lg shadow-md"
                      >
                        <CalendarDays className="inline w-6 h-6 mr-2" /> {time}
                      </button>

                      <ul className="flex flex-col gap-3 pt-8 relative w-full">
                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-10 bg-gray-200 dark:bg-gray-700"></div>
                        {['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'].map((aspect, subIdx) => {
                          const Icon = getAspectIcon(aspect);
                          const tenseId = `${time.toLowerCase()}-${aspect.toLowerCase().replace(' ', '-')}`;
                          return (
                            <li key={subIdx} className="w-full">
                              <button
                                onClick={() => showTenseDetails(tenseId)}
                                className="group flex items-center justify-start gap-3 px-5 py-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-100 rounded-lg hover:bg-blue-600 hover:text-white hover:border-blue-600 transition transform hover:scale-[1.03] w-full text-lg shadow-sm"
                              >
                                <Icon className="w-6 h-6 text-blue-600 group-hover:text-white transition-colors" />
                                <span className="md:text-lg">{time} {aspect}</span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Tablet List (Accordion style) - Added dark-mode aware classes */}
              <div className="mt-10 hidden md:block lg:hidden space-y-6">
                {['Present', 'Past', 'Future'].map((time, idx) => (
                  <div key={idx} className="border-l-4 border-blue-600 pl-4 bg-blue-100/20 dark:bg-blue-900/40 rounded-r-lg p-3 shadow-lg">
                    <h4 className="flex items-center gap-3 py-2 text-xl font-bold w-full text-left">
                      <CalendarDays className="text-blue-600 w-7 h-7" /> {time} Tenses
                    </h4>
                    <div className="space-y-3 mt-3 ml-5">
                      {['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'].map((aspect, subIdx) => {
                        const Icon = getAspectIcon(aspect);
                        const tenseId = `${time.toLowerCase()}-${aspect.toLowerCase().replace(' ', '-')}`;
                        return (
                          <button
                            key={subIdx}
                            onClick={() => showTenseDetails(tenseId)}
                            className="flex items-center gap-3 px-5 py-4 bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-blue-600 hover:text-white hover:translate-x-1 transition-all duration-300 w-full text-left text-lg shadow-md"
                          >
                            <Icon className="text-blue-600 hover:text-white w-6 h-6" />
                            <span>{time} {aspect}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              {/* Mobile Nested Tree (Accordion style) - Added dark-mode aware classes */}
              <div className="mt-10 md:hidden space-y-4">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 space-y-3 shadow-xl">
                  {['Present', 'Past', 'Future'].map((time, idx) => {
                    const isExpanded = expandedTime === time;
                    return (
                      <div key={idx} className="border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                        <button
                          onClick={() => toggleExpandTime(time)}
                          className="flex items-center justify-between w-full py-4 px-4 text-left font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition text-lg rounded-lg"
                        >
                          <span className="flex items-center gap-2">
                            <CalendarDays className="w-6 h-6" />
                            {time} Tenses
                          </span>
                          <ChevronDown className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                        {isExpanded && (
                          <div className="pl-6 space-y-2 pb-3">
                            {['Simple', 'Continuous', 'Perfect', 'Perfect Continuous'].map((aspect, subIdx) => {
                              const Icon = getAspectIcon(aspect);
                              const tenseId = `${time.toLowerCase()}-${aspect.toLowerCase().replace(' ', '-')}`;
                              return (
                                <button
                                  key={subIdx}
                                  onClick={() => showTenseDetails(tenseId)}
                                  className="flex items-center gap-3 px-3 py-3 bg-gray-50 dark:bg-gray-700 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900 hover:text-blue-600 dark:hover:text-blue-400 w-full text-left text-base transition"
                                >
                                  <Icon className="w-5 h-5 text-blue-600" />
                                  <span>{time} {aspect}</span>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* Tense Details View (ShowDetails = true) */
            <div className="relative max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-2xl min-h-[600px] mt-8 md:mt-12 mb-20">
              {activeTense === 'all-tenses' ? (
                <>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 text-indigo-600 dark:text-indigo-400 text-center border-b dark:border-gray-700 pb-2">
                    All 12 English Tenses Overview
                  </h3>
                  <p className="mb-8 text-gray-600 dark:text-gray-400 text-lg text-justify md:px-8">
                    English verbs are structured into 12 tenses that allow speakers to indicate not only the <strong>time</strong> of an action—past, present, or future—but also its <strong>aspect</strong>, which shows whether the action is <strong>simple, ongoing, completed, or continuing over time</strong>.
                  </p>

                  <p className="mb-4 text-gray-600 dark:text-gray-400 text-lg text-align-left md:px-8">
                    These tenses are organized into three main categories:
                  </p>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 text-lg text-align-left mb-8 md:px-16">
                    <li><strong>Present:</strong> Actions happening now, habitual actions, or general truths.</li>
                    <li><strong>Past:</strong> Actions that occurred at a specific time before now.</li>
                    <li><strong>Future:</strong> Actions that will happen after the present moment.</li>
                  </ul>

                  <p className="text-gray-600 dark:text-gray-400 text-lg text-justify md:px-8">
                    Each tense has an <strong>active</strong> form, showing who performs the action, and a <strong>passive</strong> form, highlighting who receives the action. Use the menu above to explore each tense with <strong>formulas, examples, and pronunciations</strong>.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600 dark:text-blue-400 text-center border-b dark:border-gray-700 pb-4">{getTenseTitle(activeTense)}</h3>
                  
                  {/* Voice Selection Tabs (ENHANCED UI) - Added dark-mode aware classes */}
                  <div className="flex justify-center mb-8 bg-gray-100 dark:bg-gray-700 rounded-lg p-1 shadow-inner max-w-sm mx-auto">
                    <button
                      onClick={() => setVoiceType('active')}
                      className={`flex-1 px-4 py-2 text-base md:text-lg font-semibold rounded-lg transition-all duration-200 
                        ${voiceType === 'active' ? 'bg-white dark:bg-gray-900 text-indigo-700 dark:text-indigo-400 shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-indigo-500'}`}
                    >
                      Active Voice
                    </button>
                    <button
                      onClick={() => setVoiceType('passive')}
                      className={`flex-1 px-4 py-2 text-base md:text-lg font-semibold rounded-lg transition-all duration-200 
                        ${voiceType === 'passive' ? 'bg-white dark:bg-gray-900 text-green-700 dark:text-green-400 shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-green-500'}`}
                    >
                      Passive Voice
                    </button>
                  </div>

                  {renderTenseDetails(activeTense)}
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default LearnPage;