import React, { useState, useEffect, useRef } from 'react';
import { Play, ChevronRight, ChevronLeft, RefreshCw, FileText, ListOrdered, Volume2, Clock, CheckCircle, Zap, XCircle, Send, RotateCcw, LogOut } from 'lucide-react';

// --- TTS Helper Function (Using native browser API for reliability) ---
const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech synthesis not supported in this browser.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Function to find the desired voice (English female)
    const findFemaleVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        // Prioritize a female English voice, or fallback to any English voice
        return voices.find(
            (voice) => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        ) || voices.find((voice) => voice.lang.startsWith('en'));
    };

    const trySpeak = (attempt = 0) => {
        const femaleVoice = findFemaleVoice();

        if (femaleVoice) {
            // Success: Voice found, set it, and speak
            utterance.voice = femaleVoice;
            utterance.rate = 1;      // Normal speed
            utterance.pitch = 1.1;   // Slightly higher pitch for clarity/pleasantness
            window.speechSynthesis.speak(utterance);
        } else if (attempt < 5) {
            // Failure: Voice not found, retry after a short delay
            // This handles the common browser issue where voices load asynchronously.
            console.log(`TTS voices not loaded yet. Retrying in 200ms (Attempt ${attempt + 1}).`);
            setTimeout(() => trySpeak(attempt + 1), 200);
        } else {
            // Fallback if all attempts fail (e.g., no English voices available)
            console.warn("Could not find a suitable English female voice after multiple attempts. Speaking with default voice.");
            window.speechSynthesis.speak(utterance);
        }
    };

    // Initial attempt to speak
    trySpeak();
};

// --- MOCK DATA (For selection options and local fallbacks) ---
const tenseCategories = [
    { id: 'present', name: 'Present' }, { id: 'past', name: 'Past' }, { id: 'future', name: 'Future' },
];
const mockForms = ['Affirmative', 'Negative', 'Question'];
const mockVoices = ['Active', 'Passive'];
const mockCounts = [5, 10, 20, 30];
const mockQuestionTypes = [
    { id: 'conversion', name: 'Conversion', icon: RefreshCw },
    { id: 'fill-in-the-blank', name: 'Fill-in-Blank', icon: FileText },
    { id: 'multiple-choice', name: 'Recognition', icon: ListOrdered },
];
const mockTimers = [
    { id: 'none', name: 'No Timer', value: 'none', icon: null }, { id: '15s', name: '15s', value: 15, icon: Clock },
    { id: '30s', name: '30s', value: 30, icon: Clock }, { id: '60s', name: '60s', value: 60, icon: Clock },
];

const mockQuestionSetFallback = [
    { id: 1, type: 'conversion', sourceSentence: 'She walks the dog every morning.', targetTense: 'Past Continuous', targetVoice: 'Passive', correctAnswer: 'The dog was being walked by her every morning.', explanation: 'The structure must use: Subject + was/were + being + Past Participle (V3).' },
    { id: 2, type: 'fill-in-the-blank', sentenceTemplate: 'They ___ (live) in Paris since 2018, and they love the city.', correctAnswer: 'have been living', explanation: 'The phrase "since 2018" requires the Present Perfect Continuous tense.' },
    { id: 3, type: 'multiple-choice', sentence: 'Had she finished the laundry before the phone rang?', options: ['Past Simple', 'Past Perfect', 'Present Perfect', 'Future Continuous'], correctAnswer: 'Past Perfect', explanation: 'The structure uses "Had + Verb 3," which is the formula for the Past Perfect tense.', },
    { id: 4, type: 'conversion', sourceSentence: 'The teacher will grade the essays.', targetTense: 'Future Simple', targetVoice: 'Passive', correctAnswer: 'The essays will be graded by the teacher.', explanation: 'The structure uses: Object + will be + Past Participle (V3).', },
    { id: 5, type: 'fill-in-the-blank', sentenceTemplate: 'He ___ (drive) a truck for ten years.', correctAnswer: 'has driven', explanation: 'The duration "for ten years" combined with a completed action requires the Present Perfect Simple tense.', },
];

// --- HELPER COMPONENTS (Definitions) ---

