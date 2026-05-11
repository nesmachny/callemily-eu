import type { Metadata } from "next"
import SiteHeader from "@/components/header-server"
import SiteFooter from "@/components/footer"
import { cms } from "@/lib/emdash"

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://callemily.eu"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const url = `${siteUrl}/${locale}/privacy`
  const isPt = locale === "pt"
  return {
    title: isPt ? "Política de Privacidade | CallEmily" : "Privacy Policy | CallEmily",
    description: isPt
      ? "Política de privacidade do CallEmily — como recolhemos, armazenamos e protegemos os seus dados pessoais em callemily.eu."
      : "CallEmily privacy policy — how we collect, store and protect your personal data at callemily.eu.",
    alternates: {
      canonical: url,
      languages: {
        en: `${siteUrl}/en/privacy`,
        pt: `${siteUrl}/pt/privacy`,
        "x-default": `${siteUrl}/en/privacy`,
      },
    },
    openGraph: {
      title: isPt ? "Política de Privacidade | CallEmily" : "Privacy Policy | CallEmily",
      url,
      type: "website",
    },
  }
}

async function getCmsPrivacy(locale: string): Promise<string | null> {
  if (!cms) return null
  try {
    const slug = locale === "pt" ? "privacy-pt" : "privacy-en"
    const result = await cms.list("pages", { status: "published" })
    const page = result.items?.find(
      (p: { slug: string | null }) => p.slug === slug || p.slug === "privacy"
    )
    if (!page) return null
    const blocks = (page.data?.content ?? []) as { _type?: string; children?: { text?: string }[] }[]
    return blocks.map(b => b.children?.map(c => c.text).join("") ?? "").join("\n\n") || null
  } catch {
    return null
  }
}

