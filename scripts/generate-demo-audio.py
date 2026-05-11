#!/usr/bin/env python3
"""
Generate demo audio files for CallEmily.eu using ElevenLabs TTS.
Produces 6 files: emily-demo-{restaurant,clinic,auto}-{en,pt}.mp3
Output: ../public/audio/
Usage: python3 generate-demo-audio.py <ELEVENLABS_API_KEY>
"""

import sys
import os
import json
import math
import tempfile
import subprocess
import requests

API_KEY = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("ELEVENLABS_API_KEY", "")
if not API_KEY:
    print("Usage: python3 generate-demo-audio.py <ELEVENLABS_API_KEY>")
    sys.exit(1)

# ElevenLabs voice IDs
EMILY_VOICE = "XrExE9yKIg1WjnnlVkGX"   # Matilda — warm, professional female
GUEST_VOICE = "TX3LPaxmHKxFdv7VOQHJ"   # Liam — clear neutral male
ELEVENLABS_MODEL = "eleven_multilingual_v2"

TRANSCRIPTS = {
    "en": {
        "restaurant": [
            {"who": "emily", "t": "0:00", "text": "Good evening! This is the voice assistant for O Lugar restaurant. How can I help?"},
            {"who": "guest", "t": "0:05", "text": "Hello, I'd like to book a table for two on Friday evening."},
            {"who": "emily", "t": "0:10", "text": "Of course! Would 7 PM or 8 PM work better for you?"},
            {"who": "guest", "t": "0:15", "text": "8 PM please."},
            {"who": "emily", "t": "0:18", "text": "Done! Table for two, Friday at 8 PM. Could I have your name?"},
            {"who": "guest", "t": "0:24", "text": "Alexander."},
            {"who": "emily", "t": "0:25", "text": "Alexander, your reservation is confirmed. We look forward to seeing you on Friday!"},
        ],
        "clinic": [
            {"who": "emily", "t": "0:00", "text": "Good afternoon! Luz Saúde clinic, voice assistant. How can I help?"},
            {"who": "guest", "t": "0:04", "text": "Hello. I'd like to book a GP appointment, ideally this week."},
            {"who": "emily", "t": "0:09", "text": "Of course. We have slots on Wednesday at 2:30 PM and Friday at 11:00 AM. Which suits you?"},
            {"who": "guest", "t": "0:16", "text": "Wednesday please."},
            {"who": "emily", "t": "0:18", "text": "Done. Could I have your name and phone number for confirmation?"},
            {"who": "guest", "t": "0:24", "text": "David Santos, plus 3 5 1 9 1 2 3 4 5 6 7 8."},
            {"who": "emily", "t": "0:31", "text": "David, you're booked with the GP on Wednesday at 2:30 PM. You'll receive an SMS reminder an hour before. Goodbye!"},
        ],
        "auto": [
            {"who": "emily", "t": "0:00", "text": "Good afternoon! BMW Select dealership, voice assistant. How can I help?"},
            {"who": "guest", "t": "0:04", "text": "Hi! I'd like to book a test drive for the X3, preferably at the weekend."},
            {"who": "emily", "t": "0:09", "text": "Great choice! We have Saturday at 10 AM or noon, and Sunday at 11 AM. Which works for you?"},
            {"who": "guest", "t": "0:16", "text": "Saturday at 10 — perfect."},
            {"who": "emily", "t": "0:18", "text": "I've booked you for a BMW X3 test drive on Saturday at 10 AM. What's your name?"},
            {"who": "guest", "t": "0:23", "text": "Timothy."},
            {"who": "emily", "t": "0:24", "text": "Timothy, see you on Saturday! Our address is 12 Europa Avenue. A manager will meet you at the entrance."},
        ],
    },
    "pt": {
        "restaurant": [
            {"who": "emily", "t": "0:00", "text": "Boa noite! Sou o assistente de voz do restaurante O Lugar. Em que posso ajudar?"},
            {"who": "guest", "t": "0:05", "text": "Olá, gostaria de reservar uma mesa para dois na sexta à noite."},
            {"who": "emily", "t": "0:10", "text": "Claro! Prefere às 19h ou às 20h?"},
            {"who": "guest", "t": "0:15", "text": "Às 20h, por favor."},
            {"who": "emily", "t": "0:18", "text": "Pronto! Mesa para dois, sexta às 20h. Pode dizer-me o seu nome?"},
            {"who": "guest", "t": "0:24", "text": "Alexandre."},
            {"who": "emily", "t": "0:25", "text": "Alexandre, a sua reserva está confirmada. Esperamo-lo na sexta!"},
        ],
        "clinic": [
            {"who": "emily", "t": "0:00", "text": "Boa tarde! Clínica Luz Saúde, assistente de voz. Como posso ajudar?"},
            {"who": "guest", "t": "0:04", "text": "Olá. Queria marcar uma consulta com o clínico geral, de preferência esta semana."},
            {"who": "emily", "t": "0:09", "text": "Claro. Temos disponibilidade na quarta às 14h30 e na sexta às 11h. Qual prefere?"},
            {"who": "guest", "t": "0:16", "text": "Na quarta, por favor."},
            {"who": "emily", "t": "0:18", "text": "Feito. Pode dizer-me o seu nome e contacto para confirmação?"},
            {"who": "guest", "t": "0:24", "text": "David Santos, mais 3 5 1 9 1 2 3 4 5 6 7 8."},
            {"who": "emily", "t": "0:31", "text": "David, está marcado com o clínico geral na quarta às 14h30. Receberá um SMS de lembrete uma hora antes. Até breve!"},
        ],
        "auto": [
            {"who": "emily", "t": "0:00", "text": "Boa tarde! Concessionária BMW Select, assistente de voz. Como posso ajudar?"},
            {"who": "guest", "t": "0:04", "text": "Olá! Queria marcar um test drive do X3, de preferência ao fim de semana."},
            {"who": "emily", "t": "0:09", "text": "Ótima escolha! Temos sábado às 10h ou ao meio-dia, e domingo às 11h. Qual prefere?"},
            {"who": "guest", "t": "0:16", "text": "Sábado às 10 — perfeito."},
            {"who": "emily", "t": "0:18", "text": "Ficou marcado um test drive do BMW X3 no sábado às 10h. Qual é o seu nome?"},
            {"who": "guest", "t": "0:23", "text": "Timóteo."},
            {"who": "emily", "t": "0:24", "text": "Timóteo, até sábado! A nossa morada é Avenida Europa, 12. Um gestor irá recebê-lo na entrada."},
        ],
    },
}