// 1. Custom Alert/Confirmation Modal (UPDATED FOR DARK MODE)
const CustomModal = ({ message, onClose, onConfirm, title = "Settings Required", icon = Zap, confirmButtonText = "Confirm", cancelButtonText = "Cancel" }) => {
    const Icon = icon;
    const isConfirmation = !!onConfirm;
    const modalWidthClass = isConfirmation ? 'max-w-sm md:max-w-lg' : 'max-w-sm';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className={`bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl ${modalWidthClass} text-center transform scale-100 transition-all duration-300`}>
                <Icon className={`w-8 h-8 mx-auto mb-4 ${isConfirmation ? 'text-red-600' : 'text-yellow-500'}`} />
                <p className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">{title}</p>
                <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 leading-relaxed">{message}</p>
                
                {isConfirmation ? (
                    <div className="flex justify-between mt-6 space-x-4">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 font-bold rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 transition hover:ring-2 hover:ring-gray-400 text-sm sm:text-base"
                        >
                            {cancelButtonText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 flex items-center justify-center py-3 px-4 bg-red-600 text-white font-bold rounded-full hover:bg-red-700 transition hover:ring-2 hover:ring-red-300 shadow-md text-sm sm:text-base"
                        >
                            {Icon && <LogOut className="w-4 h-4 mr-2" />}
                            {confirmButtonText}
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition hover:ring-2 hover:ring-blue-300"
                    >
                        {cancelButtonText}
                    </button>
                )}
            </div>
        </div>
    );
};

// 2. Feedback Card (UPDATED FOR DARK MODE)
const FeedbackCard = ({ isCorrect, message, correctAnswer }) => (
    <div className={`p-4 rounded-xl transition-all duration-300 shadow-md ${
        isCorrect 
            ? 'bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300' 
            : 'bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300'
    }`}>
        <div className="flex items-start gap-3">
            {isCorrect ? <CheckCircle className="w-6 h-6 shrink-0 mt-1" /> : <XCircle className="w-6 h-6 shrink-0 mt-1" />}
            <div>
                <strong className="block text-lg mb-1">{isCorrect ? 'Correct!' : 'Incorrect.'}</strong>
                <p className="text-sm leading-snug">{message}</p>
                {!isCorrect && <p className="text-sm font-semibold mt-2">Correct Answer: "{correctAnswer}"</p>}
            </div>
        </div>
    </div>
);

// 3. Question Header shared across all UIs (UPDATED FOR DARK MODE)
const QuestionHeader = ({ icon: Icon, title }) => (
    <div className="flex items-center gap-3 text-blue-700 dark:text-blue-400 border-b dark:border-gray-700 pb-3">
        <Icon className="w-7 h-7" />
        <h3 className="text-xl font-bold">{title}</h3>
    </div>
);

// 4. Conversion UI (UPDATED FOR DARK MODE)
const ConversionUI = ({ question, onAnswer, timerValue, isSubmitted }) => {
    // The key={currentQuestion.id} prop on the parent component handles state reset
    const [userAnswer, setUserAnswer] = useState('');
    const showFeedback = isSubmitted || timerValue === 0;

    // Correctness check logic (used for both submission and display)
    const checkCorrectness = (answer) => {
        // Simple check: check if the correct answer string contains the user's answer string (case-insensitive)
        // This is a minimal check for user input flexibility in a conversion scenario.
        return question.correctAnswer.toLowerCase().includes(answer.toLowerCase().trim());
    };

    // Determine the state for display feedback
    const isCorrect = showFeedback && checkCorrectness(userAnswer);

    const handleSubmission = () => {
        if (!showFeedback) {
            // FIX: Calculate and pass the correctness result directly, independent of showFeedback state
            onAnswer(checkCorrectness(userAnswer));
        }
    };
    
    // TTS Handler
    const handleSpeak = () => {
        speakText(question.sourceSentence);
    };


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-5">
            <QuestionHeader icon={RefreshCw} title="Sentence Conversion" />
            
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                Convert this sentence to: 
                <strong className="text-blue-700 dark:text-blue-400 ml-1">
                    {question.targetTense} ({question.targetVoice} Voice)
                </strong>
            </p>
            
            <div className="bg-blue-50 dark:bg-blue-900/40 p-4 rounded-xl font-semibold text-gray-800 dark:text-gray-100 text-lg flex justify-between items-start">
                <span className="pr-4">{question.sourceSentence}</span>
                <button onClick={handleSpeak} className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition p-1 shrink-0" title="Listen">
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>
            
            <textarea
                className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-100 dark:bg-gray-700 text-base resize-none transition-all duration-300"
                rows="3"
                placeholder="Type your converted sentence here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={showFeedback}
            />

            <button 
                onClick={handleSubmission}
                disabled={showFeedback || userAnswer.trim() === ''}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
            >
                <Send className="w-5 h-5" />
                {timerValue === 0 ? 'Time Up!' : 'Submit Answer'}
            </button>
            
            {showFeedback && <FeedbackCard isCorrect={isCorrect} message={question.explanation} correctAnswer={question.correctAnswer} />}
        </div>
    );
};

