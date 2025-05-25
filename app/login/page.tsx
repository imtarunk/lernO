"use client"

import { signIn, getSession } from "next-auth/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession()
      if (session) {
        router.push("/home")
      }
    }
    checkSession()
  }, [router])

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/home" })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-blue-600">ShapeUp</CardTitle>
          <CardDescription>Level Up Together</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleGoogleSignIn} className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
            Continue with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
