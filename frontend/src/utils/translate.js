const TRANSLATIONS = {
  hi: {
    hello: 'नमस्ते', 'good morning': 'सुप्रभात', 'good night': 'शुभ रात्रि',
    'thank you': 'धन्यवाद', sorry: 'माफ़ करें', please: 'कृपया',
    'how are you': 'आप कैसे हैं', 'i love you': 'मैं तुमसे प्यार करता हूँ',
    goodbye: 'अलविदा', yes: 'हाँ', no: 'नहीं', help: 'मदद',
    good: 'अच्छा', stop: 'रुकिए', you: 'आप', 'thank you so much': 'बहुत बहुत धन्यवाद',
  },
  fr: {
    hello: 'Bonjour', 'good morning': 'Bonjour', 'good night': 'Bonne nuit',
    'thank you': 'Merci', sorry: 'Désolé', please: "S'il vous plaît",
    'how are you': 'Comment allez-vous', 'i love you': "Je t'aime",
    goodbye: 'Au revoir', yes: 'Oui', no: 'Non', help: 'Aide',
    good: 'Bon', stop: 'Arrêtez', you: 'Vous',
  },
  es: {
    hello: 'Hola', 'good morning': 'Buenos días', 'good night': 'Buenas noches',
    'thank you': 'Gracias', sorry: 'Lo siento', please: 'Por favor',
    'how are you': '¿Cómo estás?', 'i love you': 'Te amo',
    goodbye: 'Adiós', yes: 'Sí', no: 'No', help: 'Ayuda',
    good: 'Bueno', stop: 'Para', you: 'Tú',
  },
  ja: {
    hello: 'こんにちは', 'good morning': 'おはようございます', 'good night': 'おやすみなさい',
    'thank you': 'ありがとうございます', sorry: 'すみません', please: 'お願いします',
    'how are you': 'お元気ですか', 'i love you': '愛しています',
    goodbye: 'さようなら', yes: 'はい', no: 'いいえ', help: '助けて',
    good: '良い', stop: '止まれ', you: 'あなた',
  },
  de: {
    hello: 'Hallo', 'good morning': 'Guten Morgen', 'good night': 'Gute Nacht',
    'thank you': 'Danke', sorry: 'Entschuldigung', please: 'Bitte',
    'how are you': 'Wie geht es Ihnen', 'i love you': 'Ich liebe dich',
    goodbye: 'Auf Wiedersehen', yes: 'Ja', no: 'Nein', help: 'Hilfe',
    good: 'Gut', stop: 'Stopp', you: 'Sie',
  },
  pt: {
    hello: 'Olá', 'good morning': 'Bom dia', 'good night': 'Boa noite',
    'thank you': 'Obrigado', sorry: 'Desculpe', please: 'Por favor',
    'how are you': 'Como vai você', 'i love you': 'Eu te amo',
    goodbye: 'Adeus', yes: 'Sim', no: 'Não', help: 'Ajuda',
    good: 'Bom', stop: 'Pare', you: 'Você',
  },
  ar: {
    hello: 'مرحبا', 'good morning': 'صباح الخير', 'good night': 'تصبح على خير',
    'thank you': 'شكراً', sorry: 'آسف', please: 'من فضلك',
    'how are you': 'كيف حالك', 'i love you': 'أحبك',
    goodbye: 'مع السلامة', yes: 'نعم', no: 'لا', help: 'مساعدة',
    good: 'جيد', stop: 'توقف', you: 'أنت',
  },
}

export async function translateText(text, targetLang) {
  if (targetLang === 'en') return text

  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text,
        source_language: 'en',
        target_language: targetLang,
      }),
    })
    if (res.ok) {
      const data = await res.json()
      return data.translated_text
    }
  } catch {
    // Backend unavailable — use local dictionary
  }

  return translateLocal(text, targetLang)
}

function translateLocal(text, targetLang) {
  const dict = TRANSLATIONS[targetLang]
  if (!dict) return text

  const lower = text.toLowerCase().trim().replace(/[!?.]+$/, '')
  if (dict[lower]) return dict[lower]

  const words = lower.split(' ')
  const translated = words.map(w => dict[w] || w)
  return translated.join(' ')
}
