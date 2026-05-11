import type { CRMAdapter, LeadData } from "../types"

export class AmoCRMAdapter implements CRMAdapter {
  private apiUrl: string
  private apiKey: string

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl
    this.apiKey = apiKey
  }

  getName(): string {
    return "AmoCRM"
  }

  async sendLead(data: LeadData): Promise<any> {
    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      }

      const phone = data.phone?.trim()
      let contactId: number | null = null

      // 1. Пытаемся найти существующий контакт по номеру телефона
      if (phone) {
        try {
          const searchResponse = await fetch(
            `${this.apiUrl}/api/v4/contacts?query=${encodeURIComponent(phone)}`,
            {
              method: "GET",
              headers,
            },
          )

          if (searchResponse.ok) {
            const text = await searchResponse.text()
            if (text) {
              const searchJson = JSON.parse(text) as any
              const embedded = searchJson?._embedded
              const contacts = Array.isArray(embedded?.contacts) ? embedded.contacts : []
              if (contacts.length > 0 && contacts[0].id) {
                contactId = contacts[0].id
              }
            }
          } else {
            const body = await searchResponse.text()
            console.error("AmoCRM search contact error:", searchResponse.status, searchResponse.statusText, body)
          }
        } catch (searchError) {
          console.error("Error searching contact in AmoCRM:", searchError)
        }
      }

      // 2. Если контакт не найден — создаём новый
      if (!contactId) {
        try {
          const contactPayload = [
            {
              name: data.name || data.email || data.phone || "Гость сайта",
              custom_fields_values: [
                phone
                  ? {
                      field_id: 648827, // Телефон
                      values: [
                        {
                          value: phone,
                          enum_id: 1057851, // MOB
                        },
                      ],
                    }
                  : null,
                data.email
                  ? {
                      field_id: 648829, // Email
                      values: [
                        {
                          value: data.email,
                          enum_id: 1057859, // WORK
                        },
                      ],
                    }
                  : null,
              ].filter(Boolean),
            },
          ]

          const createContactResponse = await fetch(`${this.apiUrl}/api/v4/contacts`, {
            method: "POST",
            headers,
            body: JSON.stringify(contactPayload),
          })

          if (!createContactResponse.ok) {
            const errBody = await createContactResponse.text()
            console.error("AmoCRM create contact error response body:", errBody)
            throw new Error(
              `AmoCRM create contact error: ${createContactResponse.status} ${createContactResponse.statusText}. Body: ${errBody}`,
            )
          }

          const createdJson = (await createContactResponse.json()) as any
          // AmoCRM v4 returns { _embedded: { contacts: [...] } }
          const createdContacts = createdJson?._embedded?.contacts ?? createdJson
          if (Array.isArray(createdContacts) && createdContacts[0]?.id) {
            contactId = createdContacts[0].id
          }
        } catch (createError) {
          console.error("Error creating contact in AmoCRM:", createError)
        }
      }

      // 2b. Если есть контакт и передан email — дополняем/обновляем у контакта поле Email (рабочий)
      if (contactId && data.email?.trim()) {
        try {
          const patchResponse = await fetch(`${this.apiUrl}/api/v4/contacts`, {
            method: "PATCH",
            headers,
            body: JSON.stringify([
              {
                id: contactId,
                custom_fields_values: [
                  {
                    field_id: 648829, // Email
                    values: [{ value: data.email.trim(), enum_id: 1057859 }], // WORK
                  },
                ],
              },
            ]),
          })
          if (!patchResponse.ok) {
            const errBody = await patchResponse.text()
            console.error("AmoCRM PATCH contact email error:", patchResponse.status, errBody)
          }
        } catch (patchError) {
          console.error("Error updating contact email in AmoCRM:", patchError)
        }
      }

      // 3. Преобразуем данные в формат AmoCRM для сделки (как у "Имя": имя, Lead from URL, тег)
      const siteUrl =
        typeof process !== "undefined" && process.env?.NEXT_PUBLIC_SITE_URL
          ? process.env.NEXT_PUBLIC_SITE_URL
          : "https://callemily.ru"

      const amoCRMData: any = {
        // Название сделки = имя контакта (чтобы в карточке было "Имя", а не "test")
        name: data.name || data.restaurant || "Заявка с сайта",

        pipeline_id: 6932478,
        status_id: 58311718,

        created_at: Math.floor(new Date(data.createdAt).getTime() / 1000),
        source: {
          name: data.source,
        },

        // Поле "Lead from: URL" в карточке (кастомное поле URL у сделки)
        custom_fields_values: [
          {
            field_id: 769979, // URL
            values: [{ value: siteUrl }],
          },
        ],

        _embedded: {
          tags: [{ name: "callemily" }],
        },
      }

      if (contactId) {
        amoCRMData._embedded.contacts = [{ id: contactId }]
      }

      const response = await fetch(`${this.apiUrl}/api/v4/leads`, {
        method: "POST",
        headers,
        body: JSON.stringify([amoCRMData]),
      })

      if (!response.ok) {
        const errBody = await response.text()
        console.error("AmoCRM API error response body:", errBody)
        throw new Error(`AmoCRM API error: ${response.status} ${response.statusText}. Body: ${errBody}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error sending lead to AmoCRM:", error)
      throw error
    }
  }
}
