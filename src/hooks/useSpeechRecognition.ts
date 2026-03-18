'use client';

import { useState, useEffect, useCallback } from 'react';

interface SpeechRecognitionResult {
  transcript: string;
  isListening: boolean;
  isSupported: boolean;
  startListening: () => void;
  stopListening: () => void;
  error: string | null;
}

export function useSpeechRecognition(): SpeechRecognitionResult {
  const [transcript, setTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition
      || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setError('Speech Recognition não suportado neste browser');
      return;
    }

    setIsSupported(true);
  }, []);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = (window as any).SpeechRecognition
      || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError('Speech Recognition não suportado neste browser');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'pt-BR';

    recognition.onresult = (event: any) => {
      const result = event.results[0][0].transcript;
      setTranscript(result);
      setIsListening(false);
    };

    recognition.onerror = (event: any) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setTranscript('');
    setError(null);
    setIsListening(true);
    recognition.start();

    // Store recognition instance for stopListening
    (window as any).__speechRecognition = recognition;
  }, []);

  const stopListening = useCallback(() => {
    const recognition = (window as any).__speechRecognition;
    if (recognition) {
      recognition.abort();
      setIsListening(false);
    }
  }, []);

  return { transcript, isListening, isSupported, startListening, stopListening, error };
}
