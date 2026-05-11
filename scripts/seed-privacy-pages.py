#!/usr/bin/env python3
"""
Seed privacy-en and privacy-pt pages into EmDash CMS for callemily.eu
Usage: python3 seed-privacy-pages.py
Requires: EMDASH_URL and EMDASH_API_TOKEN env vars (or reads from .env.local)
"""

import os, sys, json, re, uuid, requests

# ── Load env vars ──────────────────────────────────────────────────────────────
def load_env():
    env_file = os.path.join(os.path.dirname(__file__), "..", ".env.local")
    if os.path.exists(env_file):
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    k, _, v = line.partition("=")
                    os.environ.setdefault(k.strip(), v.strip())

load_env()

BASE_URL = os.environ.get("EMDASH_URL", "https://cms.callemily.eu")
TOKEN    = os.environ.get("EMDASH_API_TOKEN", "")

if not TOKEN:
    print("ERROR: EMDASH_API_TOKEN not set"); sys.exit(1)

HEADERS = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}


# ── portableText helpers ───────────────────────────────────────────────────────
def key():
    return uuid.uuid4().hex[:12]

def span(text, marks=None):
    return {"_type": "span", "_key": key(), "text": text, "marks": marks or []}

def block(style, children, mark_defs=None, list_item=None, level=None):
    b = {"_type": "block", "_key": key(), "style": style,
         "children": children, "markDefs": mark_defs or []}
    if list_item: b["listItem"] = list_item
    if level:     b["level"] = level
    return b

def h2(text):   return block("h2", [span(text)])
def h3(text):   return block("h3", [span(text)])
def p(*spans, mark_defs=None):  return block("normal", list(spans), mark_defs=mark_defs)
def li(*spans): return block("normal", list(spans), list_item="bullet", level=1)

def link_span(text, href):
    lkey = key()
    return (
        {"_type": "span", "_key": key(), "text": text, "marks": [lkey]},
        {"_key": lkey, "_type": "link", "href": href}
    )


