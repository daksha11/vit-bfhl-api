# VIT BFHL API (Node.js on Vercel)

This is a minimal REST API built to satisfy the VIT Full Stack Question Paper requirements.

## 📌 Features
- POST `/bfhl`
- Returns:
  - `is_success` → true/false
  - `user_id` → `{full_name_ddmmyyyy}` (full_name in lowercase, underscores instead of spaces)
  - `email` → from env
  - `roll_number` → from env
  - `odd_numbers` → all odd numbers (strings)
  - `even_numbers` → all even numbers (strings)
  - `alphabets` → all alphabet strings converted to uppercase
  - `special_characters` → all non-alphanumeric values
  - `sum` → sum of all numbers (as string)
  - `concat_string` → concatenation of all letters across input, reversed, alternating caps (starting uppercase)

## ⚙️ Environment Variables
Configure these in the **Vercel Dashboard** under **Project → Settings → Environment Variables**:

- `FULL_NAME` → e.g., `John Doe`
- `DOB_DDMMYYYY` → e.g., `17091999`
- `EMAIL` → e.g., `john@xyz.com`
- `ROLL_NUMBER` → e.g., `ABCD123`

## 🚀 Deployment
1. Push this repo to GitHub.
2. Import it into [Vercel](https://vercel.com).
3. Add the environment variables above.
4. Deploy.

Your API will be live at:
```
POST https://<your-project>.vercel.app/bfhl
```

## 🖥️ Local Development
Install the Vercel CLI:
```bash
npm i -g vercel
vercel login
```

Run locally:
```bash
vercel dev
```

Test with curl:
```bash
curl -s -X POST http://localhost:3000/bfhl   -H "Content-Type: application/json"   -d '{"data":["a","1","334","4","R","$"]}'
```

Expected response (example):
```json
{
  "is_success": true,
  "user_id": "john_doe_17091999",
  "email": "john@xyz.com",
  "roll_number": "ABCD123",
  "odd_numbers": ["1"],
  "even_numbers": ["334", "4"],
  "alphabets": ["A", "R"],
  "special_characters": ["$"],
  "sum": "339",
  "concat_string": "Ra"
}
```

---
✅ Minimal, production-ready, and deployable in **under an hour**.
