#!/usr/bin/env python3
"""Seed about-en and about-pt pages in EmDash CMS."""

import json, random, string, urllib.request, urllib.error, subprocess

CMS_URL = "https://cms.callemily.eu"
TOKEN = "ec_pat_RvEKtcxubeU1_mZxWHfW_Y5cLMIqPVnrRCL0fFbHA18"
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
    "X-EmDash-Request": "1",
    "Origin": CMS_URL,
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
}

def key():
    return "".join(random.choices(string.hexdigits[:16], k=12))

def span(text, marks=None):
    return {"_type": "span", "_key": key(), "text": text, "marks": marks or []}

def block(*children, style="normal", mark_defs=None):
    return {"_type": "block", "_key": key(), "style": style,
            "children": list(children), "markDefs": mark_defs or []}

def p(*spans, mark_defs=None):
    return block(*spans, style="normal", mark_defs=mark_defs)

def h2(text):
    return block(span(text), style="h2")

def li(*spans):
    return block(*spans, style="normal")

def ul(*items):
    return [{"_type": "block", "_key": key(), "style": "normal",
             "listItem": "bullet", "level": 1,
             "children": list(item if isinstance(item, list) else [item]),
             "markDefs": []} for item in items]


def build_en():
    return [
        p(span("CallEmily is an AI voice assistant platform built for offline businesses — restaurants, clinics, car dealerships, and service chains across Europe.")),
        p(span("We believe every missed call is a missed opportunity. Our mission is simple: make sure your phones are always answered, your guests always heard, and your bookings never lost.")),

        h2("What we do"),
        p(span("Emily — our AI voice agent — answers inbound calls 24/7, takes bookings and appointments, captures lead data, and syncs with your CRM or POS. She speaks 12 languages, understands context, and handles complex multi-turn conversations without breaking a sweat.")),

        h2("Who we are"),
        p(span("We are a team of engineers, linguists, and hospitality veterans based in Lisbon, Portugal. CallEmily is operated by WiFly Europe Unipessoal Lda, a Portuguese technology company focused on voice AI and business automation.")),

        h2("Our values"),
        *ul(
            span("Privacy by design — all data stays in the EU, no third-party sharing"),
            span("Honesty first — Emily introduces herself as an AI assistant by default"),
            span("Real results — we measure success in bookings recovered, not in features shipped"),
            span("Fast to launch — most clients go live in 2–4 weeks"),
        ),

        h2("Contact us"),
        p(span("Have questions or want to explore a partnership? Reach us at "),
          span("hello@callemily.eu", ["strong"]),
          span(" or call "),
          span("+351 912 345 678", ["strong"]),
          span(".")),
    ]


def build_pt():
    return [
        p(span("A CallEmily é uma plataforma de assistente de voz IA criada para negócios presenciais — restaurantes, clínicas, concessionárias e cadeias de serviços em toda a Europa.")),
        p(span("Acreditamos que cada chamada perdida é uma oportunidade perdida. A nossa missão é simples: garantir que os seus telefones estão sempre atendidos, os seus clientes sempre ouvidos e as suas reservas nunca perdidas.")),

        h2("O que fazemos"),
        p(span("Emily — a nossa agente de voz IA — atende chamadas de entrada 24/7, aceita reservas e marcações, captura dados de leads e sincroniza com o seu CRM ou sistema de gestão. Fala 12 idiomas, compreende o contexto e gere conversas complexas sem dificuldade.")),

        h2("Quem somos"),
        p(span("Somos uma equipa de engenheiros, linguistas e veteranos da hotelaria com sede em Lisboa, Portugal. A CallEmily é operada pela WiFly Europe Unipessoal Lda, empresa tecnológica portuguesa focada em IA de voz e automação empresarial.")),

        h2("Os nossos valores"),
        *ul(
            span("Privacidade por design — todos os dados permanecem na UE, sem partilha com terceiros"),
            span("Honestidade em primeiro lugar — Emily apresenta-se como assistente IA por defeito"),
            span("Resultados reais — medimos o sucesso em reservas recuperadas, não em funcionalidades lançadas"),
            span("Rápido a arrancar — a maioria dos clientes entra em produção em 2–4 semanas"),
        ),

        h2("Contacte-nos"),
        p(span("Tem perguntas ou quer explorar uma parceria? Contacte-nos em "),
          span("hello@callemily.eu", ["strong"]),
          span(" ou ligue para "),
          span("+351 912 345 678", ["strong"]),
          span(".")),
    ]


def api(method, path, body=None):
    url = f"{CMS_URL}/_emdash/api{path}"
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=HEADERS, method=method)
    try:
        with urllib.request.urlopen(req) as r:
            return json.loads(r.read())
    except urllib.error.HTTPError as e:
        return {"error": {"code": e.code, "message": e.read().decode()}}


def delete_from_db(slugs):
    slugs_str = " ".join(f"'{s}'" for s in slugs)
    cmd = (
        f"docker exec cmscallemilyeu-emdash-1 node -e \""
        f"const db=require('/app/node_modules/.pnpm/better-sqlite3@12.8.0/node_modules/better-sqlite3')('/app/data/data.db');"
        f"const r=db.prepare('DELETE FROM ec_pages WHERE slug IN ({','.join(['?']*len(slugs))})')"
        f".run({','.join(repr(s) for s in slugs)});"
        f"console.log('deleted',r.changes);\""
    )
    try:
        result = subprocess.run(
            ["ssh", "-i", "~/.ssh/easyfin_do", "root@76.13.37.103", cmd],
            capture_output=True, text=True, timeout=15
        )
        return result.stdout.strip()
    except Exception as e:
        return f"ssh error: {e}"


def create_page(title, slug, content, locale):
    print(f"\n▶ {title} ({slug}):")

    # Check existing
    existing = api("GET", f"/content/pages?status=all")
    items = existing.get("data", {}).get("items", [])
    found = [p for p in items if p.get("slug") == slug]

    if found:
        print(f"  Deleting existing page {found[0]['id']} (slug={slug})")
        api("DELETE", f"/content/pages/{found[0]['id']}")
        # SQLite hard delete via server
        result = delete_from_db([slug])
        print(f"  DB delete: {result}")

    # Create draft
    resp = api("POST", "/content/pages", {
        "slug": slug,
        "locale": locale,
        "data": {"title": title, "content": content},
    })
    if "error" in resp:
        print(f"  ERROR {resp['error']['code']}: {resp['error']['message']}")
        return
    item_id = resp["data"]["item"]["id"]
    print(f"  Created draft {item_id}")

    # Publish
    pub = api("POST", f"/content/pages/{item_id}/publish", {})
    if "error" in pub:
        print(f"  Publish ERROR: {pub['error']}")
        return
    print(f"  ✓ {item_id} — status=published")


if __name__ == "__main__":
    print(f"Target: {CMS_URL}\n")
    create_page("About CallEmily", "about-en", build_en(), locale="en")
    create_page("Sobre o CallEmily", "about-pt", build_pt(), locale="pt")
    print("\n✅ Done.")
