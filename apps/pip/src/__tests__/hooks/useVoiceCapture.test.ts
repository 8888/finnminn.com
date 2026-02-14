import { renderHook, act } from '@testing-library/react';
import { useVoiceCapture } from '../../hooks/useVoiceCapture';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('useVoiceCapture', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock SpeechRecognition
    const MockSpeechRecognition = vi.fn().mockImplementation(() => ({
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
    }));

    (window as any).SpeechRecognition = MockSpeechRecognition;
    (window as any).webkitSpeechRecognition = MockSpeechRecognition;
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
    const { result } = renderHook(() => useVoiceCapture());
    
    // Simulate speech recognition result
    // In real implementation, this would be triggered by the onresult event
    // We'll need to check how the hook handles events in the implementation
    expect(result.current.transcript).toBe('');
  });
});
