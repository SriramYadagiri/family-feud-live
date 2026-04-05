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
        question: "Name something a woman changes that a man might not notice.",
        answers: [
          { text: "Hair", points: 35 },
          { text: "Makeup", points: 25 },
          { text: "Nails", points: 20 },
          { text: "Perfume", points: 15 },
          { text: "Clothes", points: 5 },
        ],
      },
      {
        question: "Name something a married couple commonly fight about",
        answers: [
          { text: "Finances", points: 35 },
          { text: "Kids", points: 25 },
          { text: "In-laws", points: 20 },
          { text: "Chores", points: 15 },
          { text: "Personal habits", points: 5 },
        ],
      },
      {
        question: "Name an excuse for not having a date night with spouse",
        answers: [
          { text: "Tired", points: 35 },
          { text: "Kids / no babysitter", points: 25 },
          { text: "Busy", points: 20 },
          { text: "No money", points: 15 },
          { text: "Lazy", points: 5 },
        ],
      },
      {
        question: "Name an ideal setting for a date night",
        answers: [
          { text: "Restaurant", points: 35 },
          { text: "Stay home", points: 25 },
          { text: "Cafe", points: 20 },
          { text: "Picnic / park", points: 15 },
          { text: "Long drive", points: 5 },
        ],
      },
      {
        question: "Name something a spouse might do to show their love",
        answers: [
          { text: "Hug / kiss", points: 35 },
          { text: "Buy flowers", points: 25 },
          { text: "Buy a gift", points: 20 },
          { text: "Do chores", points: 15 },
          { text: "Write a love note", points: 5 },
        ],
      },
      {
        question: "Name something a married couple may say is hard about being married",
        answers: [
          { text: "Compromising", points: 35 },
          { text: "No me time", points: 25 },
          { text: "Making joint decisions", points: 20 },
          { text: "Sharing", points: 15 },
          { text: "Extra responsibility", points: 5 },
        ],
      },
      {
        question: "Name something a spouse might avoid doing around their partner",
        answers: [
          { text: "Farting / passing gas", points: 35 },
          { text: "Using the bathroom", points: 25 },
          { text: "Picking their nose", points: 20 },
          { text: "Burping", points: 15 },
          { text: "Shopping online", points: 5 },
        ],
      },
      {
        question: "Name something a wife might tell her husband he needs to change",
        answers: [
          { text: "Attitude", points: 35 },
          { text: "Habits", points: 25 },
          { text: "Appearance", points: 20 },
          { text: "Communication", points: 15 },
          { text: "Lifestyle", points: 5 },
        ],
      },
      {
        question: "Name something couples stop doing after they are married",
        answers: [
          { text: "Dating", points: 35 },
          { text: "Flirting", points: 25 },
          { text: "Taking care of their looks", points: 20 },
          { text: "Talking", points: 15 },
          { text: "Saying 'I love you'", points: 5 },
        ],
      },
      {
        question: "What might a husband do for his wife to apologize",
        answers: [
          { text: "Buy flowers", points: 35 },
          { text: "Give a gift", points: 25 },
          { text: "Cook dinner", points: 20 },
          { text: "Do house chores", points: 15 },
          { text: "Give a massage", points: 5 },
        ],
      },
      {
        question: "Name something you might do on a romantic day with your partner",
        answers: [
          { text: "Picnic", points: 35 },
          { text: "Sleep in", points: 25 },
          { text: "Go on a hike", points: 20 },
          { text: "Give massages", points: 15 },
          { text: "Go to the beach", points: 5 },
        ],
      },
      {
        question: "Name a feature that most attracted you to your spouse",
        answers: [
          { text: "Eyes", points: 35 },
          { text: "Smile", points: 25 },
          { text: "Personality", points: 20 },
          { text: "Sense of humor", points: 15 },
          { text: "Style", points: 5 },
        ],
      },
      {
        question: "Name a party that is centered around a couple",
        answers: [
          { text: "Anniversary party", points: 35 },
          { text: "Engagement party", points: 25 },
          { text: "Wedding party", points: 20 },
          { text: "Bridal shower", points: 15 },
          { text: "Baby shower", points: 5 },
        ],
      }
    ],
  },
];
