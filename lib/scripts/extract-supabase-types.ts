// lib/scripts/extract-supabase-types.ts

import "dotenv/config"
import { execSync } from "child_process"
import { join } from "path"

const token = process.env.SUPABASE_ACCESS_TOKEN
const projectId = process.env.SUPABASE_PROJECT_ID

if (!token || !projectId) {
  console.error("❌ Missing required environment variables.")
  if (!token) console.error("→ SUPABASE_ACCESS_TOKEN not set in .env")
  if (!projectId) console.error("→ SUPABASE_PROJECT_ID not set in .env")
  process.exit(1)
}

try {
  console.log(`▶️ Generating Supabase types for project: ${projectId} (schema: public)`)

  execSync(
    `SUPABASE_ACCESS_TOKEN=${token} supabase gen types typescript --project-id ${projectId} --schema public > lib/types/supabase.ts`,
    { stdio: "inherit" }
  )

  console.log("✅ Supabase types generated successfully at lib/types/supabase.ts")
  console.log("📎 You can now import and use `Database` from that file.")
} catch {
  console.error("❌ Failed to generate Supabase types.")
  process.exit(1)
}
