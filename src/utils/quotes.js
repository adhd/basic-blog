const quotes = [
  "Every time you clean something, you're just making something else dirty. The universe demands balance.",
  "Elevators are time machines - they take you 20 seconds into the future, just in a different place.",
  "The sound of dial-up internet was just robots gossiping about us.",
  "Your future self is watching you right now through memories, probably judging your outfit.",
  // ... (add all 50 quotes)
  "Every piece of writing is just a different arrangement of 'a' through 'z' with occasional punctuation for spice."
];

function getRandomQuote() {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

module.exports = { getRandomQuote }; 