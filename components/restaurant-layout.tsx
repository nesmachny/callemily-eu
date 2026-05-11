"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { CalendarDays, Clock } from "lucide-react"

interface Table {
  id: number
  status: "available" | "occupied" | "booking" | "selected"
  name: string
  capacity: 2 | 4 | 5
}

interface BookingInfo {
  guestName: string
  phone: string
  guests: number
  confirmationCode: string
  bookingDate: string
  bookingTime: string
}

const TOTAL_TABLES = 24

const FIXED_TABLE_CAPACITIES: (2 | 4 | 5)[] = (() => {
  const numTablesWith5Seats = Math.round(TOTAL_TABLES * 0.2)
  const numTablesWith2Seats = Math.round(TOTAL_TABLES * 0.2)
  const numTablesWith4Seats = TOTAL_TABLES - numTablesWith5Seats - numTablesWith2Seats
  const capacities = [
    ...Array(numTablesWith5Seats).fill(5),
    ...Array(numTablesWith2Seats).fill(2),
    ...Array(numTablesWith4Seats).fill(4),
  ]
  for (let i = capacities.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[capacities[i], capacities[j]] = [capacities[j], capacities[i]]
  }
  return capacities as (2 | 4 | 5)[]
})()

// Mock booking data generator
const generateBookingInfo = (tableId: number, selectedDate: Date, selectedTime: string): BookingInfo => {
  const names = ["Василий", "Анна", "Дмитрий", "Елена", "Михаил", "Ольга", "Сергей", "Татьяна", "Алексей", "Мария"]
  const name = names[tableId % names.length]
  const phone = `+7${Math.floor(Math.random() * 9000000000 + 1000000000)}`
  const guests = Math.floor(Math.random() * 6) + 1
  const confirmationCode = `BR${Math.floor(Math.random() * 90000000 + 10000000)}`

  // Форматируем дату в российском формате
  const bookingDate = selectedDate.toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })

  return {
    guestName: name,
    phone,
    guests,
    confirmationCode,
    bookingDate,
    bookingTime: selectedTime,
  }
}

const initialTables: Table[] = Array.from({ length: TOTAL_TABLES }, (_, i) => {
  const r = Math.random()
  let status: Table["status"] = "available"
  if (r < 0.3) status = "occupied"
  else if (r < 0.45) status = "booking"
  return {
    id: i + 1,
    status,
    name: `Стол ${i + 1}`,
    capacity: FIXED_TABLE_CAPACITIES[i],
  }
})

const statusColors = {
  available: "bg-green-500 hover:bg-green-600",
  occupied: "bg-red-500 hover:bg-red-600",
  booking: "bg-purple-500 hover:bg-purple-600",
  selected: "bg-yellow-400 ring-2 ring-yellow-600 ring-offset-2",
}

const statusLabels = {
  available: "Свободно",
  occupied: "Занято",
  selected: "Выбранный столик",
  booking: "Бронируется",
}

