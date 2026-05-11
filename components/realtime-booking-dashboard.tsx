"use client"

import type React from "react"

import { useEffect, useState, useCallback } from "react"
import { CalendarDays, Clock, User, Info, AlertCircle, Loader2 } from "lucide-react"

// API Configuration
const API_URL = "/api/restaurant-status"

interface Reservation {
  name: string
  phone: string
  guests: number
  confirmationNumber: string
  specialRequests?: string
}

interface TimeSlot {
  isBooked: boolean
  reservation?: Reservation // This needs to be populated by the API for booked slots
}

interface TableSchedule {
  [date: string]: {
    [time: string]: TimeSlot
  }
}

interface RestaurantTable {
  id: string // Changed from number to string to match potential API changes if IDs are like "table-1"
  name: string
  location: string
  seats: number
  schedule: TableSchedule
}

interface TablesData {
  current_date: string
  current_time: string
  week_dates: string[]
  working_hours: string[]
  tables: RestaurantTable[]
  // total_tables?: number; // From sample, but not used in component
}

interface TooltipData {
  content: React.ReactNode
  x: number
  y: number
}

export default function RealtimeBookingDashboard() {
  const [tablesData, setTablesData] = useState<TablesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdate, setLastUpdate] = useState<string>("")
  const [tooltip, setTooltip] = useState<TooltipData | null>(null)

  const fetchData = useCallback(async () => {
    // setLoading(true); // Optionally set loading on each fetch if preferred
    try {
      setError(null) // Clear previous error before new fetch
      const response = await fetch(API_URL)
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(
          `HTTP error ${response.status}: ${response.statusText}. ${errorData.message || errorData.details || ""}`,
        )
      }
      const data: TablesData = await response.json()
      setTablesData(data)
      setLastUpdate(new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    } catch (err) {
      console.error("Ошибка при загрузке данных о столах:", err)
      setError(err instanceof Error ? err.message : "Неизвестная ошибка загрузки данных")
      // Keep existing data on fetch error to avoid blank screen
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData() // Initial fetch
    const intervalId = setInterval(fetchData, 30000) // Refresh every 30 seconds (was 5s, can be adjusted)
    return () => clearInterval(intervalId) // Cleanup on unmount
  }, [fetchData])

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr)
      if (isNaN(date.getTime())) {
        return dateStr // Return original if invalid
      }
      const days = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"]
      const months = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"]
      return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`
    } catch (e) {
      return dateStr // Fallback for invalid date strings
    }
  }

  const isPastSlot = (date: string, hour: string, currentDate: string, currentTime: string): boolean => {
    try {
      // Ensure time has seconds for accurate comparison if currentTime includes them
      const slotDateTime = new Date(`${date}T${hour.includes(":") ? hour : hour + ":00"}:00`)
      const currentHourMinute = currentTime.split(":").slice(0, 2).join(":")
      const currentDateTime = new Date(`${currentDate}T${currentHourMinute}:00`)
      return slotDateTime < currentDateTime
    } catch (e) {
      return false // If date parsing fails, assume not past
    }
  }

  const getSlotClass = (
    slot: TimeSlot,
    date: string,
    hour: string,
    currentDate: string,
    currentTime: string,
  ): string => {
    const baseClass =
      "p-2 text-xs text-center border border-gray-200 transition-all duration-200 ease-in-out cursor-pointer"
    // Compare only hour and minute for current slot highlighting
    const currentHourMinute = currentTime.split(":").slice(0, 2).join(":")
    const slotHourMinute = hour.includes(":") ? hour.split(":").slice(0, 2).join(":") : hour

    const isCurrent = date === currentDate && slotHourMinute === currentHourMinute

    if (isCurrent) {
      return `${baseClass} bg-blue-200 text-blue-800 font-semibold ring-2 ring-blue-500`
    }
    if (slot.isBooked) {
      return `${baseClass} bg-yellow-100 text-yellow-800 font-medium hover:bg-yellow-200`
    }
    if (isPastSlot(date, hour, currentDate, currentTime)) {
      return `${baseClass} bg-gray-100 text-gray-400 cursor-not-allowed`
    }
    return `${baseClass} bg-green-100 text-green-800 hover:bg-green-200`
  }

  const handleMouseEnterSlot = (
    event: React.MouseEvent<HTMLTableCellElement>,
    table: RestaurantTable,
    date: string,
    hour: string,
  ) => {
    const slot = table.schedule[date]?.[hour]
    if (!slot) return

    let tooltipContent: React.ReactNode
    if (slot.isBooked && slot.reservation) {
      const res = slot.reservation
      tooltipContent = (
        <div className="text-xs leading-relaxed">
          {" "}
          {/* Добавим leading-relaxed для чуть большего межстрочного интервала */}
          <p>
            <strong>{res.name}</strong>
          </p>
          {res.phone && <p>Телефон: {res.phone}</p>}
          <p>Гостей: {res.guests}</p>
          {res.confirmationNumber && <p>Подтверждение: {res.confirmationNumber}</p>}
          {res.specialRequests && <p>Пожелания: {res.specialRequests}</p>}
        </div>
      )
    } else {
      tooltipContent = (
        <div className="text-xs">
          <p className="font-bold">{slot.isBooked ? "Забронировано (нет данных)" : "Свободно"}</p>
          <p>📅 {formatDate(date)}</p>
          <p>⏰ {hour}</p>
          <p>
            🪑 {table.name} ({table.seats} мест)
          </p>
        </div>
      )
    }
    setTooltip({ content: tooltipContent, x: event.clientX, y: event.clientY })
  }

  const handleMouseLeaveSlot = () => {
    setTooltip(null)
  }

  if (loading && !tablesData) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Loader2 className="w-12 h-12 text-[#4A90E2] animate-spin mb-4" />
        <p className="text-lg text-gray-600 font-sans">Загрузка расписания...</p>
      </div>
    )
  }

  if (error && !tablesData) {
    return (
      <div
        className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md my-6 text-center"
        role="alert"
      >
        <div className="flex items-center justify-center mb-2">
          <AlertCircle className="w-8 h-8 mr-3" />
          <p className="text-xl font-bold font-montserrat">Ошибка загрузки данных</p>
        </div>
        <p className="text-sm font-sans">{error}</p>
        <p className="text-xs font-sans mt-2">
          Пожалуйста, проверьте ваше интернет-соединение или попробуйте обновить страницу позже.
        </p>
      </div>
    )
  }

  if (!tablesData || tablesData.tables.length === 0) {
    return (
      <div className="py-10 text-center">
        <Info className="w-10 h-10 text-gray-400 mx-auto mb-4" />
        <p className="text-lg text-gray-500 font-sans">Нет данных о столах для отображения.</p>
        {error && <p className="text-sm text-red-500 font-sans mt-2">Ошибка обновления: {error}</p>}
      </div>
    )
  }

  // Ensure current_time has minutes for comparison
  const currentTimeForComparison = tablesData.current_time.includes(":")
    ? tablesData.current_time
    : `${tablesData.current_time}:00`

  return (
    <div className="w-full p-4 md:p-6 bg-white rounded-xl shadow-xl">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md mb-4 text-sm" role="alert">
          <strong className="font-bold">Ошибка обновления:</strong>
          <span className="block sm:inline"> {error}. Отображаются последние доступные данные.</span>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 pb-4 border-b border-gray-200">
        <div className="mb-4 sm:mb-0">
          <h2 className="text-2xl font-bold text-[#1A3C5A] font-montserrat">Статус бронирований</h2>
          <p className="text-sm text-gray-500 font-sans">Обновлено: {lastUpdate || "нет данных"}</p>
        </div>
        <div className="flex items-center space-x-4 text-sm text-gray-700 font-sans">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-1 text-[#4A90E2]" />
            <span>{formatDate(tablesData.current_date)}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-[#4A90E2]" />
            <span>{tablesData.current_time}</span>
          </div>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-4 items-center text-xs font-sans">
        <span className="font-semibold">Легенда:</span>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-green-100 border border-gray-300 rounded-sm mr-1.5"></span>Свободно
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-yellow-100 border border-gray-300 rounded-sm mr-1.5"></span>Забронировано
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-blue-200 border border-gray-300 rounded-sm mr-1.5"></span>Текущее время
        </div>
        <div className="flex items-center">
          <span className="w-3 h-3 bg-gray-100 border border-gray-300 rounded-sm mr-1.5"></span>Прошедшее время
        </div>
      </div>

      {tablesData.tables.map((table) => (
        <div key={table.id} className="mb-8 p-4 border border-gray-200 rounded-lg shadow-sm bg-gray-50/50">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            <h3 className="text-lg font-semibold text-[#333333] font-montserrat mb-1 sm:mb-0">{table.name}</h3>
            <div className="flex space-x-2 text-xs text-gray-600 font-sans">
              <span className="bg-gray-200 px-2 py-0.5 rounded-full">{table.location}</span>
              <span className="bg-gray-200 px-2 py-0.5 rounded-full">
                <User className="w-3 h-3 inline mr-1" /> {table.seats} мест
              </span>
            </div>
          </div>
          <div className="overflow-x-auto rounded-md">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="p-2 text-xs font-semibold text-gray-600 border border-gray-200 text-left sticky left-0 bg-gray-100 z-20 whitespace-nowrap">
                    Время
                  </th>
                  {tablesData.week_dates.map((date) => (
                    <th
                      key={date}
                      className="p-2 text-xs font-semibold text-gray-600 border border-gray-200 whitespace-nowrap"
                    >
                      {formatDate(date)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tablesData.working_hours.map((hour) => (
                  <tr key={hour} className="even:bg-white odd:bg-gray-50/30">
                    <td className="p-2 text-xs font-medium text-gray-700 border border-gray-200 text-left sticky left-0 bg-inherit z-10 whitespace-nowrap">
                      {hour}
                    </td>
                    {tablesData.week_dates.map((date) => {
                      const slot = table.schedule[date]?.[hour]
                      if (!slot) {
                        return (
                          <td
                            key={`${date}-${hour}`}
                            className="p-2 text-xs text-center border border-gray-200 bg-gray-50 cursor-not-allowed" // Indicate non-bookable/undefined slot
                          >
                            -
                          </td>
                        )
                      }
                      return (
                        <td
                          key={`${date}-${hour}`}
                          className={getSlotClass(
                            slot,
                            date,
                            hour,
                            tablesData.current_date,
                            currentTimeForComparison, // Use formatted current time
                          )}
                          onMouseEnter={(e) => handleMouseEnterSlot(e, table, date, hour)}
                          onMouseLeave={handleMouseLeaveSlot}
                        >
                          {slot.isBooked && slot.reservation
                            ? slot.reservation.name // Показываем полное имя
                            : slot.isBooked
                              ? "👤"
                              : "✓"}{" "}
                          {/* Show person icon if booked but no data, else checkmark */}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
      {tooltip && (
        <div
          className="fixed bg-black bg-opacity-80 text-white p-3 rounded-lg shadow-xl pointer-events-none z-50 max-w-xs text-sm"
          style={{
            left: `${tooltip.x + 15}px`,
            top: `${tooltip.y + 15}px`,
            // transform: "translateY(-100%)", // Old positioning
            // Better positioning: try to keep it on screen
            transform: `translate(${tooltip.x > window.innerWidth - 200 ? "-100%" : "0"}, ${tooltip.y < 100 ? "0" : "-100%"})`,
            transition: "opacity 0.1s ease-out, transform 0.1s ease-out",
          }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  )
}
