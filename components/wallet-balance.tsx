"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, RefreshCw, Wallet } from "lucide-react"

interface BalanceData {
  pubkey: string
  balance_sol: number
}

export function WalletBalance() {
  const [pubkey, setPubkey] = useState("")
  const [balance, setBalance] = useState<BalanceData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const fetchBalance = async () => {
    if (!pubkey.trim()) {
      setError("Please enter a valid public key")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://127.0.0.1:8080/balance/${pubkey}`)

      if (!response.ok) {
        throw new Error("Failed to fetch balance")
      }

      const data: BalanceData = await response.json()
      setBalance(data)
    } catch (err) {
      setError("Failed to fetch balance. Make sure your Rust backend is running on port 8080.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-purple-600" />
            Check Wallet Balance
          </CardTitle>
          <CardDescription>Enter a Solana public key to check its balance on devnet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pubkey">Public Key</Label>
            <Input
              id="pubkey"
              placeholder="Enter Solana public key..."
              value={pubkey}
              onChange={(e) => setPubkey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <Button
            onClick={fetchBalance}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching Balance...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Get Balance
              </>
            )}
          </Button>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {balance && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="text-green-800">Balance Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Public Key</Label>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{balance.pubkey}</p>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Balance</Label>
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-green-600">{balance.balance_sol.toFixed(4)}</span>
                <span className="text-lg text-gray-600">SOL</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