const CONTENT = {
  en: {
    title: "Privacy Policy",
    updated: "Last updated: May 2026",
    html: `
<h2>1. Data Controller</h2>
<p>The data controller responsible for processing your personal data is:</p>
<p><strong>CallEmily</strong><br/>
Email for privacy inquiries: <a href="mailto:hello@callemily.eu">hello@callemily.eu</a></p>

<h2>2. Scope and Application</h2>
<p>This Privacy Policy applies to all personal data collected through the CallEmily platform, including the website callemily.eu, our AI voice assistant service, and any related services.</p>
<p>CallEmily is committed to protecting the privacy of its users in accordance with the <strong>General Data Protection Regulation (GDPR — EU Regulation 2016/679)</strong>.</p>

<h2>3. Personal Data We Collect</h2>
<h3>3.1. Data Provided by You</h3>
<ul>
  <li>Identification data: name, email address, company name (optional);</li>
  <li>Contact data: phone number;</li>
  <li>Communication data: messages sent through our contact form or support channels.</li>
</ul>
<h3>3.2. Automatically Collected Data</h3>
<ul>
  <li>Browsing data: IP address (anonymized), browser type, operating system, pages visited;</li>
  <li>Usage data: features used, session duration, interactions with the platform.</li>
</ul>
<p>We use only strictly necessary cookies. No tracking or advertising cookies are set.</p>

<h2>4. Purpose and Legal Basis for Processing</h2>
<table>
  <thead><tr><th>Purpose</th><th>Legal Basis (GDPR)</th></tr></thead>
  <tbody>
    <tr><td>Responding to enquiries and demo requests</td><td>Performance of contract / Legitimate interest (Art. 6(1)(b)(f))</td></tr>
    <tr><td>Providing the AI voice assistant service</td><td>Performance of contract (Art. 6(1)(b))</td></tr>
    <tr><td>Service improvement and security</td><td>Legitimate interest (Art. 6(1)(f))</td></tr>
    <tr><td>Legal compliance</td><td>Legal obligation (Art. 6(1)(c))</td></tr>
    <tr><td>Marketing communications</td><td>Consent (Art. 6(1)(a)) — only with explicit opt-in</td></tr>
  </tbody>
</table>

<h2>5. Data Sharing and Third Parties</h2>
<p>We share personal data only where strictly necessary:</p>
<ul>
  <li>Email service providers: for transactional emails;</li>
  <li>Hosting providers: EU-based infrastructure only.</li>
</ul>
<p>We do <strong>not</strong> sell, rent, or trade your personal data. We do not use US-based processors for any personal data.</p>

<h2>6. Data Storage and Retention</h2>
<h3>6.1. Location</h3>
<p>All data is stored exclusively in <strong>European Union data centres</strong>. No data is transferred outside the EU/EEA.</p>
<h3>6.2. Retention Periods</h3>
<ul>
  <li>Contact and lead data: retained for up to 24 months after last interaction;</li>
  <li>Billing data: retained for 10 years as required by applicable tax law;</li>
  <li>Call recordings (where applicable): retained per customer contract, then permanently deleted.</li>
</ul>

<h2>7. Your Rights Under GDPR</h2>
<p>You have the following rights regarding your personal data:</p>
<ul>
  <li><strong>Right of access</strong> — obtain confirmation and access to your data;</li>
  <li><strong>Right to rectification</strong> — correct inaccurate or incomplete data;</li>
  <li><strong>Right to erasure</strong> — request deletion ("right to be forgotten");</li>
  <li><strong>Right to restriction</strong> — restrict processing under certain circumstances;</li>
  <li><strong>Right to data portability</strong> — receive data in a structured, machine-readable format;</li>
  <li><strong>Right to object</strong> — object to processing for direct marketing or legitimate interest purposes;</li>
  <li><strong>Right to withdraw consent</strong> — at any time, without affecting prior processing.</li>
</ul>
<p>To exercise any of these rights, contact us at <a href="mailto:hello@callemily.eu">hello@callemily.eu</a>. We will respond within 30 days.</p>

<h2>8. Cookie Policy</h2>
<h3>8.1. Marketing Website (callemily.eu)</h3>
<p>Our marketing website uses <strong>no tracking cookies</strong>. The only cookie set is a strictly necessary functional cookie that stores your language preference (<code>NEXT_LOCALE</code>). It contains no personal data and is exempt from consent requirements under Article 5(3) of the ePrivacy Directive.</p>
<h3>8.2. Cookie Consent Banner</h3>
<p>You may dismiss the cookie banner at any time. Your preference is stored locally and we will not set any non-essential cookies without your consent.</p>

<h2>9. Security Measures</h2>
<p>CallEmily implements appropriate technical and organizational measures to protect personal data:</p>
<ul>
  <li>Encryption of data in transit (TLS 1.3) and at rest;</li>
  <li>Secure authentication and access control;</li>
  <li>Regular backups and disaster recovery;</li>
  <li>EU-based infrastructure with GDPR-compliant data processing agreements.</li>
</ul>

<h2>10. Data Breach Notification</h2>
<p>In the event of a personal data breach posing a risk to data subjects, CallEmily will notify the relevant supervisory authority within 72 hours and, where required, inform affected individuals without undue delay.</p>

<h2>11. Children's Data</h2>
<p>The CallEmily platform is intended exclusively for business users aged 18 or older. We do not knowingly collect data from minors.</p>

<h2>12. Changes to This Policy</h2>
<p>This policy may be updated periodically. Significant changes will be communicated via the website or email with at least 30 days' notice.</p>

<h2>13. Supervisory Authority</h2>
<p>You have the right to lodge a complaint with the competent supervisory authority. For users in Portugal:</p>
<p><strong>Comissão Nacional de Proteção de Dados (CNPD)</strong><br/>
Rua de São Bento, n.º 148-3.º, 1200-821 Lisbon<br/>
<a href="https://www.cnpd.pt" target="_blank" rel="noopener">www.cnpd.pt</a></p>

<h2>14. Contact</h2>
<p>For any questions about this policy or your personal data:<br/>
Email: <a href="mailto:hello@callemily.eu">hello@callemily.eu</a><br/>
Website: <a href="https://callemily.eu">callemily.eu</a></p>
    `.trim(),
  },
  pt: {
    title: "Política de Privacidade",
    updated: "Última atualização: maio de 2026",
    html: `
<h2>1. Responsável pelo Tratamento</h2>
<p>O responsável pelo tratamento dos seus dados pessoais é:</p>
<p><strong>CallEmily</strong><br/>
Email para questões de privacidade: <a href="mailto:hello@callemily.eu">hello@callemily.eu</a></p>

<h2>2. Âmbito e Aplicação</h2>
<p>Esta Política de Privacidade aplica-se a todos os dados pessoais recolhidos através da plataforma CallEmily, incluindo o sítio callemily.eu, o nosso serviço de assistente de voz com IA e quaisquer serviços relacionados.</p>
<p>A CallEmily está comprometida com a proteção da privacidade dos seus utilizadores em conformidade com o <strong>Regulamento Geral sobre a Proteção de Dados (RGPD — Regulamento UE 2016/679)</strong>.</p>

<h2>3. Dados Pessoais que Recolhemos</h2>
<h3>3.1. Dados Fornecidos por Si</h3>
<ul>
  <li>Dados de identificação: nome, endereço de email, nome da empresa (opcional);</li>
  <li>Dados de contacto: número de telefone;</li>
  <li>Dados de comunicação: mensagens enviadas através do nosso formulário de contacto ou canais de apoio.</li>
</ul>
<h3>3.2. Dados Recolhidos Automaticamente</h3>
<ul>
  <li>Dados de navegação: endereço IP (anonimizado), tipo de browser, sistema operativo, páginas visitadas;</li>
  <li>Dados de utilização: funcionalidades utilizadas, duração da sessão, interações com a plataforma.</li>
</ul>
<p>Utilizamos apenas cookies estritamente necessários. Não são utilizados cookies de rastreio ou publicidade.</p>

<h2>4. Finalidade e Base Jurídica do Tratamento</h2>
<table>
  <thead><tr><th>Finalidade</th><th>Base Jurídica (RGPD)</th></tr></thead>
  <tbody>
    <tr><td>Resposta a pedidos de informação e demonstrações</td><td>Execução de contrato / Interesse legítimo (Art. 6.º, n.º 1, als. b) e f))</td></tr>
    <tr><td>Prestação do serviço de assistente de voz com IA</td><td>Execução de contrato (Art. 6.º, n.º 1, al. b))</td></tr>
    <tr><td>Melhoria do serviço e segurança</td><td>Interesse legítimo (Art. 6.º, n.º 1, al. f))</td></tr>
    <tr><td>Cumprimento de obrigações legais</td><td>Obrigação jurídica (Art. 6.º, n.º 1, al. c))</td></tr>
    <tr><td>Comunicações de marketing</td><td>Consentimento (Art. 6.º, n.º 1, al. a)) — apenas com opt-in explícito</td></tr>
  </tbody>
</table>

<h2>5. Partilha de Dados e Terceiros</h2>
<p>Partilhamos dados pessoais apenas quando estritamente necessário:</p>
<ul>
  <li>Fornecedores de serviços de email: para emails transacionais;</li>
  <li>Fornecedores de alojamento: exclusivamente infraestrutura baseada na UE.</li>
</ul>
<p><strong>Não</strong> vendemos, alugamos nem cedemos os seus dados pessoais. Não utilizamos processadores sediados fora da UE para quaisquer dados pessoais.</p>

<h2>6. Armazenamento e Conservação de Dados</h2>
<h3>6.1. Localização</h3>
<p>Todos os dados são armazenados exclusivamente em <strong>centros de dados na União Europeia</strong>. Nenhum dado é transferido para fora da UE/EEE.</p>
<h3>6.2. Prazos de Conservação</h3>
<ul>
  <li>Dados de contacto e leads: conservados até 24 meses após a última interação;</li>
  <li>Dados de faturação: conservados durante 10 anos conforme exigido pela legislação fiscal aplicável;</li>
  <li>Gravações de chamadas (quando aplicável): conservadas conforme contrato com o cliente, depois eliminadas permanentemente.</li>
</ul>

<h2>7. Os Seus Direitos ao Abrigo do RGPD</h2>
<p>Tem os seguintes direitos relativamente aos seus dados pessoais:</p>
<ul>
  <li><strong>Direito de acesso</strong> — obter confirmação e acesso aos seus dados;</li>
  <li><strong>Direito de retificação</strong> — corrigir dados inexatos ou incompletos;</li>
  <li><strong>Direito ao apagamento</strong> — solicitar a eliminação dos dados ("direito a ser esquecido");</li>
  <li><strong>Direito à limitação do tratamento</strong> — limitar o tratamento em determinadas circunstâncias;</li>
  <li><strong>Direito à portabilidade dos dados</strong> — receber os dados num formato estruturado e legível por máquina;</li>
  <li><strong>Direito de oposição</strong> — opor-se ao tratamento para fins de marketing direto ou interesse legítimo;</li>
  <li><strong>Direito de retirar o consentimento</strong> — a qualquer momento, sem afetar o tratamento anterior.</li>
</ul>
<p>Para exercer qualquer destes direitos, contacte-nos em <a href="mailto:hello@callemily.eu">hello@callemily.eu</a>. Responderemos no prazo de 30 dias.</p>

<h2>8. Política de Cookies</h2>
<h3>8.1. Sítio de Marketing (callemily.eu)</h3>
<p>O nosso sítio de marketing <strong>não utiliza cookies de rastreio</strong>. O único cookie definido é um cookie funcional estritamente necessário que armazena a sua preferência de idioma (<code>NEXT_LOCALE</code>). Não contém dados pessoais e está isento de requisitos de consentimento ao abrigo do Artigo 5.º, n.º 3 da Diretiva ePrivacy.</p>
<h3>8.2. Banner de Consentimento de Cookies</h3>
<p>Pode dispensar o banner de cookies a qualquer momento. A sua preferência é armazenada localmente e não definiremos cookies não essenciais sem o seu consentimento.</p>

<h2>9. Medidas de Segurança</h2>
<p>A CallEmily implementa medidas técnicas e organizacionais adequadas para proteger os dados pessoais:</p>
<ul>
  <li>Encriptação dos dados em trânsito (TLS 1.3) e em repouso;</li>
  <li>Autenticação segura e controlo de acessos;</li>
  <li>Cópias de segurança regulares e plano de recuperação;</li>
  <li>Infraestrutura baseada na UE com acordos de tratamento de dados conformes com o RGPD.</li>
</ul>

<h2>10. Notificação de Violações de Dados</h2>
<p>Em caso de violação de dados pessoais que represente um risco para os titulares, a CallEmily notificará a autoridade de supervisão competente no prazo de 72 horas e, quando necessário, informará os indivíduos afetados sem demora injustificada.</p>

<h2>11. Dados de Menores</h2>
<p>A plataforma CallEmily destina-se exclusivamente a utilizadores empresariais com 18 anos ou mais. Não recolhemos intencionalmente dados de menores.</p>

<h2>12. Alterações a Esta Política</h2>
<p>Esta política pode ser atualizada periodicamente. Alterações significativas serão comunicadas através do sítio ou por email com pelo menos 30 dias de antecedência.</p>

<h2>13. Autoridade de Supervisão</h2>
<p>Tem o direito de apresentar uma reclamação junto da autoridade de supervisão competente:</p>
<p><strong>Comissão Nacional de Proteção de Dados (CNPD)</strong><br/>
Rua de São Bento, n.º 148-3.º, 1200-821 Lisboa<br/>
<a href="https://www.cnpd.pt" target="_blank" rel="noopener">www.cnpd.pt</a></p>

<h2>14. Contacto</h2>
<p>Para qualquer questão sobre esta política ou os seus dados pessoais:<br/>
Email: <a href="mailto:hello@callemily.eu">hello@callemily.eu</a><br/>
Sítio: <a href="https://callemily.eu">callemily.eu</a></p>
    `.trim(),
  },
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isPt = locale === "pt"
  const content = isPt ? CONTENT.pt : CONTENT.en

  const cmsText = await getCmsPrivacy(locale)

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-800">
      <SiteHeader />
      <main className="flex-1 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <article
            className="prose prose-lg max-w-none prose-slate
                       prose-headings:font-semibold prose-headings:text-slate-800
                       prose-h1:text-3xl md:prose-h1:text-4xl prose-h1:mb-2
                       prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
                       prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
                       prose-p:leading-relaxed
                       prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-1
                       prose-strong:font-semibold
                       prose-a:text-sky-600 hover:prose-a:text-sky-700
                       prose-table:text-sm prose-th:bg-slate-50 prose-th:font-semibold"
          >
            <h1>{content.title}</h1>
            <p className="text-sm text-gray-500 mt-0 mb-8">{content.updated}</p>

            {cmsText ? (
              <div className="space-y-6">
                {cmsText.split("\n\n").map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            ) : (
              <div dangerouslySetInnerHTML={{ __html: content.html }} />
            )}
          </article>
        </div>
      </main>
      <SiteFooter locale={locale} />
    </div>
  )
}