// 5. Fill-in-the-Blank UI (UPDATED FOR DARK MODE)
const FillInBlankUI = ({ question, onAnswer, timerValue, isSubmitted }) => {
    // The key={currentQuestion.id} prop on the parent component handles state reset
    const [userAnswer, setUserAnswer] = useState('');
    
    const showFeedback = isSubmitted || timerValue === 0;
    const verbMatch = question.sentenceTemplate.match(/\((.*?)\)/);
    const verbToConjugate = verbMatch ? verbMatch[1] : '';
    
    // Correctness check logic (used for both submission and display)
    const checkCorrectness = (answer) => {
        // Exact match required for fill-in-the-blank
        return answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    };

    // Determine the state for display feedback
    const isCorrect = showFeedback && checkCorrectness(userAnswer);

    const handleSubmission = () => {
        if (!showFeedback) {
            // FIX: Calculate and pass the correctness result directly, independent of showFeedback state
            onAnswer(checkCorrectness(userAnswer));
        }
    };

    // TTS Handler - reconstruct the sentence for natural reading
    const handleSpeak = () => {
        const fullSentence = question.sentenceTemplate.replace(
            /\s?\((.*?)\)\s?/, 
            ' blank ' 
        );
        speakText(fullSentence);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-5">
            <QuestionHeader icon={FileText} title="Fill-in-the-Blank" />
            
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                Conjugate the verb <strong className="text-orange-600 dark:text-orange-400 ml-1">({verbToConjugate})</strong> in the correct tense:
            </p>
            
            <div className="bg-orange-50 dark:bg-orange-900/40 p-4 rounded-xl font-medium text-gray-800 dark:text-gray-100 text-lg flex flex-wrap items-center justify-between">
                <div className='flex items-center flex-grow'>
                    <span>{question.sentenceTemplate.split(/\s?\((.*?)\)\s?/)[0]}</span>
                    <input 
                        type="text" 
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        placeholder={verbToConjugate}
                        // Input field dark mode styles
                        className="mx-2 p-1 border-b-2 border-orange-500 dark:border-orange-400 bg-transparent text-center font-bold text-orange-700 dark:text-orange-300 text-lg focus:outline-none w-24 sm:w-36 transition-all"
                        disabled={showFeedback}
                    />
                    <span>{question.sentenceTemplate.split(/\s?\((.*?)\)\s?/)[2]}</span>
                </div>
                
                <button onClick={handleSpeak} className="text-gray-500 dark:text-gray-400 hover:text-orange-500 transition p-1 shrink-0 ml-4" title="Listen">
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>

            <button
                onClick={handleSubmission}
                disabled={showFeedback || userAnswer.trim() === ''}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
            >
                <Send className="w-5 h-5" />
                {timerValue === 0 ? 'Time Up!' : 'Submit Answer'}
            </button>
            
            {showFeedback && <FeedbackCard isCorrect={isCorrect} message={question.explanation} correctAnswer={question.correctAnswer} />}
        </div>
    );
};

