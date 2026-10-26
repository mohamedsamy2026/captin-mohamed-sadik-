import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Tailwind CSS v4: بيشتغل كـ plugin مع Vite، ومفيش tailwind.config.js ولا postcss.config.js
export default defineConfig({
  plugins: [react(), tailwindcss()],
})
