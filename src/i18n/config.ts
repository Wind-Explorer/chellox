import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

export const supportedLanguages = {
  "en-US": "English",
  "zh-CN": "中文",
};

i18n
  .use(HttpApi)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en-US",
    debug: true,
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
