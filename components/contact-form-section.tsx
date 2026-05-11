"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"

export default function ContactFormSection({ className = "", bgGradient = true }) {
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    restaurant: "",
    consentPersonalData: false, // Новое поле
    consentCallsSms: false, // Новое поле
    consentEmail: false, // Новое поле
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Уточняем тип e
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Prevent multiple submissions
    if (isSubmitting) return

    setIsSubmitting(true)

    // OneCDP Tracking
    if (typeof window.tracker === "object" && window.tracker !== null && typeof window.tracker.track === "function") {
      try {
        window.tracker.track(
          "callbackRequest",
          {
            ClientID: "6756d653f8b8adb0d47420b9", // Фиксированное значение
            Name: formData.name,
            Email: formData.email,
            Phone: formData.phone,
            VenueName: formData.restaurant,
            consents: {
              gdpr_consent: formData.consentPersonalData,
              sms_consent: formData.consentCallsSms,
              email_consent: formData.consentEmail,
            },
            consent_id: null, // Как указано в примере
            FormID: "6816141bf3eb0caf6f728ba9", // Фиксированное значение
          },
          { fire: true },
        )
        console.log("OneCDP callbackRequest tracked successfully.")
      } catch (trackerError) {
        console.error("Error tracking OneCDP callbackRequest:", trackerError)
        // Здесь можно добавить логику обработки ошибки трекинга, если необходимо
      }
    } else {
      console.warn("OneCDP tracker (window.tracker.track) not found or is not a function.")
    }

    try {
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          restaurant: formData.restaurant,
          source: "contact-form-section",
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("Form submission error:", errorData)
      }

      setFormSubmitted(true)
    } catch (error) {
      console.error("Form submission failed:", error)
      setFormSubmitted(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Reset form handler
  const handleReset = () => {
    setFormSubmitted(false)
    setFormData({
      name: "",
      email: "",
      phone: "",
      restaurant: "",
      consentPersonalData: false,
      consentCallsSms: false,
      consentEmail: false,
    })
  }

  return (
    <section
      id="contact"
      className={`py-16 md:py-24 ${bgGradient ? "bg-gradient-to-r from-[#4A90E2] to-[#00C4B4]" : ""} ${className}`}
    >
      <div className="container mx-auto px-4 text-center">
        <h2 className="mb-2 text-3xl font-bold text-white md:text-4xl font-montserrat">
          Готовы увеличить бронирования и сэкономить?
        </h2>
        <p className="mb-8 text-xl text-white font-sans">Попробуйте CallEmily бесплатно 14 дней!</p>

        <div className="mx-auto max-w-md rounded-xl bg-white p-6 shadow-lg">
          {formSubmitted ? (
            <div className="text-center py-8">
              <h3 className="text-xl font-bold text-[#1A3C5A] mb-2 font-montserrat">Спасибо за заявку!</h3>
              <p className="text-[#666666] font-sans">Мы свяжемся с вами в ближайшее время.</p>
              <button
                className="mt-4 rounded-lg bg-[#4A90E2] px-6 py-3 text-white hover:bg-[#00C4B4] transition-transform hover:scale-105 font-montserrat"
                onClick={handleReset}
              >
                Отправить еще одну заявку
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Имя"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#4A90E2] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#4A90E2] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Телефон"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#4A90E2] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="restaurant"
                  value={formData.restaurant}
                  onChange={handleChange}
                  placeholder="Название ресторана"
                  className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#4A90E2] focus:outline-none focus:ring-2 focus:ring-[#4A90E2]"
                  required
                />
              </div>
              <div className="mb-4 text-left">
                <p className="text-sm text-gray-600 mb-3 font-sans">
                  Для обработки вашей заявки нам необходимо ваше согласие. Пожалуйста, выберите, на что вы соглашаетесь:
                </p>
                <div className="space-y-2">
                  <label className="flex items-start text-sm text-gray-700 font-sans">
                    <input
                      type="checkbox"
                      name="consentPersonalData"
                      checked={formData.consentPersonalData}
                      onChange={handleChange}
                      className="mr-2 mt-1 h-4 w-4 rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
                      required // Делаем этот чекбокс обязательным
                    />
                    <span>
                      Я даю согласие на обработку моих персональных данных в соответствии с{" "}
                      <Link href="/privacy" className="text-[#4A90E2] hover:underline" target="_blank">
                        Политикой конфиденциальности
                      </Link>{" "}
                      для целей обработки заявки и предоставления услуг.
                    </span>
                  </label>
                  <label className="flex items-start text-sm text-gray-700 font-sans">
                    <input
                      type="checkbox"
                      name="consentCallsSms"
                      checked={formData.consentCallsSms}
                      onChange={handleChange}
                      className="mr-2 mt-1 h-4 w-4 rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
                    />
                    <span>
                      Я соглашаюсь на получение информационных и рекламных сообщений, а также голосовых звонков по
                      указанному номеру телефона.
                    </span>
                  </label>
                  <label className="flex items-start text-sm text-gray-700 font-sans">
                    <input
                      type="checkbox"
                      name="consentEmail"
                      checked={formData.consentEmail}
                      onChange={handleChange}
                      className="mr-2 mt-1 h-4 w-4 rounded border-gray-300 text-[#4A90E2] focus:ring-[#4A90E2]"
                    />
                    <span>
                      Я соглашаюсь на получение информационных и рекламных сообщений на указанный адрес электронной
                      почты.
                    </span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-xl bg-[#00C4B4] p-3 font-bold text-white hover:bg-[#4A90E2] transition-transform hover:scale-105 font-montserrat disabled:opacity-70"
              >
                {isSubmitting ? "Отправка..." : "Отправить заявку"}
              </button>
              <p className="mt-3 text-xs text-gray-500 text-center font-sans">
                Нажимая "Отправить заявку", вы подтверждаете, что ознакомлены с{" "}
                <Link href="/privacy" className="text-[#4A90E2] hover:underline" target="_blank">
                  Политикой конфиденциальности
                </Link>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
