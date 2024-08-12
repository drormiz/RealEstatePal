import {
  prohibitedWords,
  realEstateTermsAndKeywords,
} from '../realEstateKeywords';

const validateUserMessage = (text) => {
  const containsProhibitedWords = prohibitedWords.some((word) =>
    text.toLowerCase().includes(word)
  );

  if (containsProhibitedWords)
    return {
      isValid: false,
      message: 'Your question contains inappropriate language.',
    };

  const containsRealEstateKeywords = realEstateTermsAndKeywords.some(
    (keyword) => text.toLowerCase().includes(keyword)
  );

  if (!containsRealEstateKeywords) {
    return {
      isValid: false,
      message: 'Please ask questions related to real estate.',
    };
  }

  return { isValid: true };
};

export default validateUserMessage;
