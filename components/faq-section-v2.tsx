"use client"

import { useState } from "react"

const FAQ_ITEMS = [
  { q: "Сколько это стоит?", a: "Стоимость зависит от объёма звонков и нужных интеграций. Чтобы не показывать «среднюю температуру по больнице», мы делаем индивидуальный расчёт после короткой встречи. Внутри расчёта — ваш текущий убыток от пропусков, стоимость Эмилии и срок окупаемости. В среднем — 2–4 месяца." },
  { q: "Гости поймут, что говорят с роботом?", a: "Голос Эмилии очень близок к человеческому — большинство гостей не замечают. Но мы по умолчанию настраиваем честное представление: «Здравствуйте, это голосовой помощник ресторана». Это формирует доверие и не разочаровывает." },
  { q: "Как происходит интеграция с iiko / R-Keeper?", a: "Подключаем через официальные API. Бронь в Эмилии = бронь в системе. Стол автоматически блокируется, при отмене — освобождается. Настройка занимает 1–2 рабочих дня." },
  { q: "Что, если столиков нет?", a: "Эмилия предлагает альтернативные время или дату, ставит в лист ожидания, или передаёт менеджеру для нестандартного решения. Она никогда не говорит «нет» и не кладёт трубку." },
  { q: "А если гость хочет поговорить с человеком?", a: "Эмилия мгновенно переводит звонок на администратора или менеджера, с кратким брифом по предыдущему диалогу. Никаких «начните сначала»." },
  { q: "Сколько звонков она держит одновременно?", a: "Технически — без ограничений. Если у вас 100 гостей звонят в одну минуту, она ответит всем 100. На практике — берём с запасом ×10 от вашего трафика." },
  { q: "Можно ли сначала просто поговорить?", a: "Да. Часовой созвон, разбираем ваши процессы, делаем расчёт под ваш бизнес. Без обязательств и без продавцов с пресейлами." },
]

export default function FAQSectionV2() {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section id="faq" className="ce-section" style={{ background: "var(--ce-bg)" }}>
      <div className="ce-wrap-narrow">
        <div style={{ marginBottom: 48, textAlign: "center" }}>
          <span className="ce-eyebrow" style={{ display: "block", textAlign: "center" }}>FAQ</span>
          <h2 className="ce-h-display" style={{ fontSize: "clamp(32px, 4.4vw, 56px)", margin: 0 }}>Частые вопросы</h2>
        </div>

        <div className="ce-card" style={{ padding: 8 }}>
          {FAQ_ITEMS.map((it, i) => {
            const isOpen = open === i
            return (
              <div key={i} style={{ borderBottom: i < FAQ_ITEMS.length - 1 ? "1px solid var(--ce-border)" : "none" }}>
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  style={{ width: "100%", textAlign: "left", background: "transparent", border: "none", padding: "22px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, color: "var(--ce-text)", cursor: "pointer" }}
                >
                  <span className="ce-h-display" style={{ fontSize: 17, fontWeight: 500, lineHeight: 1.35 }}>{it.q}</span>
                  <span style={{ width: 32, height: 32, borderRadius: "50%", background: isOpen ? "var(--ce-primary)" : "var(--ce-bg-alt)", color: isOpen ? "#fff" : "var(--ce-text)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all .2s ease", transform: isOpen ? "rotate(45deg)" : "rotate(0)", fontSize: 20, lineHeight: 1 }}>+</span>
                </button>
                <div style={{ maxHeight: isOpen ? 400 : 0, overflow: "hidden", transition: "max-height .35s ease" }}>
                  <div style={{ padding: "0 24px 24px", fontSize: 15.5, color: "var(--ce-text-2)", lineHeight: 1.65 }}>{it.a}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
