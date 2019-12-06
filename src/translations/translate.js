import en from './en.json';
import np from './np.json';
const files = {
  np: np,
  en: en
}

export const translate = (key, language) => {
  language = language || localStorage.getItem('langauge') || 'np';
  return files[language][key] || `[${key}]`;
}

export const setLanguage = (language) => {
  localStorage.setItem('langauge', language);
}

export const getLanguage = () => {
  return localStorage.getItem('langauge');
}