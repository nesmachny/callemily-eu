"use client"

import type React from "react"
import Link from "next/link"

import { useState } from "react"
import { trackEvent, EVENTS } from "@/app/utils/analytics"
import { useAnalytics } from "@/hooks/use-analytics"

interface ContactFormProps {
  location: string // Местоположение формы на сайте (например, "hero", "cta", "footer")
  className?: string
}

export default function ContactForm({ location, className = "" }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    restaurant: "",
    consentPersonalData: false, // Новый
    consentCallsSms: false, // Новый
    consentEmail: false, // Новый
  })

  const [formState, setFormState] = useState<{
    isSubmitting: boolean
    isSubmitted: boolean
    error: string | null
    message: string | null
  }>({
    isSubmitting: false,
    isSubmitted: false,
    error: null,
    message: null,
  })

  const { trackFormSubmit, trackButtonClick } = useAnalytics()

  // Обработчик изменения полей формы
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // OneCDP Tracking
    if (typeof window.tracker === "object" && window.tracker !== null && typeof window.tracker.track === "function") {
      try {
        window.tracker.track(
          "callbackRequest",
          {
            ClientID: "6756d653f8b8adb0d47420b9",
            Name: formData.name,
            Email: formData.email,
            Phone: formData.phone,
            VenueName: formData.restaurant,
            consents: {
              sms_consent: formData.consentCallsSms,
              email_consent: formData.consentEmail,
              // Добавляем согласие на обработку ПД, если оно отслеживается отдельно
              // personal_data_consent: formData.consentPersonalData,
            },
            consent_id: null,
            FormID: "6816141bf3eb0caf6f728ba9",
          },
          { fire: true },
        )
        console.log("OneCDP callbackRequest tracked successfully.")
      } catch (trackerError) {
        console.error("Error tracking OneCDP callbackRequest:", trackerError)
      }
    } else {
      console.warn("OneCDP tracker (window.tracker.track) not found or is not a function.")
    }

    // Отслеживаем попытку отправки формы
    trackFormSubmit(`contact-form-${location}`, {
      location,
      restaurant_name: formData.restaurant,
    })

    // Отслеживаем событие отправки формы
    trackEvent(EVENTS.FORM_SUBMIT, {
      formName: `contact-form-${location}`,
      ...formData,
    })

    // Устанавливаем состояние отправки
    setFormState({
      isSubmitting: true,
      isSubmitted: false,
      error: null,
      message: null,
    })

    try {
      // Отправляем данные на сервер
      const response = await fetch("/api/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, source: "contact-form" }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Произошла ошибка при отправке формы")
      }

      // Успешная отправка
      setFormState({
        isSubmitting: false,
        isSubmitted: true,
        error: null,
        message: result.message || "Заявка успешно отправлена!",
      })

      // Сбрасываем форму
      setFormData({
        name: "",
        email: "",
        phone: "",
        restaurant: "",
        consentPersonalData: false,
        consentCallsSms: false,
        consentEmail: false,
      })
    } catch (error) {
      console.error("Error submitting form:", error)
      setFormState({
        isSubmitting: false,
        isSubmitted: false,
        error: error instanceof Error ? error.message : "Произошла ошибка при отправке формы",
        message: null,
      })
    }
  }

  // Обработчик повторной отправки формы
  const handleReset = () => {
    trackButtonClick("reset-contact-form", { location })
    setFormState({
      isSubmitting: false,
      isSubmitted: false,
      error: null,
      message: null,
    })
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
    <div className={`rounded-xl bg-white p-6 shadow-lg ${className}`}>
      {formState.isSubmitted ? (
        <div className="text-center py-8">
          <h3 className="text-xl font-bold text-[#333333] mb-2 font-montserrat">Спасибо за заявку!</h3>
          <p className="text-[#666666] font-sans">{formState.message || "Мы свяжемся с вами в ближайшее время."}</p>
          <button
            className="mt-4 rounded-lg bg-[#A3CFFA] px-6 py-3 text-white hover:bg-[#A3FFAA] transition-transform hover:scale-105 font-montserrat"
            onClick={handleReset}
          >
            Отправить еще одну заявку
          </button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
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
                  Я соглашаюсь на получение информационных и рекламных сообщений на указанный адрес электронной почты.
                </span>
              </label>
            </div>
          </div>
          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Имя"
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#A3CFFA] focus:outline-none focus:ring-2 focus:ring-[#A3CFFA]"
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
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#A3CFFA] focus:outline-none focus:ring-2 focus:ring-[#A3CFFA]"
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
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#A3CFFA] focus:outline-none focus:ring-2 focus:ring-[#A3CFFA]"
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
              className="w-full rounded-lg border border-gray-300 p-3 focus:border-[#A3CFFA] focus:outline-none focus:ring-2 focus:ring-[#A3CFFA]"
              required
            />
          </div>

          {formState.error && <div className="text-red-500 text-sm font-sans">{formState.error}</div>}

          <button
            type="submit"
            disabled={formState.isSubmitting}
            className="w-full rounded-xl bg-[#A3CFFA] p-3 font-bold text-white hover:bg-[#A3FFAA] transition-transform hover:scale-105 font-montserrat disabled:opacity-70"
          >
            {formState.isSubmitting ? "Отправка..." : "Отправить заявку"}
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
  )
}
