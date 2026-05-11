13.03.26 - lib\crm\adapters\amocrm.ts - изменен json для отправки в amo crm
13.03.26 - lib\crm\adapters\amocrm.ts - добавлен поиск/создание контакта по телефону и привязка к сделке в amo crm
13.03.26 - lib\crm\adapters\amocrm.ts - сменен статус сделки на Неразобранное (58311714) в воронке 6932478
13.03.26 - lib\crm\adapters\amocrm.ts - статус "Неразобранное" недоступен через leads API, возвращен статус "Первичный контакт" (58311718)
13.03.26 - lib\crm\adapters\amocrm.ts - исправлена обработка поиска контакта (пустой ответ/204 без JSON)

curl -X POST "https://kaamowiflynet.amocrm.ru/api/v4/leads" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImVkYzdjMGYyZjM5OWViM2JhYjliMmU2MzZlZmYxY2Q1Nzg4NTExMzg3YjI4OTAyMGI0ZTYxMzg5ZWMxOWI0YzBmYTQwMjk2YWI3OWRmMjE3In0.eyJhdWQiOiJkMzhiNTEzYS02OWZiLTQ0NGItOTZmYi05ODU2NjVlN2EyZTAiLCJqdGkiOiJlZGM3YzBmMmYzOTllYjNiYWI5YjJlNjM2ZWZmMWNkNTc4ODUxMTM4N2IyODkwMjBiNGU2MTM4OWVjMTliNGMwZmE0MDI5NmFiNzlkZjIxNyIsImlhdCI6MTc3MzM4NTg2OSwibmJmIjoxNzczMzg1ODY5LCJleHAiOjE5MDMyMTkyMDAsInN1YiI6IjExMTkzMjA2IiwiZ3JhbnRfdHlwZSI6IiIsImFjY291bnRfaWQiOjMxMTMxNjA2LCJiYXNlX2RvbWFpbiI6ImFtb2NybS5ydSIsInZlcnNpb24iOjIsInNjb3BlcyI6WyJwdXNoX25vdGlmaWNhdGlvbnMiLCJmaWxlcyIsImNybSIsImZpbGVzX2RlbGV0ZSIsIm5vdGlmaWNhdGlvbnMiXSwiaGFzaF91dWlkIjoiMTU1YTliYzMtMjM3Ni00MTBkLTg5YzItYTk5Y2Y0NTQ1ZTliIiwiYXBpX2RvbWFpbiI6ImFwaS1iLmFtb2NybS5ydSJ9.BJdbRD2PuIfjixjuhj6sGGikgRyBc2m-wyF0jw4o597kZDrX32xc84UMA2LqXMcYk5Jxe5Pgk7_XoY_BxMZQhoA_jJdX6b9QkhdFkyuYdc0IROVzKnG8VzUOM1piBEJMSYZ0wn2u-rHPItXRLy-UjTp9HvZe3s7-LLE_xLZ2S0-YSellcWwx5cLkP573ts354ZCjt4sfc-kEzt035k1gadrXij8pVeCeAIz7NP7DLyrnagiZTSqn0z7bhLPteTbLUXLN5oTQ1pe7pJRYFcxfyOmtzcIw4kroz9KK7i0Gf_qnGoofwmxtMKBApw3f2KpggWYa7b-6R36xZdEQI03ChQ" \
  -d '[{
    "name": "Тест ресторан",
    "pipeline_id": 6932478,
    "status_id": 58311718,
    "created_at": 1741900000,
    "source": { "name": "website_form" },
    "_embedded": {
      "contacts": [{
        "name": "Иван Тестов",
        "custom_fields_values": [
          {
            "field_id": 648827,
            "values": [{ "value": "+79001234567", "enum_id": 1057851 }]
          },
          {
            "field_id": 648829,
            "values": [{ "value": "test@example.com", "enum_id": 1057859 }]
          }
        ]
      }]
    }
  }]'