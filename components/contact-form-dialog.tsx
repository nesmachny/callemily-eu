"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ContactFormSection from "./contact-form-section"

export function ContactFormDialog() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
          Отправить заявку
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-lg p-0 max-h-[90vh] overflow-y-auto">
        {" "}
        {/* Изменено здесь */}
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold font-montserrat text-center">Заполните заявку</DialogTitle>
          <DialogDescription className="text-center text-gray-600">
            Мы свяжемся с вами в ближайшее время.
          </DialogDescription>
        </DialogHeader>
        {/* Передаем bgGradient=false, чтобы форма внутри диалога не имела своего градиента */}
        <ContactFormSection className="!py-6 !bg-transparent text-gray-800" bgGradient={false} />
      </DialogContent>
    </Dialog>
  )
}
