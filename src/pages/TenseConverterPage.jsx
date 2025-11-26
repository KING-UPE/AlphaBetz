import React, { useState, useCallback } from 'react';
import { 
    RefreshCw, 
    Volume2, 
    Send, 
    ChevronRight, 
    ChevronLeft,
    CheckCircle,
    RotateCcw
} from 'lucide-react';
import { tensesData } from '../data/tensesData.js'; 

// --- Configuration Data ---
const timeOptions = [
    { id: 'present', name: 'Present' }, 
    { id: 'past', name: 'Past' }, 
    { id: 'future', name: 'Future' }
];

const aspectOptions = [
    { id: 'simple', name: 'Simple' },
    { id: 'continuous', name: 'Continuous' },
    { id: 'perfect', name: 'Perfect' },
    { id: 'perfect-continuous', name: 'Perfect Continuous' }
];

const voiceOptions = [
    { id: 'Active Voice', name: 'Active Voice' }, 
    { id: 'Passive Voice', name: 'Passive Voice' }
];

const formOptions = [
    { id: 'Affirmative', name: 'Affirmative' },
    { id: 'Negative', name: 'Negative' },
    { id: 'Interrogative', name: 'Question' }
];

// --- Helper Components ---

// Generic Toggle Group Component (UPDATED FOR DARK MODE)
function ToggleGroup({ title, options, selected, onSelect, customColors = 'text-blue-600 border-blue-600 bg-blue-50' }) {
    const handleToggle = (value) => {
        onSelect(value);
    };

    return (
        <div className="flex flex-col space-y-4 lg:space-y-6">
            <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 dark:text-gray-200 text-center">{title}</h3>
            <div className={`grid gap-3 lg:gap-5 ${options.length === 2 ? 'grid-cols-2' : (options.length === 3 ? 'grid-cols-3' : 'grid-cols-4 sm:grid-cols-3 lg:grid-cols-4')}`}>
                {options.map(option => {
                    const value = option.id || option;
                    const name = option.name || option;
                    const Icon = option.icon;
                    const isActive = selected === value;

                    return (
                        <button
                            key={value}
                            onClick={() => handleToggle(value)}
                            className={`
                                flex flex-col items-center justify-center h-24 lg:h-32 p-2 rounded-xl font-semibold text-center text-sm lg:text-lg transition-all duration-200 border
                                ${isActive
                                    // Active state needs dark:ring-offset
                                    ? `${customColors} ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-gray-900`
                                    // Inactive state needs dark background/border/text
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

// TTS Helper Function (remains the same)
const speakText = (text) => {
    if (!('speechSynthesis' in window)) {
        console.warn("Speech synthesis not supported in this browser.");
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    const findFemaleVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        return voices.find(
            (voice) => voice.lang.startsWith('en') && voice.name.toLowerCase().includes('female')
        ) || voices.find((voice) => voice.lang.startsWith('en'));
    };

    const trySpeak = (attempt = 0) => {
        const femaleVoice = findFemaleVoice();

        if (femaleVoice) {
            utterance.voice = femaleVoice;
            utterance.rate = 1;
            utterance.pitch = 1.1;
            window.speechSynthesis.speak(utterance);
        } else if (attempt < 5) {
            setTimeout(() => trySpeak(attempt + 1), 200);
        } else {
            window.speechSynthesis.speak(utterance);
        }
    };

    trySpeak();
};

// Loading Component (UPDATED FOR DARK MODE)
const LoadingSpinner = ({ message = "Converting sentence..." }) => (
    <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-2xl space-y-4 border border-gray-200 dark:border-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">{message}</p>
    </div>
);

// Result Screen Component (UPDATED FOR DARK MODE)
const ResultScreen = ({ sourceSentence, result, targetTense, targetVoice, targetForm, handleNewConversion }) => {
    const { convertedSentence, explanation, structure } = result;

    const isAffirmative = targetForm === 'Affirmative';
    const isInterrogative = targetForm === 'Interrogative';

    return (
        <div className="text-center space-y-6">
            <div className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 p-6 rounded-2xl flex items-center justify-center gap-3">
                <CheckCircle className="w-12 h-12" />
                <h2 className="text-4xl font-extrabold">
                    Conversion Complete!
                </h2>
            </div>
            
            {/* Source and Converted Sentences */}
            <div className="w-full space-y-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl text-left">
                    <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-1">Original Sentence:</p>
                    <p className="text-gray-800 dark:text-gray-100 font-bold text-lg">{sourceSentence}</p>
                </div>
                
                <div className={`p-4 rounded-xl border-2 text-left ${
                    // Dynamic background/border colors with dark mode support
                    isAffirmative 
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40' 
                        : isInterrogative 
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/40' 
                            : 'border-red-500 bg-red-50 dark:bg-red-900/40'
                }`}>
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400 font-medium text-sm mb-1">Converted Sentence:</p>
                            <p className="text-gray-900 dark:text-gray-100 font-extrabold text-xl leading-relaxed">
                                {convertedSentence}
                            </p>
                        </div>
                        <button 
                            onClick={() => speakText(convertedSentence)}
                            // Dark mode color adjustments for the button
                            className="text-gray-500 dark:text-gray-400 hover:text-blue-500 transition p-2 rounded-full hover:bg-white dark:hover:bg-gray-700" 
                            title="Listen to sentence"
                        >
                            <Volume2 className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Grammar Breakdown */}
            <div className="w-full text-left space-y-3">
                <h4 className="text-xl font-bold text-blue-700 dark:text-blue-400">Grammar Breakdown</h4>
                
                <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <strong className="text-gray-700 dark:text-gray-300">Formula: </strong>
                    <code className="bg-white dark:bg-gray-800 p-1 rounded-md font-mono text-sm text-red-700 break-words">{structure}</code>
                </div>

                <div className="bg-green-50 dark:bg-green-900/40 p-4 rounded-lg border border-green-200 dark:border-green-700">
                    <strong className="text-green-800 dark:text-green-300 block mb-1">How it was Converted:</strong>
                    <p className="text-gray-800 dark:text-gray-100 leading-relaxed text-sm">{explanation}</p>
                </div>
            </div>

            <button
                onClick={handleNewConversion}
                className="flex items-center gap-2 py-3 px-6 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors"
            >
                <RotateCcw className="w-5 h-5" /> Convert Another Sentence
            </button>
        </div>
    );
};

// Main Component
function TenseConverterPage() {
    const totalSteps = 4;
    
    const [step, setStep] = useState(1);
    const [conversionPhase, setConversionPhase] = useState('settings');
    const [inputData, setInputData] = useState({
        sourceSentence: '', // CHANGED: Start with empty string instead of example
        time: null,
        aspect: null,
        voice: null,
        form: null,
    });
    const [conversionResult, setConversionResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get the full tense ID and title
    const fullTenseId = inputData.time && inputData.aspect ? 
        `${inputData.time}-${inputData.aspect.replace(' ', '-')}` : null;
    const targetTenseData = fullTenseId ? tensesData[fullTenseId] : null;
    const targetTenseTitle = targetTenseData?.title || 'Unknown Tense';

    const handleConversion = useCallback(async () => {
        setError(null);
        
        // Validation
        if (!inputData.sourceSentence.trim() || !fullTenseId || !inputData.voice || !inputData.form) {
            setError("Please complete all required selections.");
            return;
        }

        setLoading(true);
        setConversionPhase('loading');

        const payload = {
            sourceSentence: inputData.sourceSentence.trim(),
            targetTenseId: fullTenseId,
            targetTenseTitle: targetTenseTitle,
            targetVoice: inputData.voice,
            targetForm: inputData.form,
        };

        const maxRetries = 3;
        const baseDelay = 1000;
        
        for (let attempt = 0; attempt < maxRetries; attempt++) {
            try {
                const response = await fetch('/api/convert', { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    if (response.status === 429 && attempt < maxRetries - 1) {
                        throw new Error("Retryable error: Throttled");
                    }
                    throw new Error(errorData.detail || errorData.error || `HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();
                
                if (!data.convertedSentence || !data.explanation || !data.structure) {
                    throw new Error("Received incomplete data from the AI.");
                }

                setConversionResult(data);
                setConversionPhase('results');
                setLoading(false);
                return;

            } catch (err) {
                if (err.message === "Retryable error: Throttled" && attempt < maxRetries - 1) {
                    const delay = baseDelay * Math.pow(2, attempt);
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    console.error("Conversion API Error:", err);
                    setError(err.message || "Failed to generate conversion. Please try again.");
                    setConversionPhase('settings');
                    setLoading(false);
                    return;
                }
            }
        }
    }, [inputData, fullTenseId, targetTenseTitle]);

    // Navigation Handlers
    const isNextEnabled = () => {
        if (step === 1) return true;
        if (step === 2 && inputData.time && inputData.aspect) return true;
        if (step === 3 && inputData.voice && inputData.form) return true;
        if (step === 4 && inputData.sourceSentence.trim()) return true;
        return false;
    };

    const handleNext = () => {
        if (step < totalSteps) {
            setStep(step + 1);
        } else if (step === totalSteps) {
            handleConversion();
        }
    };
    
    const handleBack = () => {
        if (step > 1) {
            setStep(step - 1);
        }
    };
    
    // FIXED: Clear all input data including the sentence when starting new conversion
    const handleNewConversion = () => {
        setConversionPhase('settings');
        setStep(1);
        setConversionResult(null);
        setError(null);
        // CHANGED: Reset ALL input data including the sentence
        setInputData({
            sourceSentence: '',
            time: null,
            aspect: null,
            voice: null,
            form: null,
        });
    };

    const handleStartConversion = () => {
        if (!inputData.time || !inputData.aspect || !inputData.voice || !inputData.form || !inputData.sourceSentence.trim()) {
            setError("Please complete all required selections before converting.");
            return;
        }
        handleConversion();
    };

    // Render Content by Step
    const renderContent = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6">
                        <p className="text-gray-700 dark:text-gray-300 text-lg lg:text-xl text-justify leading-relaxed">
                            Welcome to the Tense Converter! This powerful tool helps you convert sentences between different English tenses, voices, and forms. 
                            Simply enter your sentence and select the target tense characteristics you want to practice. 
                            The converter will provide the transformed sentence along with a detailed grammar breakdown to help you understand the conversion process.
                        </p>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8 lg:space-y-12">
                        <ToggleGroup
                            title="Tense Time"
                            options={timeOptions}
                            selected={inputData.time}
                            onSelect={(t) => setInputData(p => ({ ...p, time: t }))}
                            customColors="text-blue-600 border-blue-600 bg-blue-100/70 dark:bg-blue-900/40"
                        />
                        <ToggleGroup
                            title="Tense Aspect"
                            options={aspectOptions}
                            selected={inputData.aspect}
                            onSelect={(a) => setInputData(p => ({ ...p, aspect: a }))}
                            customColors="text-indigo-600 border-indigo-600 bg-indigo-100/70 dark:bg-indigo-900/40"
                        />
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-8 lg:space-y-12">
                        <ToggleGroup
                            title="Voice"
                            options={voiceOptions}
                            selected={inputData.voice}
                            onSelect={(v) => setInputData(p => ({ ...p, voice: v }))}
                            customColors="text-green-600 border-green-600 bg-green-100/70 dark:bg-green-900/40"
                        />
                        <ToggleGroup
                            title="Sentence Form"
                            options={formOptions}
                            selected={inputData.form}
                            onSelect={(f) => setInputData(p => ({ ...p, form: f }))}
                            customColors="text-red-600 border-red-600 bg-red-100/70 dark:bg-red-900/40"
                        />
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <label htmlFor="source-sentence" className="block text-xl md:text-2xl lg:text-3xl font-bold text-gray-700 dark:text-gray-200 text-center">
                            Enter Your Sentence
                        </label>
                        <textarea
                            id="source-sentence"
                            rows="4"
                            value={inputData.sourceSentence}
                            onChange={(e) => setInputData(p => ({ ...p, sourceSentence: e.target.value }))}
                            placeholder="Type the sentence you want to convert here..."
                            // Input field dark mode styles
                            className="w-full p-4 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-gray-800 dark:text-gray-100 dark:bg-gray-700 text-lg resize-none transition-all duration-300"
                        />
                        {error && (
                            <div className="p-4 bg-red-50 dark:bg-red-900/40 border border-red-200 dark:border-red-700 rounded-xl">
                                <p className="text-red-700 dark:text-red-300 font-medium text-center">{error}</p>
                            </div>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="min-h-screen text-gray-900 dark:text-gray-100 flex flex-col items-center">
            
            <main className={`flex flex-col items-center w-full p-4 md:p-6 flex-grow justify-center pb-24`}>
                
                {/* Main Title - Only show on first step */}
                {(conversionPhase === 'settings' && step === 1) ? (
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-center text-gray-800 dark:text-gray-200 mb-8 md:mb-12 lg:mb-16">
                        Tense Converter 
                    </h1>
                ) : (
                    <div className="h-4 md:h-8"></div>
                )}
                
                <div className="max-w-xl lg:max-w-3xl mx-auto w-full transform -translate-y-4 md:-translate-y-8">
                    
                    {/* Results Phase */}
                    {conversionPhase === 'results' && conversionResult && (
                        <ResultScreen 
                            sourceSentence={inputData.sourceSentence}
                            result={conversionResult}
                            targetTense={targetTenseTitle}
                            targetVoice={inputData.voice}
                            targetForm={inputData.form}
                            handleNewConversion={handleNewConversion}
                        />
                    )}
                    
                    {/* Loading Phase */}
                    {conversionPhase === 'loading' && (
                        <LoadingSpinner message="Converting your sentence..." />
                    )}
                    
                    {/* Settings Phase */}
                    {conversionPhase === 'settings' && (
                        <div className="space-y-6 lg:space-y-8">
                            
                            {/* Content without shadow box */}
                            {renderContent()}
                            
                            {/* Navigation Bar (UPDATED FOR DARK MODE) */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700 lg:pt-6">
                                
                                {/* Back Button */}
                                <button
                                    onClick={handleBack}
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

                                {/* Next / Convert Button */}
                                {step < totalSteps ? (
                                    <button
                                        onClick={handleNext}
                                        disabled={!isNextEnabled()}
                                        className={`flex items-center gap-1 py-3 px-4 lg:py-4 lg:px-6 rounded-full font-bold text-white lg:text-lg transition-all duration-300
                                            ${!isNextEnabled() 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-blue-600 hover:bg-blue-700'}`}
                                    >
                                        Next
                                        <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleStartConversion}
                                        disabled={!isNextEnabled()}
                                        className={`flex items-center gap-1 py-3 px-6 lg:py-4 lg:px-8 rounded-full font-bold text-white lg:text-xl transition-all duration-300
                                            ${!isNextEnabled() 
                                                ? 'bg-gray-400 cursor-not-allowed' 
                                                : 'bg-green-600 hover:bg-green-700'}`}
                                    >
                                        <Send className="w-5 h-5 lg:w-6 lg:h-6" />
                                        Convert Sentence
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default TenseConverterPage;