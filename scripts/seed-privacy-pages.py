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

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
}


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
    cnpd_s, cnpd_d = link_span("www.cnpd.pt", "https://www.cnpd.pt")
    return [
        h2("1. Data Controller"),
        p(span("The data controller responsible for processing your personal data is:")),
        p(span("CallEmily (WiFly Europe Unipessoal Lda)", ["strong"])),
        p(span("Email for privacy inquiries: "), ls, mark_defs=[ld]),

        h2("2. Scope and Application"),
        p(span("This Privacy Policy applies to all personal data collected through the CallEmily platform, "
               "including the website callemily.eu, our AI voice assistant service, and any related services.")),
        p(span("CallEmily is committed to protecting the privacy of its users in accordance with the "),
          span("General Data Protection Regulation (GDPR — EU Regulation 2016/679)", ["strong"]),
          span(" and Portuguese Law No. 58/2019 of 8 August.")),

        h2("3. Personal Data We Collect"),
        h3("3.1. Data Provided by You"),
        li(span("Identification data: name, email address, company name (optional);")),
        li(span("Contact data: phone number;")),
        li(span("Billing data: information necessary for invoicing and payment processing (handled by our payment provider);")),
        li(span("Communication data: messages sent through our contact form or support channels.")),
        h3("3.2. Automatically Collected Data"),
        li(span("Browsing data: IP address (anonymised), browser type, operating system, pages visited on callemily.eu;")),
        li(span("Usage data: features used, session duration, interactions with the platform.")),
        p(span("We do not use cookies for tracking on our marketing website. The only cookie set is strictly necessary for language preference.")),
        h3("3.3. Voice Call Data (Collected on Behalf of Clients)"),
        p(span("When your business deploys the CallEmily voice assistant, we process call data on your behalf, including:")),
        li(span("Caller phone number (where permitted by local regulation);")),
        li(span("Voice recordings and transcripts (for the duration agreed in your service contract);")),
        li(span("Booking and reservation data provided by callers.")),
        p(span("This data is processed under a Data Processing Agreement (DPA) between CallEmily and the business client. "
               "Callers' data is never used for purposes beyond the agreed service scope.")),

        h2("4. Purpose and Legal Basis for Processing"),
        li(span("Account creation and service delivery", ["strong"]), span(" — Performance of contract (Art. 6(1)(b) GDPR);")),
        li(span("Voice assistant operation", ["strong"]), span(" — Performance of contract with business clients (Art. 6(1)(b));")),
        li(span("Billing and payment processing", ["strong"]), span(" — Performance of contract (Art. 6(1)(b));")),
        li(span("Service improvement and security", ["strong"]), span(" — Legitimate interest (Art. 6(1)(f));")),
        li(span("Legal compliance", ["strong"]), span(" — Legal obligation (Art. 6(1)(c));")),
        li(span("Marketing communications", ["strong"]), span(" — Consent (Art. 6(1)(a)) — only with explicit opt-in.")),

        h2("5. Data Sharing and Third Parties"),
        p(span("We share personal data only with the following categories of processors, all EU-based or operating under GDPR requirements:")),
        li(span("Payment processors: for subscription billing (no card data stored on our servers);")),
        li(span("Email service providers: for transactional emails;")),
        li(span("Telephony providers: for SIP trunk and voice routing (EU-based);")),
        li(span("Hosting providers: EU-based infrastructure only.")),
        p(span("We do "), span("not", ["strong"]), span(":")),
        li(span("Sell, rent, or trade personal data to any third party;")),
        li(span("Share data with advertising networks;")),
        li(span("Use US-based subprocessors for any personal data processing;")),
        li(span("Transfer any data outside the European Union.")),

        h2("6. Data Storage and Retention"),
        h3("6.1. Location"),
        p(span("All data is stored exclusively in "),
          span("European Union data centres", ["strong"]),
          span(". No data is transferred to, processed in, or accessible from jurisdictions outside the EU/EEA.")),
        h3("6.2. Retention Periods"),
        li(span("Contact and lead data: retained for up to 24 months after the last interaction;")),
        li(span("Billing data: retained for 10 years as required by Portuguese tax law;")),
        li(span("Voice recordings and transcripts: retained per client contract terms, then permanently and irreversibly deleted;")),
        li(span("Support communications: retained for 24 months after the last interaction.")),

        h2("7. Your Rights under GDPR"),
        p(span("You have the following rights regarding your personal data:")),
        li(span("Right of access", ["strong"]), span(" — obtain confirmation and access to your personal data;")),
        li(span("Right to rectification", ["strong"]), span(" — correct inaccurate or incomplete data;")),
        li(span("Right to erasure", ["strong"]), span(" — request deletion of data ('right to be forgotten');")),
        li(span("Right to restriction", ["strong"]), span(" — restrict processing under certain circumstances;")),
        li(span("Right to data portability", ["strong"]), span(" — receive data in a structured, machine-readable format;")),
        li(span("Right to object", ["strong"]), span(" — object to processing for direct marketing or legitimate interest purposes;")),
        li(span("Right to withdraw consent", ["strong"]), span(" — at any time, without affecting the lawfulness of prior processing.")),
        p(span("To exercise any of these rights, contact us at hello@callemily.eu. We will respond within a maximum of 30 days.")),

        h2("8. Cookie Policy"),
        h3("8.1. CallEmily Marketing Website (callemily.eu)"),
        p(span("Our marketing website uses "), span("no tracking cookies", ["strong"]), span(". We practise what we preach.")),
        p(span("The only cookie used is "), span("NEXT_LOCALE", ["code"]),
          span(", a strictly necessary functional cookie storing your preferred language. "
               "It contains no personal data and is exempt from consent requirements under Article 5(3) of the ePrivacy Directive.")),
        h2("9. Security Measures"),
        p(span("CallEmily implements appropriate technical and organisational measures to protect personal data:")),
        li(span("Encryption of data in transit (TLS 1.3) and at rest (AES-256);")),
        li(span("Secure authentication and role-based access controls;")),
        li(span("Client data isolation — each business client's call data is stored in a separate, isolated environment;")),
        li(span("Monitoring and intrusion detection;")),
        li(span("Regular backups and disaster recovery plan;")),
        li(span("EU-based infrastructure with GDPR-compliant Data Processing Agreements.")),

        h2("10. Data Breach Notification"),
        p(span("In the event of a personal data breach that may pose a risk to the rights and freedoms of data subjects, "
               "CallEmily will notify the Portuguese Data Protection Authority (CNPD) within 72 hours "
               "and, where necessary, inform affected data subjects without undue delay.")),

        h2("11. Children's Data"),
        p(span("The CallEmily platform is intended exclusively for business users aged 18 or older. "
               "We do not knowingly collect data from minors. If you become aware that a minor has provided personal data, "
               "please contact us so we can proceed with its deletion.")),

        h2("12. Changes to This Privacy Policy"),
        p(span("This policy may be updated periodically. Significant changes will be communicated through the platform "
               "or via email with a minimum of 30 days' notice. "
               "The date of the last update is indicated at the beginning of this document.")),

        h2("13. Right to Lodge a Complaint"),
        p(span("Without prejudice to any other administrative or judicial remedy, you have the right to lodge a complaint "
               "with the competent supervisory authority:")),
        p(span("Portuguese Data Protection Authority (CNPD)", ["strong"])),
        p(span("Rua de São Bento, n.º 148-3.º\n1200-821 Lisbon, Portugal\nPhone: +351 213 928 400\nWebsite: "),
          cnpd_s, mark_defs=[cnpd_d]),

        h2("14. Contact Information"),
        p(span("For any questions regarding the protection of your personal data, please contact us:")),
        p(span("Email: hello@callemily.eu\nWebsite: callemily.eu")),
    ]


