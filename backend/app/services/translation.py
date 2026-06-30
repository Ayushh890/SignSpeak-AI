TRANSLATIONS = {
    "hi": {
        "hello": "नमस्ते", "good morning": "सुप्रभात", "good night": "शुभ रात्रि",
        "thank you": "धन्यवाद", "sorry": "माफ़ करें", "please": "कृपया",
        "how are you": "आप कैसे हैं", "i love you": "मैं तुमसे प्यार करता हूँ",
        "goodbye": "अलविदा", "yes": "हाँ", "no": "नहीं", "help": "मदद",
        "my name is": "मेरा नाम है", "water": "पानी", "food": "खाना",
        "stop": "रुकिए", "good": "अच्छा", "you": "आप",
    },
    "fr": {
        "hello": "Bonjour", "good morning": "Bonjour", "good night": "Bonne nuit",
        "thank you": "Merci", "sorry": "Désolé", "please": "S'il vous plaît",
        "how are you": "Comment allez-vous", "i love you": "Je t'aime",
        "goodbye": "Au revoir", "yes": "Oui", "no": "Non", "help": "Aide",
        "my name is": "Je m'appelle", "water": "Eau", "food": "Nourriture",
        "stop": "Arrêtez", "good": "Bon", "you": "Vous",
    },
    "es": {
        "hello": "Hola", "good morning": "Buenos días", "good night": "Buenas noches",
        "thank you": "Gracias", "sorry": "Lo siento", "please": "Por favor",
        "how are you": "¿Cómo estás?", "i love you": "Te amo",
        "goodbye": "Adiós", "yes": "Sí", "no": "No", "help": "Ayuda",
        "my name is": "Mi nombre es", "water": "Agua", "food": "Comida",
        "stop": "Para", "good": "Bueno", "you": "Tú",
    },
    "ja": {
        "hello": "こんにちは", "good morning": "おはようございます", "good night": "おやすみなさい",
        "thank you": "ありがとうございます", "sorry": "すみません", "please": "お願いします",
        "how are you": "お元気ですか", "i love you": "愛しています",
        "goodbye": "さようなら", "yes": "はい", "no": "いいえ", "help": "助けて",
        "my name is": "私の名前は", "water": "水", "food": "食べ物",
        "stop": "止まれ", "good": "良い", "you": "あなた",
    },
    "de": {
        "hello": "Hallo", "good morning": "Guten Morgen", "good night": "Gute Nacht",
        "thank you": "Danke", "sorry": "Entschuldigung", "please": "Bitte",
        "how are you": "Wie geht es Ihnen", "i love you": "Ich liebe dich",
        "goodbye": "Auf Wiedersehen", "yes": "Ja", "no": "Nein", "help": "Hilfe",
        "my name is": "Mein Name ist", "water": "Wasser", "food": "Essen",
        "stop": "Stopp", "good": "Gut", "you": "Sie",
    },
    "pt": {
        "hello": "Olá", "good morning": "Bom dia", "good night": "Boa noite",
        "thank you": "Obrigado", "sorry": "Desculpe", "please": "Por favor",
        "how are you": "Como vai você", "i love you": "Eu te amo",
        "goodbye": "Adeus", "yes": "Sim", "no": "Não", "help": "Ajuda",
        "my name is": "Meu nome é", "water": "Água", "food": "Comida",
        "stop": "Pare", "good": "Bom", "you": "Você",
    },
    "ar": {
        "hello": "مرحبا", "good morning": "صباح الخير", "good night": "تصبح على خير",
        "thank you": "شكراً", "sorry": "آسف", "please": "من فضلك",
        "how are you": "كيف حالك", "i love you": "أحبك",
        "goodbye": "مع السلامة", "yes": "نعم", "no": "لا", "help": "مساعدة",
        "my name is": "اسمي", "water": "ماء", "food": "طعام",
        "stop": "توقف", "good": "جيد", "you": "أنت",
    },
}


def translate_text(text: str, source: str, target: str) -> str:
    if target == "en" or target == source:
        return text

    lang_dict = TRANSLATIONS.get(target, {})
    text_lower = text.lower().strip().rstrip("!?.)")

    if text_lower in lang_dict:
        return lang_dict[text_lower]

    translated_words = []
    for word in text.lower().split():
        clean = word.strip(".,!?")
        translated_words.append(lang_dict.get(clean, word))

    return " ".join(translated_words)