// 6. Multiple Choice UI (UPDATED FOR DARK MODE)
const MultipleChoiceUI = ({ question, onAnswer, timerValue, isSubmitted }) => {
    const [selectedOption, setSelectedOption] = useState(null);
    
    const showFeedback = isSubmitted || timerValue === 0;
    
    // Correctness check logic (used for both submission and display)
    const checkCorrectness = (option) => {
        return option === question.correctAnswer;
    };

    // Determine the state for display feedback
    const isCorrect = showFeedback && checkCorrectness(selectedOption);

    const handleSubmission = () => {
        if (!showFeedback) {
            // FIX: Calculate and pass the correctness result directly, independent of showFeedback state
            onAnswer(checkCorrectness(selectedOption));
        }
    };

    // TTS Handler
    const handleSpeak = () => {
        speakText(question.sentence);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl space-y-5">
            <QuestionHeader icon={ListOrdered} title="Tense Recognition" />
            
            <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                Which tense is used in the sentence below?
            </p>
            
            <div className="bg-red-50 dark:bg-red-900/40 p-4 rounded-xl font-semibold text-gray-800 dark:text-gray-100 text-lg italic flex justify-between items-start">
                <span className="pr-4">"{question.sentence}"</span>
                <button onClick={handleSpeak} className="text-gray-500 dark:text-gray-400 hover:text-red-500 transition p-1 shrink-0" title="Listen">
                    <Volume2 className="w-5 h-5" />
                </button>
            </div>
            
            {/* Options List - 2x2 GRID */}
            <div className="grid grid-cols-2 gap-3">
                {question.options.map((option, index) => {
                    const isCorrectOption = option === question.correctAnswer;
                    const isSelected = selectedOption === option;
                    
                    let buttonClasses = 'w-full text-left p-4 rounded-xl border-2 transition-all duration-200 text-base shadow-md';
                    
                    if (showFeedback) {
                        if (isCorrectOption) {
                            buttonClasses += ' bg-green-100 border-green-500 font-bold dark:bg-green-900/40 dark:border-green-600 dark:text-green-300';
                        } else if (isSelected) {
                            buttonClasses += ' bg-red-100 border-red-500 line-through opacity-70 dark:bg-red-900/40 dark:border-red-600 dark:text-red-300';
                        } else {
                            buttonClasses += ' bg-gray-50 border-gray-200 opacity-60 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400';
                        }
                    } else {
                        // Regular state
                        buttonClasses += isSelected 
                            ? ' bg-blue-100 border-blue-500 font-semibold dark:bg-blue-900/40 dark:border-blue-600 dark:text-blue-300' 
                            : ' bg-white hover:bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:hover:bg-gray-600';
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => setSelectedOption(option)}
                            disabled={showFeedback}
                            className={buttonClasses}
                        >
                            {option}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={handleSubmission}
                disabled={showFeedback || selectedOption === null}
                className="w-full flex items-center justify-center gap-2 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-md disabled:bg-gray-400"
            >
                <Send className="w-5 h-5" />
                {timerValue === 0 ? 'Time Up!' : 'Submit Answer'}
            </button>
            
            {showFeedback && <FeedbackCard isCorrect={isCorrect} message={question.explanation} correctAnswer={question.correctAnswer} />}
        </div>
    );
};


// 7. Generic Toggle Group Component (UPDATED FOR DARK MODE)
function ToggleGroup({ title, options, selected, onSelect, multiSelect = true, customColors = 'text-blue-600 border-blue-600 bg-blue-50' }) {
    const handleToggle = (value) => {
        if (multiSelect) {
            const isSelected = selected.includes(value);
            if (isSelected) {
                onSelect(selected.filter(item => item !== value));
            } else {
                onSelect([...selected, value]);
            }
        } else {
            onSelect(value); // Single select
        }
    };

    const isActiveArray = Array.isArray(selected) ? selected : [selected];

    return (
        <div className="flex flex-col space-y-4 lg:space-y-6">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 dark:text-gray-200 text-center">{title}</h3>
            <div className={`grid gap-3 lg:gap-5 ${options.length === 2 ? 'grid-cols-2' : (options.length === 3 ? 'grid-cols-3' : 'grid-cols-4 sm:grid-cols-3 lg:grid-cols-4')}`}>
                {options.map(option => {
                    const value = option.value || option.id || option;
                    const name = option.name || option;
                    const Icon = option.icon;
                    const isActive = multiSelect ? isActiveArray.includes(value) : selected === value;

                    return (
                        <button
                            key={value}
                            onClick={() => handleToggle(value)}
                            className={`
                                flex flex-col items-center justify-center h-24 lg:h-32 p-2 rounded-xl font-semibold text-center text-sm lg:text-lg transition-all duration-200 shadow-md border
                                ${isActive
                                    ? `${customColors} ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900`
                                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400 hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600'
                                }
                                transform hover:scale-[1.03] active:scale-100
                            `}
                        >
                            {Icon && <Icon className="w-5 h-5 lg:w-7 lg:h-7 mb-1" />}
                            {name}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

// Fisher-Yates shuffle implementation (remains the same)
const shuffleArray = (array) => {
    let currentIndex = array.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
};


// 8. Practice Session Manager (API Fetching, Timer, and Sequencing)
function PracticeSession({ settings, onEndSession, confirmEndSession }) {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const totalQuestionsInSession = settings.questionCount;
    
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [isAnswered, setIsAnswered] = useState(false);
    
    const timeLimit = settings.timer === 'none' ? Infinity : settings.timer;
    const [timeLeft, setTimeLeft] = useState(timeLimit === Infinity ? 9999 : timeLimit);
    
    const currentQuestion = questions[currentQIndex];

    // --- API FETCHING LOGIC (Frontend Client) ---
    const fetchQuestions = async (settings) => {
        setLoading(true);
        setError(null);
        try {
            // Note: The /api/generate endpoint is assumed to be defined by the user in generate.js
            const response = await fetch('/api/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || errorData.error || `HTTP error! Status: ${response.status}`);
            }

            let data = await response.json();
            
            if (!Array.isArray(data) || data.length === 0) {
                data = mockQuestionSetFallback.slice(0, settings.questionCount);
                console.warn("API returned empty array. Using mock questions.");
            } else {
                data = data.slice(0, settings.questionCount);
            }
            
            // FIX: Shuffle the received questions to ensure random type order
            const shuffledQuestions = shuffleArray(data);
            setQuestions(shuffledQuestions);

        } catch (err) {
            console.error("Fetch Error:", err);
            setError(err.message);
            // Fallback to shuffled mock data if fetch fails
            const fallback = mockQuestionSetFallback.slice(0, settings.questionCount);
            setQuestions(shuffleArray(fallback));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions(settings);
    }, [settings]);


    // --- TIMER LOGIC ---
    useEffect(() => {
        if (!loading && questions.length > 0) {
            if (timeLimit !== Infinity && !isAnswered) {
                const timer = setInterval(() => {
                    setTimeLeft(prev => {
                        if (prev > 0) {
                            return prev - 1;
                        } else {
                            clearInterval(timer);
                            if (!isAnswered) {
                                setIsAnswered(true); 
                                // Automatically advance to the next question after feedback period if timer runs out
                                setTimeout(handleNextQuestion, 1500); 
                            }
                            return 0;
                        }
                    });
                }, 1000);
                return () => clearInterval(timer);
            }
        }
    }, [currentQIndex, isAnswered, timeLimit, loading, questions.length]);


    // --- SCORING & NAVIGATION ---
    const handleAnswer = (isCorrect) => {
        if (!isAnswered) {
            setIsAnswered(true);
            if (isCorrect) {
                setScore(s => s + 1);
            }
        }
    };

    const handleFinish = () => {
        // Total questions attempted is the actual length of the session/questions array
        onEndSession(score, questions.length); 
    };

    const handleNextQuestion = () => {
        if (isAnswered || timeLeft === 0) { 
            if (currentQIndex < questions.length - 1) {
                setCurrentQIndex(currentQIndex + 1);
                setIsAnswered(false);
                setTimeLeft(timeLimit === Infinity ? 9999 : timeLimit);
            } else {
                handleFinish();
            }
        }
    };

    const handleQuitClick = () => {
        // Calculate attempted questions for the quit confirmation modal
        const attemptedQuestions = currentQIndex + (isAnswered ? 1 : 0);
        confirmEndSession(score, attemptedQuestions, totalQuestionsInSession);
    };

    const renderCurrentQuestionUI = () => {
        if (!currentQuestion) return null;
        
        const commonProps = {
            // FIX: Add key to force component remount and state reset for new question
            key: currentQuestion.id, 
            question: currentQuestion,
            onAnswer: handleAnswer,
            timerValue: timeLeft,
            isSubmitted: isAnswered, 
        };

        switch (currentQuestion.type) {
            case 'conversion':
                return <ConversionUI {...commonProps} />;
            case 'fill-in-the-blank':
                return <FillInBlankUI {...commonProps} />;
            case 'multiple-choice':
                return <MultipleChoiceUI {...commonProps} />;
            default:
                return <div className="text-center p-6 text-gray-700 dark:text-gray-300">Error: Unknown question type {currentQuestion.type}.</div>;
        }
    };

    if (loading) {
        return (
            <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Generating {totalQuestionsInSession} custom questions...</p>
                {error && <p className="text-sm text-red-500 mt-4">Error: {error}. Using fallback questions.</p>}
            </div>
        );
    }
    
    // --- Main Session Render ---
    const questionsAttempted = currentQIndex + (isAnswered ? 1 : 0);
    
    return (
        <div className="space-y-6">
            {/* Header: Score, Timer, & End Button (UPDATED FOR DARK MODE) */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-lg flex justify-between items-center font-bold text-gray-700 dark:text-gray-200">
                
                {/* 1. Left: Score & Total Questions */}
                <div className="flex items-center gap-2 w-1/3">
                    <Zap className="w-5 h-5 text-indigo-500 shrink-0" />
                    <span className="text-base sm:text-lg whitespace-nowrap">
                        <span className="hidden sm:inline">Score: </span>
                        {/* Corrected: Show score / questions attempted so far */}
                        {score} / {questionsAttempted}
                    </span>
                </div>
                
                {/* 2. Center: Timer (Prominent) */}
                <div className="flex justify-center w-1/3">
                    {timeLimit !== Infinity && (
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-lg font-mono shadow-inner border transition-all duration-300
                            ${timeLeft <= 5 && timeLeft > 0 
                                ? 'bg-red-200 text-red-700 border-red-500 ring-2 ring-red-300 dark:bg-red-900/40 dark:text-red-300 dark:border-red-600 dark:ring-red-700' 
                                : (timeLeft === 0 
                                    ? 'bg-red-600 text-white' 
                                    : 'bg-gray-100 text-gray-700 border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600')
                            }`}>
                            <Clock className="w-5 h-5 shrink-0" />
                            <span>{timeLeft === 0 ? '0s' : `${timeLeft}s`}</span>
                        </div>
                    )}
                </div>
                
                {/* 3. Right: Quit Button */}
                <div className="flex items-center justify-end w-1/3 space-x-3">
                    <button
                        onClick={handleQuitClick}
                        className="flex items-center gap-1 py-2 px-3 bg-red-100 dark:bg-red-900/40 text-red-600 dark:text-red-300 font-semibold rounded-full hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors shadow-sm text-sm border border-red-300 dark:border-red-600"
                    >
                        <LogOut className="w-4 h-4" /> Quit
                    </button>
                </div>
            </div>
            
            {/* Question UI */}
            {renderCurrentQuestionUI()}
            
            {/* Navigation */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleNextQuestion}
                    disabled={!isAnswered && timeLeft > 0}
                    className={`flex items-center gap-1 py-3 px-6 rounded-full font-bold text-white transition-all duration-300 shadow-md
                        ${isAnswered || timeLeft === 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'}`}
                >
                    {currentQIndex === questions.length - 1 ? (
                        <>Finish <CheckCircle className="w-5 h-5" /></>
                    ) : (
                        <>Next Question <ChevronRight className="w-5 h-5" /></>
                    )}
                </button>
            </div>
        </div>
    );
}


// 9. Result Screen Component (UPDATED FOR DARK MODE)
const ResultScreen = ({ settings, finalScore, totalQuestions, handleRestartSession }) => {
    const questionsTotalInSession = settings.questionCount;
    const percentage = totalQuestions > 0 ? Math.round((finalScore / totalQuestions) * 100) : 0;
    const passed = percentage >= 70; // Mock pass threshold
    const isFullSession = totalQuestions === questionsTotalInSession;

    return (
        <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl shadow-xl min-h-[400px] flex flex-col justify-center items-center space-y-6">
            <div className={`p-5 rounded-full ${passed ? 'bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-300' : 'bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300'}`}>
                {passed ? <CheckCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
            </div>
            <h2 className={`text-4xl font-extrabold ${passed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {isFullSession ? 'Practice Completed!' : 'Session Ended Early'}
            </h2 >
            <p className="text-2xl font-mono text-gray-800 dark:text-gray-100 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {finalScore} / {totalQuestions} Correct ({percentage}%)
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300">
                {isFullSession ? (
                    passed ? 'Excellent work! You demonstrated mastery of the selected tenses.' : 'Keep practicing to solidify your knowledge in the areas you missed.'
                ) : (
                    `You answered ${totalQuestions} questions out of ${questionsTotalInSession} planned. Review your progress before starting a new session.`
                )}
            </p>
            <button
                onClick={handleRestartSession}
                className="flex items-center gap-2 py-3 px-6 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors shadow-md"
            >
                <RotateCcw className="w-5 h-5" /> Start New Session
            </button>
        </div>
    );
};


// 10. Main Practice Page Component (Wizard Logic)
function PracticePage() {
    const totalSteps = 4;
    
    const [step, setStep] = useState(1);
    const [practicePhase, setPracticePhase] = useState('settings'); // 'settings', 'inProgress', 'results'
    const [settings, setSettings] = useState({
        tenseCategories: ['present'],
        forms: ['Affirmative'],
        voices: ['Active'],
        questionTypes: ['conversion'],
        questionCount: 10,
        timer: 'none',
    });
    
    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [showEndConfirm, setShowEndConfirm] = useState(false);
    const [quitInfo, setQuitInfo] = useState({ score: 0, attempted: 0, total: 0 });
    
    // Result states
    const [finalScore, setFinalScore] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(0);

    const renderContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <div className="">
                            <p className="text-gray-700 dark:text-gray-300 text-lg lg:text-xl text-justify leading-relaxed">
                                Welcome to the Alphabetz Practice Zone! This structured section is designed to help you master English tenses through focused, randomized drills. 
                                You can fully customize your session in the upcoming steps to target specific grammatical areas. 
                                The practice features three types of questions: Sentence Conversion, Fill-in-the-Blank, and Tense Recognition. 
                                Click Next to begin selecting your focus areas.
                            </p>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8 lg:space-y-12">
                        <ToggleGroup
                            title="Tense Categories"
                            options={tenseCategories}
                            selected={settings.tenseCategories}
                            onSelect={(t) => setSettings({ ...settings, tenseCategories: t })}
                            customColors="text-blue-600 border-blue-600 bg-blue-100/70 dark:bg-blue-900/40"
                            multiSelect={true}
                        />
                        <ToggleGroup
                            title="Sentence Forms"
                            options={mockForms}
                            selected={settings.forms}
                            onSelect={(f) => setSettings({ ...settings, forms: f })}
                            customColors="text-indigo-600 border-indigo-600 bg-indigo-100/70 dark:bg-indigo-900/40"
                            multiSelect={true}
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-8 lg:space-y-12">
                        <ToggleGroup
                            title="Voice Selection"
                            options={mockVoices}
                            selected={settings.voices}
                            onSelect={(v) => setSettings({ ...settings, voices: v })}
                            customColors="text-green-600 border-green-600 bg-green-100/70 dark:bg-green-900/40"
                            multiSelect={true}
                        />
                        <ToggleGroup
                            title="Question Types"
                            options={mockQuestionTypes}
                            selected={settings.questionTypes}
                            onSelect={(qt) => setSettings({ ...settings, questionTypes: qt })}
                            customColors="text-red-600 border-red-600 bg-red-100/70 dark:bg-red-900/40"
                            multiSelect={true}
                        />
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-8 lg:space-y-12">
                        <ToggleGroup
                            title="Number of Questions"
                            options={mockCounts}
                            selected={settings.questionCount}
                            onSelect={(q) => setSettings({ ...settings, questionCount: q })}
                            multiSelect={false}
                            customColors="text-orange-600 border-orange-600 bg-orange-100/70 dark:bg-orange-900/40"
                        />
                        <ToggleGroup
                            title="Time Limit Per Question"
                            options={mockTimers}
                            selected={settings.timer}
                            onSelect={(t) => setSettings({ ...settings, timer: t })}
                            multiSelect={false}
                            customColors="text-purple-600 border-purple-600 bg-purple-100/70 dark:bg-purple-900/40"
                        />
                    </div>
                );
            default:
                return null;
        }
    };

    const handleStartPractice = () => {
        const isReady = settings.tenseCategories.length > 0 &&
                        settings.forms.length > 0 &&
                        settings.voices.length > 0 &&
                        settings.questionTypes.length > 0;
        
        if (!isReady) {
            setModalMessage("To start practicing, please make at least one selection in each major category: Tense, Form, Voice, and Question Type.");
            setShowModal(true);
            return;
        }
        
        setPracticePhase('inProgress');
        setStep(0); // Hide the wizard steps
    };

    const confirmEndSession = (score, attempted, total) => {
        setQuitInfo({ score, attempted, total });
        setShowEndConfirm(true);
    };

    const handleEndSession = (score, total) => {
        setFinalScore(score);
        setTotalQuestions(total);
        setPracticePhase('results');
        setShowEndConfirm(false); 
    };

    const handleQuitConfirm = () => {
        handleEndSession(quitInfo.score, quitInfo.attempted);
    }

    const handleRestartSession = () => {
        setPracticePhase('settings');
        setStep(1);
        setFinalScore(0);
        setTotalQuestions(0);
        setQuitInfo({ score: 0, attempted: 0, total: 0 });
        setSettings({
            tenseCategories: ['present'],
            forms: ['Affirmative'],
            voices: ['Active'],
            questionTypes: ['conversion'],
            questionCount: 10,
            timer: 'none',
        });
    };

    const isNextDisabled =
        (step === 2 && (settings.tenseCategories.length === 0 || settings.forms.length === 0)) ||
        (step === 3 && (settings.voices.length === 0 || settings.questionTypes.length === 0));

    return (
        // Removed bg-gray-50 and text-gray-900 (handled by index.css body styles)
        <div className="min-h-screen flex flex-col items-center">
            
            {/* 1. GENERAL ALERT MODAL (Validation errors) */}
            {showModal && <CustomModal message={modalMessage} onClose={() => setShowModal(false)} cancelButtonText="Got It" />}
            
            {/* 2. QUIT CONFIRMATION MODAL */}
            {practicePhase === 'inProgress' && showEndConfirm && (
                <CustomModal
                    title="Confirm End Session"
                    message={`Are you sure you want to end your session early? Your current score is ${quitInfo.score} out of ${quitInfo.attempted} questions attempted.`}
                    icon={LogOut}
                    onClose={() => setShowEndConfirm(false)}
                    onConfirm={handleQuitConfirm} 
                    cancelButtonText="Continue Practicing"
                    confirmButtonText="End Session Now"
                />
            )}
            
            {/* 3. MAIN CONTENT AREA - Vertical centering is handled by outer flex container */}
            <main className={`flex flex-col items-center w-full p-4 md:p-6 flex-grow justify-center pb-24`}>
                
                {/* Main Title / Phase Indicator (UPDATED FOR DARK MODE) */}
                {(practicePhase === 'settings' && step === 1) ? (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-gray-800 dark:text-gray-200 mb-8 md:mb-12 lg:mb-16">
                        Practice    
                    </h1>
                ) : (
                    // Placeholder height for alignment consistency when title is hidden
                    <div className="h-4 md:h-8"></div>
                )}
                
                {/* Content Wrapper (max-w control and upward visual shift) */}
                <div className="max-w-xl lg:max-w-3xl mx-auto w-full transform -translate-y-4 md:-translate-y-8">
                    
                    {/* 1. Settings Phase */}
                    {practicePhase === 'settings' && (
                        <div className="space-y-6 lg:space-y-8">
                            
                            {renderContent()}
                            
                            {/* --- Navigation Bar (UPDATED FOR DARK MODE) --- */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 lg:pt-6">
                                
                                {/* Back Button (Disabled on Step 1) */}
                                <button
                                    onClick={() => setStep(step - 1)}
                                    disabled={step === 1}
                                    className={`flex items-center gap-1 py-3 px-4 lg:py-4 lg:px-6 rounded-full font-semibold lg:text-lg transition-all duration-300
                                        ${step === 1 
                                            ? 'text-gray-400 cursor-not-allowed' 
                                            : 'text-blue-600 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-gray-700'}`}
                                >
                                    <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                                    Back
                                </button>

                                {/* Step Indicator */}
                                <span className="text-sm lg:text-base font-medium text-gray-500 dark:text-gray-400">
                                    Step {step} of {totalSteps}
                                </span>

                                {/* Next / Start Button */}
                                {step < totalSteps ? (
                                    <button
                                        onClick={() => setStep(step + 1)}
                                        disabled={isNextDisabled}
                                        className={`flex items-center gap-1 py-3 px-4 lg:py-4 lg:px-6 rounded-full font-bold text-white lg:text-lg transition-all duration-300 shadow-md
                                            ${isNextDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
                                    >
                                        Next
                                        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleStartPractice}
                                        disabled={isNextDisabled}
                                        className={`flex items-center gap-1 py-3 px-6 lg:py-4 lg:px-8 rounded-full font-bold text-white lg:text-xl transition-all duration-300 shadow-xl
                                            ${isNextDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        <Play className="w-5 h-5 lg:w-6 lg:h-6" />
                                        Start Practice
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                    
                    {/* 2. In Progress Phase */}
                    {practicePhase === 'inProgress' && (
                        <PracticeSession
                            settings={settings}
                            onEndSession={handleEndSession}
                            confirmEndSession={confirmEndSession}
                        />
                    )}
                    
                    {/* 3. Results Phase */}
                    {practicePhase === 'results' && (
                        <ResultScreen settings={settings} finalScore={finalScore} totalQuestions={totalQuestions} handleRestartSession={handleRestartSession} />
                    )}
                </div>
            </main>
        </div>
    );
}

export default PracticePage;