const TableSeatsVisualizer: React.FC<{ capacity: number }> = ({ capacity }) => {
  const viewBoxSize = 50
  const center = viewBoxSize / 2
  const seatRadius = 4.5
  const orbitRadius = center - seatRadius - 2
  let seatPositions: { cx: number; cy: number }[] = []
  if (capacity === 2) {
    seatPositions = [
      { cx: center, cy: center - orbitRadius },
      { cx: center, cy: center + orbitRadius },
    ]
  } else if (capacity === 4) {
    seatPositions = [
      { cx: center, cy: center - orbitRadius },
      { cx: center + orbitRadius, cy: center },
      { cx: center, cy: center + orbitRadius },
      { cx: center - orbitRadius, cy: center },
    ]
  } else if (capacity === 5) {
    const angles = [Math.PI / 2, Math.PI / 6, (5 * Math.PI) / 6, (7 * Math.PI) / 6, (11 * Math.PI) / 6]
    seatPositions = angles.map((angle) => ({
      cx: center + orbitRadius * Math.cos(angle),
      cy: center - orbitRadius * Math.sin(angle),
    }))
  }
  return (
    <svg viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`} className="absolute inset-0 w-full h-full" aria-hidden="true">
      {seatPositions.map((pos, index) => (
        <circle key={index} cx={pos.cx} cy={pos.cy} r={seatRadius} fill="white" />
      ))}
    </svg>
  )
}

// Tooltip component for booking information
const BookingTooltip: React.FC<{
  booking: BookingInfo
  isVisible: boolean
  position: { x: number; y: number }
}> = ({ booking, isVisible, position }) => {
  if (!isVisible) return null

  return (
    <div
      className="fixed z-50 bg-white text-gray-800 p-3 rounded-lg shadow-xl border border-gray-200 text-sm"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -100%)",
        marginTop: "-8px",
      }}
    >
      <div className="space-y-1">
        <div className="font-semibold text-gray-900">{booking.guestName}</div>
        <div className="text-sm text-gray-600">
          {booking.bookingDate} в {booking.bookingTime}
        </div>
        <div>Телефон: {booking.phone}</div>
        <div>Гостей: {booking.guests}</div>
        <div>Подтверждение: {booking.confirmationCode}</div>
      </div>
    </div>
  )
}

const russianDays = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"]

export default function RestaurantLayout() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>("12:00")
  const [currentTime, setCurrentTime] = useState(new Date())
  const [hoveredTable, setHoveredTable] = useState<number | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const timerId = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timerId)
  }, [])

  const isTodaySelected = useMemo(() => {
    const today = new Date()
    return (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    )
  }, [selectedDate])

  useEffect(() => {
    if (isTodaySelected) {
      const [currentSelectedHour, currentSelectedMinute] = selectedTime.split(":").map(Number)
      const nowHour = currentTime.getHours()
      const nowMinute = currentTime.getMinutes()
      if (currentSelectedHour < nowHour || (currentSelectedHour === nowHour && currentSelectedMinute < nowMinute)) {
        const firstFutureSlot = timeSlots.find((slot) => {
          const [slotHour, slotMinute] = slot.split(":").map(Number)
          return slotHour > nowHour || (slotHour === nowHour && slotMinute >= nowMinute)
        })
        if (firstFutureSlot) {
          setSelectedTime(firstFutureSlot)
        } else {
          setSelectedTime(timeSlots[timeSlots.length - 1] || timeSlots[0] || "07:00")
        }
      }
    }
  }, [selectedDate, currentTime, isTodaySelected, selectedTime])

  const dates = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      return date
    })
  }, [])

  const timeSlots = useMemo(() => {
    const slots: string[] = []
    for (let hour = 7; hour <= 22; hour++) {
      slots.push(`${hour.toString().padStart(2, "0")}:00`)
    }
    return slots
  }, [])

  const formatDateButton = (date: Date, index: number): { mainLabel: string; dayOfWeek: string } => {
    const dayOfWeek = russianDays[date.getDay()]
    let mainLabel: string
    if (index === 0) mainLabel = "Сегодня"
    else if (index === 1) mainLabel = "Завтра"
    else {
      const day = date.getDate().toString().padStart(2, "0")
      const month = (date.getMonth() + 1).toString().padStart(2, "0")
      mainLabel = `${day}.${month}`
    }
    return { mainLabel, dayOfWeek }
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    const newTablesForDate: Table[] = Array.from({ length: TOTAL_TABLES }, (_, i) => {
      const r = Math.random()
      let status: Table["status"] = "available"
      if (r < 0.2 + (date.getDate() % 7) * 0.04) status = "occupied"
      else if (r < 0.3 + (date.getDate() % 7) * 0.04) status = "booking"
      return { id: i + 1, status, name: `Стол ${i + 1}`, capacity: FIXED_TABLE_CAPACITIES[i] }
    })
    setTables(newTablesForDate)
    setSelectedTableId(null)
    setHoveredTable(null) // Hide tooltip when date changes
  }

  const handleTimeSelect = (time: string) => {
    if (isTodaySelected) {
      const [slotHour, slotMinute] = time.split(":").map(Number)
      const nowHour = currentTime.getHours()
      const nowMinute = currentTime.getMinutes()
      if (slotHour < nowHour || (slotHour === nowHour && slotMinute < nowMinute)) {
        return
      }
    }
    setSelectedTime(time)
    setHoveredTable(null) // Hide tooltip when time changes
  }

  const handleTableClick = (tableId: number) => {
    const clickedTable = tables.find((t) => t.id === tableId)
    if (!clickedTable || clickedTable.status === "occupied" || clickedTable.status === "booking") {
      // Для занятых столов ничего не делаем при клике
      return
    }
    setSelectedTableId((prevId) => (prevId === tableId ? null : tableId))
  }

  const handleTableMouseEnter = (tableId: number, event: React.MouseEvent) => {
    const table = tables.find((t) => t.id === tableId)
    if (table && (table.status === "occupied" || table.status === "booking")) {
      const rect = event.currentTarget.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.top,
      })
      setHoveredTable(tableId)
    }
  }

  const handleTableMouseLeave = () => {
    setHoveredTable(null)
  }

  const getTableStatus = (table: Table): Table["status"] => {
    if (selectedTableId === table.id) return "selected"
    return table.status
  }

  const getBookingInfo = (tableId: number): BookingInfo => {
    return generateBookingInfo(tableId, selectedDate, selectedTime)
  }

  return (
    <div className="w-full p-4 md:p-6 bg-slate-800 rounded-xl shadow-xl text-white mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 font-montserrat">
        Планировка демо ресторана "Вкусный дворик"
      </h2>
      <div className="mb-6">
        <div className="flex flex-wrap justify-center gap-2">
          {dates.map((date, index) => {
            const { mainLabel, dayOfWeek } = formatDateButton(date, index)
            return (
              <Button
                key={date.toISOString()}
                variant={selectedDate.toDateString() === date.toDateString() ? "default" : "outline"}
                onClick={() => handleDateSelect(date)}
                className={cn(
                  "text-xs sm:text-sm px-3 py-2 h-auto sm:px-4",
                  "flex flex-col items-center leading-tight",
                  selectedDate.toDateString() === date.toDateString()
                    ? "bg-sky-500 hover:bg-sky-600 text-white border-sky-500"
                    : "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600 hover:border-slate-500",
                )}
              >
                <div className="flex items-center">
                  <CalendarDays className="w-3.5 h-3.5 mr-1.5 hidden sm:inline-block" />
                  <span>{mainLabel}</span>
                </div>
                <span className="text-[10px] sm:text-xs text-slate-300 capitalize">{dayOfWeek}</span>
              </Button>
            )
          })}
        </div>
      </div>
      <div className="mb-8">
        <p className="text-center text-slate-300 mb-3 text-sm">Выберите время:</p>
        <div className="flex flex-wrap justify-center gap-2 max-w-3xl mx-auto">
          {timeSlots.map((time) => {
            const [slotHour, slotMinute] = time.split(":").map(Number)
            let isPast = false
            if (isTodaySelected) {
              const nowHour = currentTime.getHours()
              const nowMinute = currentTime.getMinutes()
              if (slotHour < nowHour || (slotHour === nowHour && slotMinute < nowMinute)) {
                isPast = true
              }
            }
            const isSelected = selectedTime === time

            return (
              <Button
                key={time}
                variant={"outline"}
                onClick={() => handleTimeSelect(time)}
                disabled={isPast && isTodaySelected}
                className={cn(
                  "text-xs sm:text-sm px-3 py-1.5 h-auto sm:px-4 sm:py-2 transition-all",
                  isSelected
                    ? "bg-teal-500 hover:bg-teal-600 text-white border-teal-500 ring-2 ring-teal-300 ring-offset-2 ring-offset-slate-800"
                    : isPast && isTodaySelected
                      ? "bg-slate-750 text-slate-500 border-slate-600 opacity-60 cursor-not-allowed"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600 hover:border-slate-500",
                )}
              >
                <Clock
                  className={cn("w-3.5 h-3.5 mr-1.5 hidden xs:inline-block", isPast && isTodaySelected && "opacity-60")}
                />
                {time}
              </Button>
            )
          })}
        </div>
      </div>
      <div className="grid grid-cols-6 gap-3 sm:gap-4 md:gap-6 max-w-2xl mx-auto mb-6">
        {tables.map((table) => {
          const currentStatus = getTableStatus(table)
          return (
            <button
              key={table.id}
              onClick={() => handleTableClick(table.id)}
              onMouseEnter={(e) => handleTableMouseEnter(table.id, e)}
              onMouseLeave={handleTableMouseLeave}
              aria-label={`${table.name}, ${table.capacity} мест, статус: ${statusLabels[currentStatus]}${
                currentStatus === "occupied" || currentStatus === "booking"
                  ? ". Наведите для просмотра деталей бронирования"
                  : ""
              }`}
              className={cn(
                "aspect-square rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 relative overflow-hidden",
                statusColors[currentStatus],
                currentStatus === "selected" ? "ring-yellow-300" : "focus:ring-sky-400",
                currentStatus === "occupied" || currentStatus === "booking"
                  ? "cursor-pointer opacity-70" // Изменено с cursor-not-allowed на cursor-pointer
                  : "hover:scale-105 active:scale-95",
              )}
            >
              <TableSeatsVisualizer capacity={table.capacity} />
              <span className="relative z-10 text-lg sm:text-xl font-semibold drop-shadow-[0_1.5px_1.5px_rgba(0,0,0,0.7)]">
                {table.id}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 text-xs sm:text-sm">
        {(Object.keys(statusLabels) as Array<keyof typeof statusLabels>).map(
          (statusKey) =>
            statusKey !== "selected" && (
              <div key={statusKey} className="flex items-center">
                <span
                  className={cn(
                    "w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full mr-1.5 sm:mr-2",
                    statusColors[statusKey].split(" ")[0],
                  )}
                ></span>
                <span>{statusLabels[statusKey]}</span>
              </div>
            ),
        )}
        <div className="flex items-center">
          <span
            className={cn(
              "w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full mr-1.5 sm:mr-2 border-2 border-yellow-300",
              statusColors["selected"].split(" ")[0],
            )}
          ></span>
          <span>{statusLabels["selected"]}</span>
        </div>
      </div>

      {/* Booking Tooltip */}
      {hoveredTable && (
        <BookingTooltip booking={getBookingInfo(hoveredTable)} isVisible={true} position={tooltipPosition} />
      )}
    </div>
  )
}
