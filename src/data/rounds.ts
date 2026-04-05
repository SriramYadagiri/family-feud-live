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
        question: "Name something a married couple might like about being married",
        answers: [
          { text: "Companionship / friendship", points: 35 },
          { text: "Emotional support", points: 25 },
          { text: "Physical relationship", points: 20 },
          { text: "Security", points: 15 },
          { text: "Not being single", points: 5 },
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
        question: "Name a perfect married couple (past or present)",
        answers: [
          { text: "Barack & Michelle Obama", points: 35 },
          { text: "Blake Lively & Ryan Reynolds", points: 25 },
          { text: "Meghan Markle & Prince Harry", points: 20 },
          { text: "Beyonce & Jay Z", points: 15 },
          { text: "Alex Rodriguez & Jennifer Lopez", points: 5 },
        ],
      },
      {
        question: "Name a place where people get married",
        answers: [
          { text: "Church", points: 35 },
          { text: "Temple", points: 25 },
          { text: "Las Vegas", points: 20 },
          { text: "Paris", points: 15 },
          { text: "Beach", points: 5 },
        ],
      },
      {
        question: "Name a great gift to give to newlyweds",
        answers: [
          { text: "Money", points: 35 },
          { text: "Gift cards", points: 25 },
          { text: "Games", points: 20 },
          { text: "Break / vacation", points: 15 },
          { text: "Advice", points: 5 },
        ],
      },
      {
        question: "Name a gift a newly married couple may receive multiples of",
        answers: [
          { text: "Towels", points: 35 },
          { text: "Perfume", points: 25 },
          { text: "Toaster", points: 20 },
          { text: "Dishes", points: 15 },
          { text: "DIY tools", points: 5 },
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
        question: "What is the most important thing to consider when planning a date",
        answers: [
          { text: "Time", points: 35 },
          { text: "Babysitter", points: 25 },
          { text: "Cost", points: 20 },
          { text: "Your interests", points: 15 },
          { text: "Distance", points: 5 },
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
        question: "Name the most important thing a couple has to pick for the wedding",
        answers: [
          { text: "Venue", points: 35 },
          { text: "Rings", points: 25 },
          { text: "Date", points: 20 },
          { text: "Food", points: 15 },
          { text: "Location / spot", points: 5 },
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
      },
      {
        question: "Name a food that is associated with romance",
        answers: [
          { text: "Strawberries", points: 35 },
          { text: "Whipped cream", points: 25 },
          { text: "Chocolate", points: 20 },
          { text: "Oysters", points: 15 },
          { text: "Pasta", points: 5 },
        ],
      },
      {
        question: "Name something you and your spouse might share on a date",
        answers: [
          { text: "Dessert", points: 35 },
          { text: "Meal", points: 25 },
          { text: "Popcorn", points: 20 },
          { text: "A kiss", points: 15 },
          { text: "Stories", points: 5 },
        ],
      },
      {
        question: "Name advice newlyweds often receive",
        answers: [
          { text: "Don't go to bed angry", points: 35 },
          { text: "Keep dating each other", points: 25 },
          { text: "Budget your money", points: 20 },
          { text: "Have lots of babies", points: 15 },
          { text: "Put the other first", points: 5 },
        ],
      },
    ],
  },
];
