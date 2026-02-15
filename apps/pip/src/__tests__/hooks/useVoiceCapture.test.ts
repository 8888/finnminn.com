import { renderHook, act } from '@testing-library/react';
import { useVoiceCapture } from '../../hooks/useVoiceCapture';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('useVoiceCapture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock SpeechRecognition
    const MockSpeechRecognition = vi.fn().mockImplementation(function() {
      return {
        start: vi.fn(),
        stop: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        onresult: null,
        onend: null,
        onerror: null,
        continuous: false,
        interimResults: false,
        lang: 'en-US'
      };
    });

    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = MockSpeechRecognition;
    (window as unknown as { webkitSpeechRecognition: unknown }).webkitSpeechRecognition = MockSpeechRecognition;
  });

  it('should detect browser support', () => {
    const { result } = renderHook(() => useVoiceCapture());
    expect(result.current.isSupported).toBe(true);
  });

  it('should toggle isListening state', () => {
    const { result } = renderHook(() => useVoiceCapture());
    
    expect(result.current.isListening).toBe(false);
    
    act(() => {
      result.current.start();
    });
    
    expect(result.current.isListening).toBe(true);
    
    act(() => {
      result.current.stop();
    });
    
    expect(result.current.isListening).toBe(false);
  });

  it('should return transcript when speech is recognized', () => {
    let onResultCallback: ((event: unknown) => void) | undefined;
    const MockSpeechRecognition = vi.fn().mockImplementation(function() {
      const recognition = {
        start: vi.fn(),
        stop: vi.fn(),
        onresult: null as ((event: unknown) => void) | null,
        onend: null,
        onerror: null,
      };
      // Capture the callback when it's assigned
      Object.defineProperty(recognition, 'onresult', {
        set: (fn) => { onResultCallback = fn; }
      });
      return recognition;
    });
    (window as unknown as { SpeechRecognition: unknown }).SpeechRecognition = MockSpeechRecognition;

    const { result } = renderHook(() => useVoiceCapture());
    
    act(() => {
      if (onResultCallback) {
        onResultCallback({
          resultIndex: 0,
          results: [
            [{ transcript: 'hello world' }]
          ]
        });
      }
    });
    
    expect(result.current.transcript).toBe('hello world');
  });
});
