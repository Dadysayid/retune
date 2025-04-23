"use client"

import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { supabase } from "../../src/supabaseClient"

export default function AuthPage() {
  return (
    <div style={{ maxWidth: "420px", margin: "100px auto" }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={["google"]} // facultatif
      />
    </div>
  )
}
