type questionType = {
  [question: string]: number;
};

// onSubmit and Save API

const question: questionType = {
  "Number of White children served": 0,
  "Number of Black children served": 0,
  "Number of Latino children served": 0,
  "Number of Asian children served": 0,
  "Number of Native American/Alaskan/Hawiian children served": 0,
};

export { question, type questionType };
