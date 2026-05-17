import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '../hooks/useToast';
import {
  PlayIcon,
  PauseIcon,
  ArrowPathIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/outline';

const Pomodoro = () => {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { showToast } = useToast();
  const audioRef = useRef(null);

  // Work duration: 25 minutes, Break duration: 5 minutes
  const WORK_DURATION = 25;
  const BREAK_DURATION = 5;

  useEffect(() => {
    let interval = null;

    if (isActive && (minutes > 0 || seconds > 0)) {
      interval = setInterval(() => {
        if (seconds === 0) {
          if (minutes === 0) {
            // Timer completed
            handleTimerComplete();
          } else {
            setMinutes(minutes - 1);
            setSeconds(59);
          }
        } else {
          setSeconds(seconds - 1);
        }
      }, 1000);
    } else if (minutes === 0 && seconds === 0 && isActive) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, minutes, seconds]);

  const handleTimerComplete = () => {
    setIsActive(false);
    
    if (soundEnabled) {
      playNotificationSound();
    }
    
    if (!isBreak) {
      // Work session completed
      showToast.success('Work session completed! Time for a break.');
      setSessionCount(sessionCount + 1);
      setIsBreak(true);
      setMinutes(BREAK_DURATION);
      setSeconds(0);
    } else {
      // Break completed
      showToast.success('Break completed! Ready for another session?');
      setIsBreak(false);
      setMinutes(WORK_DURATION);
      setSeconds(0);
    }
  };

  const playNotificationSound = () => {
    // Create a simple beep sound using Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(WORK_DURATION);
    setSeconds(0);
  };

  const skipToBreak = () => {
    setIsActive(false);
    setIsBreak(true);
    setMinutes(BREAK_DURATION);
    setSeconds(0);
    showToast.info('Skipped to break time');
  };

  const skipToWork = () => {
    setIsActive(false);
    setIsBreak(false);
    setMinutes(WORK_DURATION);
    setSeconds(0);
    showToast.info('Skipped to work time');
  };

  const formatTime = (mins, secs) => {
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    const totalSeconds = isBreak ? BREAK_DURATION * 60 : WORK_DURATION * 60;
    const currentSeconds = minutes * 60 + seconds;
    return ((totalSeconds - currentSeconds) / totalSeconds) * 100;
  };

  const getTimerColor = () => {
    if (isBreak) {
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-blue-600 dark:text-blue-400';
  };

  const getProgressColor = () => {
    if (isBreak) {
      return 'bg-green-500';
    }
    return 'bg-blue-500';
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Pomodoro Timer
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Stay focused and productive with the Pomodoro Technique
        </p>
      </div>

      {/* Timer Display */}
      <div className="card mb-8">
        <div className="text-center">
          <div className="mb-4">
            <span className={`text-6xl font-bold ${getTimerColor()}`}>
              {formatTime(minutes, seconds)}
            </span>
          </div>
          
          <div className="mb-6">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              isBreak 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              {isBreak ? 'Break Time' : 'Work Session'}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-8">
            <div
              className={`${getProgressColor()} h-2 rounded-full transition-all duration-1000 ease-linear`}
              style={{ width: `${getProgressPercentage()}%` }}
            ></div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={toggleTimer}
              className={`btn ${
                isActive 
                  ? 'btn-secondary' 
                  : 'btn-primary'
              } flex items-center`}
            >
              {isActive ? (
                <>
                  <PauseIcon className="h-5 w-5 mr-2" />
                  Pause
                </>
              ) : (
                <>
                  <PlayIcon className="h-5 w-5 mr-2" />
                  Start
                </>
              )}
            </button>

            <button
              onClick={resetTimer}
              className="btn btn-secondary flex items-center"
            >
              <ArrowPathIcon className="h-5 w-5 mr-2" />
              Reset
            </button>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`btn btn-secondary flex items-center ${
                soundEnabled ? 'bg-blue-100 dark:bg-blue-900' : ''
              }`}
            >
              {soundEnabled ? (
                <>
                  <SpeakerWaveIcon className="h-5 w-5 mr-2" />
                  Sound On
                </>
              ) : (
                <>
                  <SpeakerXMarkIcon className="h-5 w-5 mr-2" />
                  Sound Off
                </>
              )}
            </button>
          </div>

          {/* Skip Buttons */}
          <div className="flex justify-center space-x-4">
            {!isBreak && (
              <button
                onClick={skipToBreak}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Skip to Break
              </button>
            )}
            {isBreak && (
              <button
                onClick={skipToWork}
                className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                Skip to Work
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Sessions Completed
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {sessionCount}
          </p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Work Duration
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {WORK_DURATION} min
          </p>
        </div>

        <div className="card text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Break Duration
          </h3>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {BREAK_DURATION} min
          </p>
        </div>
      </div>

      {/* Instructions */}
      <div className="card">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          How to Use Pomodoro Technique
        </h3>
        <div className="space-y-3 text-gray-600 dark:text-gray-400">
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
              1
            </span>
            <p>
              Choose a task you'd like to get done and start the 25-minute work timer.
            </p>
          </div>
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
              2
            </span>
            <p>
              Work on the task until the timer rings. If a distraction pops into your head, write it down and get back to work.
            </p>
          </div>
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
              3
            </span>
            <p>
              When the timer rings, take a 5-minute break. Stretch, grab a drink, or just relax.
            </p>
          </div>
          <div className="flex items-start">
            <span className="flex-shrink-0 w-6 h-6 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center text-sm font-medium mr-3">
              4
            </span>
            <p>
              After four pomodoros, take a longer break (15-30 minutes) to recharge.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
