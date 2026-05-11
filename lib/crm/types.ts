// Общие типы для CRM-интеграций

export interface LeadData {
  name: string
  email: string
  phone: string
  company: string
  source: string
  leadType: string
  createdAt: string
  [key: string]: any // Дополнительные поля
}

export interface CRMAdapter {
  sendLead(data: LeadData): Promise<any>
  getName(): string
}