def build_pt():
    ls, ld = link_span("hello@callemily.eu", "mailto:hello@callemily.eu")
    cnpd_s, cnpd_d = link_span("www.cnpd.pt", "https://www.cnpd.pt")
    return [
        h2("1. Responsável pelo Tratamento"),
        p(span("O responsável pelo tratamento dos seus dados pessoais é:")),
        p(span("CallEmily (WiFly Europe Unipessoal Lda)", ["strong"])),
        p(span("E-mail para questões de privacidade: "), ls, mark_defs=[ld]),

        h2("2. Âmbito e Aplicação"),
        p(span("A presente Política de Privacidade aplica-se a todos os dados pessoais recolhidos através da plataforma "
               "CallEmily, incluindo o sítio callemily.eu, o nosso serviço de assistente de voz por IA e quaisquer serviços relacionados.")),
        p(span("A CallEmily compromete-se a proteger a privacidade dos seus utilizadores em conformidade com o "),
          span("Regulamento Geral sobre a Proteção de Dados (RGPD — Regulamento UE 2016/679)", ["strong"]),
          span(" e a Lei n.º 58/2019, de 8 de agosto.")),

        h2("3. Dados Pessoais Recolhidos"),
        h3("3.1. Dados Fornecidos por Si"),
        li(span("Dados de identificação: nome, endereço de e-mail, nome da empresa (opcional);")),
        li(span("Dados de contacto: número de telefone;")),
        li(span("Dados de faturação: informações necessárias para faturação e processamento de pagamentos (geridos pelo nosso fornecedor de pagamentos);")),
        li(span("Dados de comunicação: mensagens enviadas através do nosso formulário de contacto ou canais de suporte.")),
        h3("3.2. Dados Recolhidos Automaticamente"),
        li(span("Dados de navegação: endereço IP (anonimizado), tipo de navegador, sistema operativo, páginas visitadas em callemily.eu;")),
        li(span("Dados de utilização: funcionalidades usadas, duração da sessão, interações com a plataforma.")),
        p(span("Não utilizamos cookies de rastreio no nosso sítio de marketing. O único cookie definido é estritamente necessário para a preferência de idioma.")),
        h3("3.3. Dados de Chamadas de Voz (Tratados em Nome dos Clientes)"),
        p(span("Quando a sua empresa implementa o assistente de voz CallEmily, tratamos dados de chamadas em seu nome, incluindo:")),
        li(span("Número de telefone do chamador (quando permitido pela regulamentação local);")),
        li(span("Gravações de voz e transcrições (pelo período acordado no contrato de serviço);")),
        li(span("Dados de reservas e marcações fornecidos pelos chamadores.")),
        p(span("Estes dados são tratados ao abrigo de um Acordo de Tratamento de Dados (DPA) entre a CallEmily e o cliente empresarial. "
               "Os dados dos chamadores nunca são utilizados para fins além do âmbito acordado do serviço.")),

        h2("4. Finalidade e Base Legal para o Tratamento"),
        li(span("Criação de conta e prestação do serviço", ["strong"]), span(" — Execução de contrato (Art. 6.º, n.º 1, al. b) do RGPD);")),
        li(span("Operação do assistente de voz", ["strong"]), span(" — Execução de contrato com clientes empresariais (al. b));")),
        li(span("Faturação e processamento de pagamentos", ["strong"]), span(" — Execução de contrato (al. b));")),
        li(span("Melhoria do serviço e segurança", ["strong"]), span(" — Interesses legítimos (al. f));")),
        li(span("Cumprimento legal", ["strong"]), span(" — Obrigação legal (al. c));")),
        li(span("Comunicações de marketing", ["strong"]), span(" — Consentimento (al. a)) — apenas com opt-in explícito.")),

        h2("5. Partilha de Dados e Terceiros"),
        p(span("Partilhamos dados pessoais apenas com as seguintes categorias de subcontratantes, todos baseados na UE ou a operar sob os requisitos do RGPD:")),
        li(span("Processadores de pagamentos: para faturação de subscrições (sem dados de cartão nos nossos servidores);")),
        li(span("Fornecedores de serviços de e-mail: para e-mails transacionais;")),
        li(span("Fornecedores de telefonia: para encaminhamento de voz por SIP (baseados na UE);")),
        li(span("Fornecedores de alojamento: exclusivamente infraestrutura baseada na UE.")),
        p(span("Não", ["strong"]), span(" fazemos:")),
        li(span("Vender, alugar ou ceder dados pessoais a terceiros;")),
        li(span("Partilhar dados com redes de publicidade;")),
        li(span("Utilizar subcontratantes fora da UE para qualquer tratamento de dados pessoais;")),
        li(span("Transferir quaisquer dados para fora da União Europeia.")),

        h2("6. Armazenamento e Conservação de Dados"),
        h3("6.1. Localização"),
        p(span("Todos os dados são armazenados exclusivamente em "),
          span("centros de dados da União Europeia", ["strong"]),
          span(". Nenhum dado é transferido para, tratado em, ou acessível a partir de jurisdições fora da UE/EEE.")),
        h3("6.2. Prazos de Conservação"),
        li(span("Dados de contacto e leads: conservados até 24 meses após a última interação;")),
        li(span("Dados de faturação: conservados durante 10 anos conforme exigido pela lei fiscal portuguesa;")),
        li(span("Gravações de voz e transcrições: conservadas conforme os termos do contrato com o cliente, depois eliminadas permanente e irreversivelmente;")),
        li(span("Comunicações de suporte: conservadas durante 24 meses após a última interação.")),

        h2("7. Os Seus Direitos ao Abrigo do RGPD"),
        p(span("Tem os seguintes direitos relativamente aos seus dados pessoais:")),
        li(span("Direito de acesso", ["strong"]), span(" — obter confirmação e acesso aos seus dados pessoais;")),
        li(span("Direito de retificação", ["strong"]), span(" — corrigir dados inexatos ou incompletos;")),
        li(span("Direito ao apagamento", ["strong"]), span(" — solicitar a eliminação dos dados ('direito a ser esquecido');")),
        li(span("Direito à limitação do tratamento", ["strong"]), span(" — restringir o tratamento em determinadas circunstâncias;")),
        li(span("Direito à portabilidade dos dados", ["strong"]), span(" — receber os dados num formato estruturado e legível por máquina;")),
        li(span("Direito de oposição", ["strong"]), span(" — opor-se ao tratamento para fins de marketing direto ou interesse legítimo;")),
        li(span("Direito de retirar o consentimento", ["strong"]), span(" — a qualquer momento, sem afetar a licitude do tratamento anterior.")),
        p(span("Para exercer qualquer destes direitos, contacte-nos em hello@callemily.eu. Responderemos no prazo máximo de 30 dias.")),

        h2("8. Política de Cookies"),
        h3("8.1. Sítio de Marketing CallEmily (callemily.eu)"),
        p(span("O nosso sítio de marketing "), span("não utiliza cookies de rastreio", ["strong"]), span(". Praticamos o que pregamos.")),
        p(span("O único cookie utilizado é "), span("NEXT_LOCALE", ["code"]),
          span(", um cookie funcional estritamente necessário que armazena a sua preferência de idioma. "
               "Não contém dados pessoais e está isento de requisitos de consentimento ao abrigo do Artigo 5.º, n.º 3 da Diretiva ePrivacy.")),
        h2("9. Medidas de Segurança"),
        p(span("A CallEmily implementa medidas técnicas e organizacionais adequadas para proteger os dados pessoais:")),
        li(span("Encriptação dos dados em trânsito (TLS 1.3) e em repouso (AES-256);")),
        li(span("Autenticação segura e controlo de acessos baseado em funções;")),
        li(span("Isolamento dos dados dos clientes — os dados de chamadas de cada cliente empresarial são armazenados num ambiente separado e isolado;")),
        li(span("Monitorização e deteção de intrusões;")),
        li(span("Cópias de segurança regulares e plano de recuperação após desastre;")),
        li(span("Infraestrutura baseada na UE com Acordos de Tratamento de Dados conformes com o RGPD.")),

        h2("10. Notificação de Violações de Dados"),
        p(span("Em caso de violação de dados pessoais que possa representar um risco para os direitos e liberdades dos titulares, "
               "a CallEmily notificará a Autoridade de Proteção de Dados (CNPD) no prazo de 72 horas "
               "e, quando necessário, informará os titulares afetados sem demora injustificada.")),

        h2("11. Dados de Menores"),
        p(span("A plataforma CallEmily destina-se exclusivamente a utilizadores empresariais com 18 anos ou mais. "
               "Não recolhemos intencionalmente dados de menores. Se tiver conhecimento de que um menor forneceu dados pessoais, "
               "contacte-nos para procedermos à sua eliminação.")),

        h2("12. Alterações a Esta Política de Privacidade"),
        p(span("Esta política pode ser atualizada periodicamente. As alterações significativas serão comunicadas através da plataforma "
               "ou por e-mail com um mínimo de 30 dias de antecedência. "
               "A data da última atualização é indicada no início deste documento.")),

        h2("13. Direito de Reclamação"),
        p(span("Sem prejuízo de qualquer outro recurso administrativo ou judicial, tem o direito de apresentar reclamação "
               "junto da autoridade de supervisão competente:")),
        p(span("Comissão Nacional de Proteção de Dados (CNPD)", ["strong"])),
        p(span("Rua de São Bento, n.º 148-3.º\n1200-821 Lisboa, Portugal\nTelefone: +351 213 928 400\nSítio: "),
          cnpd_s, mark_defs=[cnpd_d]),

        h2("14. Informações de Contacto"),
        p(span("Para qualquer questão sobre a proteção dos seus dados pessoais, contacte-nos:")),
        p(span("E-mail: hello@callemily.eu\nSítio: callemily.eu")),
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
        print(f"  Deleting existing page {pid} (slug={slug})")
        requests.delete(f"{BASE_URL}/_emdash/api/content/pages/{pid}", headers=HEADERS, timeout=15)
    if True:
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