# ── Content ────────────────────────────────────────────────────────────────────
def build_en():
    ls, ld = link_span("hello@callemily.eu", "mailto:hello@callemily.eu")
    return [
        h2("1. Data Controller"),
        p(span("The data controller responsible for processing your personal data is:")),
        p(span("CallEmily", ["strong"]), span("\nEmail: "), ls, mark_defs=[ld]),

        h2("2. Scope and Application"),
        p(span("This Privacy Policy applies to all personal data collected through the CallEmily platform, "
               "including callemily.eu, our AI voice assistant service, and related services.")),
        p(span("CallEmily is committed to protecting your privacy in accordance with the "),
          span("General Data Protection Regulation (GDPR — EU Regulation 2016/679)", ["strong"]), span(".")),

        h2("3. Personal Data We Collect"),
        h3("3.1. Data Provided by You"),
        li(span("Identification data: name, email address, company name (optional);")),
        li(span("Contact data: phone number;")),
        li(span("Communication data: messages sent through our contact form or support channels.")),
        h3("3.2. Automatically Collected Data"),
        li(span("Browsing data: IP address (anonymised), browser type, operating system, pages visited;")),
        li(span("Usage data: features used, session duration, interactions with the platform.")),
        p(span("We use only strictly necessary cookies. No tracking or advertising cookies are set.")),

        h2("4. Legal Basis for Processing"),
        li(span("Consent (Art. 6(1)(a) GDPR)"), span(" — for marketing communications;")),
        li(span("Contract performance (Art. 6(1)(b))"), span(" — when you sign up or request a demo;")),
        li(span("Legitimate interests (Art. 6(1)(f))"), span(" — to improve our service and ensure security;")),
        li(span("Legal obligation (Art. 6(1)(c))"), span(" — for tax and accounting records.")),

        h2("5. Data Sharing and Third Parties"),
        p(span("We share personal data only when strictly necessary:")),
        li(span("Email service providers: for transactional emails;")),
        li(span("Hosting providers: EU-based infrastructure only.")),
        p(span("We do "), span("not", ["strong"]),
          span(" sell, rent or transfer your personal data. We do not use processors based outside the EU.")),

        h2("6. Data Storage and Retention"),
        h3("6.1. Location"),
        p(span("All data is stored exclusively in "),
          span("EU data centres", ["strong"]),
          span(". No data is transferred outside the EU/EEA.")),
        h3("6.2. Retention Periods"),
        li(span("Contact and lead data: retained for up to 24 months after last interaction;")),
        li(span("Billing data: retained for 10 years as required by applicable tax law;")),
        li(span("Call recordings (where applicable): retained per client contract, then permanently deleted.")),

        h2("7. Your Rights under GDPR"),
        p(span("You have the following rights regarding your personal data:")),
        li(span("Right of access", ["strong"]), span(" — obtain confirmation and access your data;")),
        li(span("Right to rectification", ["strong"]), span(" — correct inaccurate or incomplete data;")),
        li(span("Right to erasure", ["strong"]), span(" — request deletion ('right to be forgotten');")),
        li(span("Right to restriction", ["strong"]), span(" — limit processing in certain circumstances;")),
        li(span("Right to data portability", ["strong"]), span(" — receive data in a structured, machine-readable format;")),
        li(span("Right to object", ["strong"]), span(" — object to processing for direct marketing or legitimate interest;")),
        li(span("Right to withdraw consent", ["strong"]), span(" — at any time, without affecting prior processing.")),
        p(span("To exercise any of these rights, contact us at ")),

        h2("8. Cookie Policy"),
        h3("8.1. Marketing Site (callemily.eu)"),
        p(span("Our marketing site uses "), span("no tracking cookies", ["strong"]),
          span(". The only cookie set is a strictly necessary functional cookie storing your language preference "
               "(NEXT_LOCALE). It contains no personal data and is exempt from consent requirements under Art. 5(3) ePrivacy Directive.")),
        h3("8.2. Cookie Consent Banner"),
        p(span("You may dismiss the cookie banner at any time. "
               "Your preference is stored locally and we will not set non-essential cookies without your consent.")),

        h2("9. Security Measures"),
        p(span("CallEmily implements appropriate technical and organisational measures to protect personal data:")),
        li(span("Encryption of data in transit (TLS 1.3) and at rest;")),
        li(span("Secure authentication and access controls;")),
        li(span("Regular backups and recovery plan;")),
        li(span("EU-based infrastructure with GDPR-compliant data processing agreements.")),

        h2("10. Data Breach Notification"),
        p(span("In the event of a personal data breach that poses a risk to data subjects, CallEmily will notify "
               "the competent supervisory authority within 72 hours and, where necessary, inform the affected individuals without undue delay.")),

        h2("11. Data of Minors"),
        p(span("The CallEmily platform is intended exclusively for business users aged 18 or older. "
               "We do not knowingly collect data from minors.")),

        h2("12. Changes to This Policy"),
        p(span("We may update this Privacy Policy periodically. Significant changes will be communicated via the website "
               "or email with at least 30 days' notice.")),
        p(span("The most recent version is always available at callemily.eu/en/privacy.")),

        h2("13. Contact and Supervisory Authority"),
        p(span("For privacy inquiries: hello@callemily.eu")),
        p(span("You have the right to lodge a complaint with the competent supervisory authority. For users in Portugal: "
               "Comissão Nacional de Proteção de Dados (CNPD), www.cnpd.pt, +351 21 392 84 00.")),
    ]


