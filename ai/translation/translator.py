"""
Translation module.
Current: dictionary-based translation for common sign language phrases.
Future: HuggingFace NLLB (No Language Left Behind) for 200+ languages.

To use NLLB:
    pip install transformers sentencepiece
    from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
    model = AutoModelForSeq2SeqLM.from_pretrained("facebook/nllb-200-distilled-600M")
    tokenizer = AutoTokenizer.from_pretrained("facebook/nllb-200-distilled-600M")

Alternative: MarianMT for specific language pairs
    from transformers import MarianMTModel, MarianTokenizer
    model_name = "Helsinki-NLP/opus-mt-en-hi"
"""


class Translator:
    def __init__(self, backend="dictionary"):
        self.backend = backend

    def translate(self, text: str, source: str, target: str) -> str:
        if target == source:
            return text
        if self.backend == "dictionary":
            return self._dictionary_translate(text, target)
        return text

    def _dictionary_translate(self, text: str, target: str) -> str:
        from app.services.translation import translate_text
        return translate_text(text, "en", target)