def ts_to_sec(t: str) -> float:
    parts = t.split(":")
    return int(parts[0]) * 60 + float(parts[1])

def tts(text: str, voice_id: str, tmp_path: str, language_code: str = "en") -> bool:
    url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
    headers = {"xi-api-key": API_KEY, "Content-Type": "application/json"}
    body = {
        "text": text,
        "model_id": ELEVENLABS_MODEL,
        "language_code": language_code,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }
    r = requests.post(url, headers=headers, json=body, timeout=60)
    if r.status_code != 200:
        print(f"  ElevenLabs error {r.status_code}: {r.text[:200]}")
        return False
    with open(tmp_path, "wb") as f:
        f.write(r.content)
    return True

def get_audio_duration(path: str) -> float:
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=noprint_wrappers=1:nokey=1", path],
        capture_output=True, text=True
    )
    try:
        return float(result.stdout.strip())
    except ValueError:
        return 2.0

def make_silence(duration: float, path: str):
    subprocess.run([
        "ffmpeg", "-y", "-f", "lavfi",
        "-i", f"anullsrc=r=44100:cl=mono",
        "-t", str(duration),
        "-q:a", "2",
        path
    ], capture_output=True)

def concatenate(parts: list, output: str):
    list_file = output + ".txt"
    with open(list_file, "w") as f:
        for p in parts:
            f.write(f"file '{p}'\n")
    subprocess.run([
        "ffmpeg", "-y", "-f", "concat", "-safe", "0",
        "-i", list_file, "-c:a", "libmp3lame", "-q:a", "4", output
    ], capture_output=True)
    os.remove(list_file)

def generate_file(locale: str, industry: str, output_dir: str):
    lines = TRANSCRIPTS[locale][industry]
    name = f"emily-demo-{industry}-{locale}.mp3"
    out_path = os.path.join(output_dir, name)
    print(f"\n▶ {name}")

    with tempfile.TemporaryDirectory() as tmp:
        segments = []
        for i, line in enumerate(lines):
            voice = EMILY_VOICE if line["who"] == "emily" else GUEST_VOICE
            seg_path = os.path.join(tmp, f"seg_{i:02d}.mp3")
            print(f"  [{i+1}/{len(lines)}] {line['who']}: {line['text'][:50]}...")
            if not tts(line["text"], voice, seg_path, language_code=locale if locale == "en" else "pt"):
                print(f"  FAILED — aborting {name}")
                return

            segments.append(seg_path)

            # Add gap to next line based on timestamp diff
            if i < len(lines) - 1:
                t_now = ts_to_sec(line["t"])
                t_next = ts_to_sec(lines[i + 1]["t"])
                gap = t_next - t_now
                seg_dur = get_audio_duration(seg_path)
                silence_dur = max(0.1, gap - seg_dur)
                sil_path = os.path.join(tmp, f"sil_{i:02d}.mp3")
                make_silence(silence_dur, sil_path)
                segments.append(sil_path)

        concat_path = os.path.join(tmp, "concat.mp3")
        concatenate(segments, concat_path)

        # Copy to output
        import shutil
        shutil.copy(concat_path, out_path)
        print(f"  ✓ Saved → {out_path}")

def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, "..", "public", "audio")
    os.makedirs(output_dir, exist_ok=True)

    locales = ["en", "pt"]
    industries = ["restaurant", "clinic", "auto"]

    for locale in locales:
        for industry in industries:
            generate_file(locale, industry, output_dir)

    print("\n✅ All done!")

if __name__ == "__main__":
    main()
