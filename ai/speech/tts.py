"""
Text-to-Speech module.
Current: Browser-native Web Speech API (handled in frontend).
Future: Coqui TTS for higher quality, customizable voices.

To use Coqui TTS:
    pip install TTS
    from TTS.api import TextToSpeech
    tts = TextToSpeech(model_name="tts_models/en/ljspeech/tacotron2-DDC")
    tts.tts_to_file(text="Hello!", file_path="output.wav")

Alternative: Google Cloud TTS, Azure TTS
"""


class TTSService:
    def __init__(self, engine="web"):
        self.engine = engine

    def synthesize(self, text: str, language: str = "en") -> bytes | None:
        if self.engine == "web":
            return None

        raise NotImplementedError(
            f"TTS engine '{self.engine}' not yet implemented. "
            "Install Coqui TTS: pip install TTS"
        )
