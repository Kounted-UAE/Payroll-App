// lib/scripts/extract-supabase-types.ts

import "dotenv/config"
import { execSync } from "child_process"

// Prefer new envs; derive project ref from NEXT_PUBLIC_SUPABASE_URL if not provided
const token = process.env.SUPABASE_ACCESS_TOKEN || ""
let projectRef = process.env.SUPABASE_PROJECT_ID || ""

if (!projectRef) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || ""
  try {
    if (url) {
      const host = new URL(url).host
      // Project ref is the subdomain before .supabase.co
      projectRef = host.split(".")[0]
    }
  } catch {}
}

if (!projectRef) {
  console.error("❌ Could not determine Supabase project ref.")
  console.error("→ Set NEXT_PUBLIC_SUPABASE_URL (preferred) or SUPABASE_PROJECT_ID in .env")
  process.exit(1)
}

try {
  console.log(`▶️ Generating Supabase types for project: ${projectRef} (schema: public)`) 

  const prefix = token ? `SUPABASE_ACCESS_TOKEN=${token} ` : ""
  execSync(
    `${prefix}supabase gen types typescript --project-id ${projectRef} --schema public > lib/types/supabase.ts`,
    { stdio: "inherit" }
  )

  console.log("✅ Supabase types generated successfully at lib/types/supabase.ts")
  console.log("📎 You can now import and use `Database` from that file.")
} catch (err) {
  console.error("❌ Failed to generate Supabase types.")
  console.error(String(err))
  process.exit(1)
}
