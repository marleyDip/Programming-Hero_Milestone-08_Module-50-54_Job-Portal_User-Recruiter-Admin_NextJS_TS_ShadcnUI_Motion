import type { auth } from "@/lib/auth"
import { inferAdditionalFields } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

// `inferAdditionalFields<typeof auth>` pulls in the server schema so fields
// declared in `lib/auth.ts` (e.g. `user.additionalFields.role`) are typed here.
export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,

  plugins: [inferAdditionalFields<typeof auth>()],
})

export const { signIn, signUp, signOut, useSession } = createAuthClient()