def build_pt():
    ls, ld = link_span("hello@callemily.eu", "mailto:hello@callemily.eu")
    return [
        h2("1. Responsável pelo Tratamento"),
        p(span("O responsável pelo tratamento dos seus dados pessoais é:")),
        p(span("CallEmily", ["strong"]), span("\nEmail: "), ls, mark_defs=[ld]),

        h2("2. Âmbito e Aplicação"),
        p(span("A presente Política de Privacidade aplica-se a todos os dados pessoais recolhidos através da plataforma "
               "CallEmily, incluindo o sítio callemily.eu, o nosso serviço de assistente de voz por IA e serviços relacionados.")),
        p(span("A CallEmily compromete-se a proteger a privacidade dos seus utilizadores em conformidade com o "),
          span("Regulamento Geral sobre a Proteção de Dados (RGPD — Regulamento UE 2016/679)", ["strong"]), span(".")),

        h2("3. Dados Pessoais Recolhidos"),
        h3("3.1. Dados Fornecidos por Si"),
        li(span("Dados de identificação: nome, endereço de e-mail, nome da empresa (opcional);")),
        li(span("Dados de contacto: número de telefone;")),
        li(span("Dados de comunicação: mensagens enviadas através do nosso formulário de contacto ou canais de suporte.")),
        h3("3.2. Dados Recolhidos Automaticamente"),
        li(span("Dados de navegação: endereço IP (anonimizado), tipo de navegador, sistema operativo, páginas visitadas;")),
        li(span("Dados de utilização: funcionalidades usadas, duração da sessão, interações com a plataforma.")),
        p(span("Utilizamos apenas cookies estritamente necessários. Não são definidos cookies de rastreio ou publicidade.")),

        h2("4. Base Legal para o Tratamento"),
        li(span("Consentimento (Art. 6.º, n.º 1, al. a) do RGPD)"), span(" — para comunicações de marketing;")),
        li(span("Execução de contrato (al. b))"), span(" — quando se regista ou solicita uma demonstração;")),
        li(span("Interesses legítimos (al. f))"), span(" — para melhorar o serviço e garantir a segurança;")),
        li(span("Obrigação legal (al. c))"), span(" — para registos fiscais e contabilísticos.")),

        h2("5. Partilha de Dados e Terceiros"),
        p(span("Partilhamos dados pessoais apenas quando estritamente necessário:")),
        li(span("Fornecedores de serviços de e-mail: para e-mails transacionais;")),
        li(span("Fornecedores de alojamento: exclusivamente infraestrutura baseada na UE.")),
        p(span("Não"), span(" ", ["strong"]),
          span("vendemos, alugamos nem cedemos os seus dados pessoais. Não utilizamos processadores sediados fora da UE.")),

        h2("6. Armazenamento e Conservação de Dados"),
        h3("6.1. Localização"),
        p(span("Todos os dados são armazenados exclusivamente em "),
          span("centros de dados na União Europeia", ["strong"]),
          span(". Nenhum dado é transferido para fora da UE/EEE.")),
        h3("6.2. Prazos de Conservação"),
        li(span("Dados de contacto e leads: conservados até 24 meses após a última interação;")),
        li(span("Dados de faturação: conservados durante 10 anos conforme exigido pela legislação fiscal aplicável;")),
        li(span("Gravações de chamadas (quando aplicável): conservadas conforme contrato com o cliente, depois eliminadas permanentemente.")),

        h2("7. Os Seus Direitos ao Abrigo do RGPD"),
        p(span("Tem os seguintes direitos relativamente aos seus dados pessoais:")),
        li(span("Direito de acesso", ["strong"]), span(" — obter confirmação e acesso aos seus dados;")),
        li(span("Direito de retificação", ["strong"]), span(" — corrigir dados inexatos ou incompletos;")),
        li(span("Direito ao apagamento", ["strong"]), span(" — solicitar a eliminação dos dados ('direito a ser esquecido');")),
        li(span("Direito à limitação do tratamento", ["strong"]), span(" — limitar o tratamento em determinadas circunstâncias;")),
        li(span("Direito à portabilidade dos dados", ["strong"]), span(" — receber os dados num formato estruturado e legível por máquina;")),
        li(span("Direito de oposição", ["strong"]), span(" — opor-se ao tratamento para fins de marketing direto ou interesse legítimo;")),
        li(span("Direito de retirar o consentimento", ["strong"]), span(" — a qualquer momento, sem afetar o tratamento anterior.")),
        p(span("Para exercer qualquer destes direitos, contacte-nos em hello@callemily.eu. Responderemos no prazo de 30 dias.")),

        h2("8. Política de Cookies"),
        h3("8.1. Sítio de Marketing (callemily.eu)"),
        p(span("O nosso sítio de marketing "), span("não utiliza cookies de rastreio", ["strong"]),
          span(". O único cookie definido é um cookie funcional estritamente necessário que armazena a sua preferência "
               "de idioma (NEXT_LOCALE). Está isento de requisitos de consentimento ao abrigo do Art. 5.º, n.º 3 da Diretiva ePrivacy.")),
        h3("8.2. Banner de Consentimento de Cookies"),
        p(span("Pode dispensar o banner de cookies a qualquer momento. A sua preferência é armazenada localmente "
               "e não definiremos cookies não essenciais sem o seu consentimento.")),

        h2("9. Medidas de Segurança"),
        p(span("A CallEmily implementa medidas técnicas e organizacionais adequadas para proteger os dados pessoais:")),
        li(span("Encriptação dos dados em trânsito (TLS 1.3) e em repouso;")),
        li(span("Autenticação segura e controlo de acessos;")),
        li(span("Cópias de segurança regulares e plano de recuperação;")),
        li(span("Infraestrutura baseada na UE com acordos de tratamento de dados conformes com o RGPD.")),

        h2("10. Notificação de Violações de Dados"),
        p(span("Em caso de violação de dados pessoais que represente um risco para os titulares, a CallEmily notificará "
               "a autoridade de supervisão competente no prazo de 72 horas e, quando necessário, informará os indivíduos afetados sem demora injustificada.")),

        h2("11. Dados de Menores"),
        p(span("A plataforma CallEmily destina-se exclusivamente a utilizadores empresariais com 18 anos ou mais. "
               "Não recolhemos intencionalmente dados de menores.")),

        h2("12. Alterações a Esta Política"),
        p(span("Podemos atualizar esta Política de Privacidade periodicamente. As alterações significativas serão comunicadas "
               "via sítio ou e-mail com pelo menos 30 dias de antecedência.")),
        p(span("A versão mais recente está sempre disponível em callemily.eu/pt/privacy.")),

        h2("13. Contacto e Autoridade de Supervisão"),
        p(span("Para questões de privacidade: hello@callemily.eu")),
        p(span("Tem o direito de apresentar reclamação junto da autoridade de supervisão competente. Para utilizadores em Portugal: "
               "Comissão Nacional de Proteção de Dados (CNPD), www.cnpd.pt, +351 21 392 84 00.")),
    ]


