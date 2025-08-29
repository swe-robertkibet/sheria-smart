export interface LawQuote {
  text: string;
  author: string;
}

const lawQuotes: LawQuote[] = [
  {
    text: "Justice delayed is justice denied.",
    author: "William E. Gladstone"
  },
  {
    text: "The law is reason, free from passion.",
    author: "Aristotle"
  },
  {
    text: "Injustice anywhere is a threat to justice everywhere.",
    author: "Martin Luther King Jr."
  },
  {
    text: "The rule of law should be respected so that the basic structure of our democracy is maintained.",
    author: "Uhuru Kenyatta"
  },
  {
    text: "Equal justice under law is the foundation of liberty.",
    author: "U.S. Supreme Court"
  },
  {
    text: "Where law ends, tyranny begins.",
    author: "John Locke"
  },
  {
    text: "The Constitution is not a living document; it is a dead document that we bring to life.",
    author: "Antonin Scalia"
  },
  {
    text: "Justice is truth in action.",
    author: "Benjamin Disraeli"
  },
  {
    text: "Laws are spider webs through which the big flies pass and the little ones get caught.",
    author: "Honoré de Balzac"
  },
  {
    text: "The good lawyer is not the man who has an eye to every side and angle of contingency, but who throws himself on your part so heartily, that he can get you out of a scrape.",
    author: "Ralph Waldo Emerson"
  },
  {
    text: "It is better that ten guilty persons escape than that one innocent suffer.",
    author: "William Blackstone"
  },
  {
    text: "The law must be stable, but it must not stand still.",
    author: "Roscoe Pound"
  },
  {
    text: "Justice consists in doing no injury to men; decency in giving them no offense.",
    author: "Marcus Tullius Cicero"
  },
  {
    text: "The Constitution only gives people the right to pursue happiness. You have to catch it yourself.",
    author: "Benjamin Franklin"
  },
  {
    text: "Legal help made simple for every Kenyan.",
    author: "Sheria Smart"
  },
  {
    text: "Access to justice is the most basic and important human right.",
    author: "Kofi Annan"
  },
  {
    text: "The arc of the moral universe is long, but it bends toward justice.",
    author: "Theodore Parker"
  },
  {
    text: "Law and order exist for the purpose of establishing justice.",
    author: "Martin Luther King Jr."
  },
  {
    text: "Justice will not be served until those who are unaffected are as outraged as those who are.",
    author: "Benjamin Franklin"
  },
  {
    text: "The law is a profession of words, and words are the lawyer's tools.",
    author: "Roscoe Pound"
  }
];

export function getRandomLawQuote(): LawQuote {
  const randomIndex = Math.floor(Math.random() * lawQuotes.length);
  return lawQuotes[randomIndex];
}