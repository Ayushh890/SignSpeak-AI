const SIGN_WORDS = {
  A: 'a', B: 'b', C: 'c', D: 'd', E: 'e', F: 'f', G: 'g', H: 'h',
  I: 'i', J: 'j', K: 'k', L: 'l', M: 'm', N: 'n', O: 'o', P: 'p',
  Q: 'q', R: 'r', S: 's', T: 't', U: 'u', V: 'v', W: 'w', X: 'x',
  Y: 'y', Z: 'z',
  'Hello': 'hello',
  'Good': 'good',
  'Strong': 'strong',
  'You': 'you',
  'Open Hand (5)': 'hello',
  'Thumbs Up': 'good',
  'Fist (S)': 'stop',
  'Point (1)': 'you',
}

const GRAMMAR_RULES = [
  { pattern: ['I', 'WANT', 'EAT'], output: 'I want to eat' },
  { pattern: ['I', 'WANT', 'DRINK'], output: 'I want to drink' },
  { pattern: ['I', 'WANT', 'GO'], output: 'I want to go' },
  { pattern: ['THANK', 'YOU'], output: 'Thank you' },
  { pattern: ['GOOD', 'MORNING'], output: 'Good morning' },
  { pattern: ['GOOD', 'NIGHT'], output: 'Good night' },
  { pattern: ['HOW', 'ARE', 'YOU'], output: 'How are you?' },
  { pattern: ['MY', 'NAME'], output: 'My name is' },
  { pattern: ['PLEASE', 'HELP'], output: 'Please help me' },
  { pattern: ['I', 'LOVE', 'YOU'], output: 'I love you' },
  { pattern: ['SORRY'], output: "I'm sorry" },
  { pattern: ['HELLO'], output: 'Hello!' },
  { pattern: ['GOODBYE'], output: 'Goodbye!' },
]

const CONTEXT_EXPANSIONS = {
  'hello good': 'Hello! How are you?',
  'good you': 'Good, and you?',
  'you good': 'Are you good?',
  'stop no': 'No, stop!',
  'please you help': 'Can you please help me?',
  'i want': 'I want',
  'thank good': 'Thank you so much!',
}

export function buildSentence(signSequence) {
  if (!signSequence || signSequence.length === 0) return ''

  const normalized = signSequence.map(s => {
    const word = SIGN_WORDS[s] || s
    return word.toLowerCase()
  })

  for (const rule of GRAMMAR_RULES) {
    const patternLower = rule.pattern.map(p => p.toLowerCase())
    if (matchesPattern(normalized, patternLower)) {
      return rule.output
    }
  }

  const joined = normalized.join(' ')
  for (const [key, expansion] of Object.entries(CONTEXT_EXPANSIONS)) {
    if (joined.includes(key)) {
      return joined.replace(key, expansion)
    }
  }

  if (normalized.length >= 2) {
    return constructNaturalSentence(normalized)
  }

  return capitalize(normalized.join(' '))
}

function matchesPattern(sequence, pattern) {
  if (sequence.length < pattern.length) return false
  for (let i = 0; i <= sequence.length - pattern.length; i++) {
    let match = true
    for (let j = 0; j < pattern.length; j++) {
      if (sequence[i + j] !== pattern[j]) {
        match = false
        break
      }
    }
    if (match) return true
  }
  return false
}

function constructNaturalSentence(words) {
  let sentence = words.join(' ')

  sentence = sentence
    .replace(/\bi\b/g, 'I')
    .replace(/\bim\b/g, "I'm")
    .replace(/\bdont\b/g, "don't")
    .replace(/\bcant\b/g, "can't")
    .replace(/\bwont\b/g, "won't")

  return capitalize(sentence)
}

function capitalize(str) {
  if (!str) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function predictNextSign(currentSequence) {
  const predictions = {
    'hello': ['how', 'good', 'my'],
    'how': ['are', 'do'],
    'i': ['want', 'am', 'love', 'need'],
    'want': ['eat', 'drink', 'go', 'help'],
    'thank': ['you'],
    'good': ['morning', 'night', 'bye'],
    'my': ['name', 'friend'],
    'please': ['help', 'wait', 'come'],
  }

  if (currentSequence.length === 0) return []
  const lastWord = (SIGN_WORDS[currentSequence[currentSequence.length - 1]] || currentSequence[currentSequence.length - 1]).toLowerCase()
  return predictions[lastWord] || []
}