# ── API helpers ────────────────────────────────────────────────────────────────
def filter_mark_defs(blocks):
    """Collect markDefs at block level (they're already embedded by block())."""
    return blocks

def create_page(title, slug, blocks, locale="en"):
    payload = {"slug": slug, "locale": locale, "data": {"title": title, "content": blocks}}

    # Check if page already exists
    r = requests.get(f"{BASE_URL}/_emdash/api/content/pages?limit=100", headers=HEADERS, timeout=15)
    existing = r.json().get("data", {}).get("items", []) if r.ok else []
    found = next((p for p in existing if p.get("slug") == slug), None)

    if found:
        pid = found["id"]
        print(f"  Updating existing page {pid} (slug={slug})")
        r = requests.patch(f"{BASE_URL}/_emdash/api/content/pages/{pid}",
                           headers=HEADERS, json=payload, timeout=15)
        if not r.ok:
            print(f"  ERROR {r.status_code}: {r.text[:300]}"); return False
        pid = r.json()["data"]["item"]["id"]
    else:
        print(f"  Creating new page (slug={slug})")
        r = requests.post(f"{BASE_URL}/_emdash/api/content/pages",
                          headers=HEADERS, json=payload, timeout=15)
        if not r.ok:
            print(f"  ERROR {r.status_code}: {r.text[:300]}"); return False
        pid = r.json()["data"]["item"]["id"]

    # Publish
    r = requests.post(f"{BASE_URL}/_emdash/api/content/pages/{pid}/publish",
                      headers=HEADERS, json={}, timeout=15)
    if not r.ok:
        print(f"  Publish ERROR {r.status_code}: {r.text[:200]}"); return False

    item = r.json()["data"]["item"]
    print(f"  ✓ {item['id']} — status={item['status']}")
    return True


def main():
    print(f"Target: {BASE_URL}")
    print("\n▶ Privacy (EN):")
    create_page("Privacy Policy", "privacy-en", build_en(), locale="en")

    print("\n▶ Privacy (PT):")
    create_page("Política de Privacidade", "privacy-pt", build_pt(), locale="pt")

    print("\n✅ Done. Visit https://cms.callemily.eu/_emdash/admin to verify.")


if __name__ == "__main__":
    main()
