import {useEffect, useState} from 'react';

let recognition: any = null;
if ('webkitSpeechRecognition' in window) {
  recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'ko-KR';
}
const useVoiceRecognition = () => {
  const [recognizedText, setRecognizedText] = useState('');
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    if (!recognition) return;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      console.log(event);
      recognition.stop();
      setIsListening(false);
    };
  }, []);

  const startListening = () => {
    setRecognizedText('');
    setIsListening(true);
    recognition.start();
  };

  const stopListening = () => {
    setIsListening(false);
    recognition.stop();
  };

  return {
    recognizedText,
    isListening,
    startListening,
    hasRecognition: !!recognition,
  };
};

export default useVoiceRecognition;
