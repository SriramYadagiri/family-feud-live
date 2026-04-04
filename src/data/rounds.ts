export interface Answer {
  text: string;
  points: number;
}

export interface Question {
  question: string;
  answers: Answer[];
}

export interface Round {
  round: number;
  questions: Question[];
}

export const rounds: Round[] = [
  {
    round: 1,
    questions: [
      {
        question: "What do some people look to for relationship guidance that you don't believe in?",
        answers: [
          { text: "Therapist", points: 38 },
          { text: "Psychic", points: 23 },
          { text: "Books", points: 22 },
          { text: "Horoscope", points: 17 },
        ],
      },
      {
        question: "Name something a woman might stop maintaining once she's in a serious relationship",
        answers: [
          { text: "Weight", points: 41 },
          { text: "Looks", points: 33 },
          { text: "Friendships", points: 17 },
          { text: "House", points: 9 },
        ],
      },
      {
        question: "Name something from your ex that you might get rid of when starting a new relationship",
        answers: [
          { text: "Pictures", points: 46 },
          { text: "Jewelry", points: 32 },
          { text: "Their Clothes", points: 14 },
          { text: "Letters", points: 8 },
        ],
      },
      {
        question: "Name something you do on a first date that you wouldn't do a year into the relationship",
        answers: [
          { text: "Open Door", points: 42 },
          { text: "Pay Bills", points: 26 },
          { text: "Be Affectionate", points: 23 },
          { text: "Bring Flowers", points: 9 },
        ],
      },
      {
        question: "Name a fact about a new boyfriend that a woman might wait to tell her parents",
        answers: [
          { text: "His Age", points: 46 },
          { text: "His Job", points: 21 },
          { text: "Old Relationships", points: 18 },
          { text: "Criminal Record", points: 15 },
        ],
      },
      {
        question: "Name something a woman should know about a man before marrying him",
        answers: [
          { text: "Income", points: 39 },
          { text: "Age", points: 26 },
          { text: "Does He Have Kids", points: 22 },
          { text: "His Name", points: 13 },
        ],
      },
      {
        question: "Name something a man might do in the beginning of a relationship that he won't do after about a year",
        answers: [
          { text: "Buy Flowers", points: 47 },
          { text: "Open Doors", points: 29 },
          { text: "Kiss", points: 13 },
          { text: "Hold Hands", points: 11 },
        ],
      },
      {
        question: "Name something people proudly share on Facebook",
        answers: [
          { text: "Pictures", points: 53 },
          { text: "Age", points: 15 },
          { text: "Info on Kids", points: 12 },
          { text: "Real Name", points: 10 },
        ],
      },
    ],
  },
];
