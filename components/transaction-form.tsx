"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Send, CheckCircle } from "lucide-react"

interface TransactionResult {
  signature: string
  sender_balance_sol: number
  receiver_balance_sol: number
}

export function TransactionForm() {
  const [payerId, setPayerId] = useState("")
  const [receiverId, setReceiverId] = useState("")
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<TransactionResult | null>(null)

  const handleTransaction = async () => {
    if (!payerId.trim() || !receiverId.trim() || !amount.trim()) {
      setError("Please fill in all fields")
      return
    }

    const amountNum = Number.parseFloat(amount)
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid amount")
      return
    }

    setLoading(true)
    setError("")
    setResult(null)

    try {
      const response = await fetch("http://127.0.0.1:8080/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payer_id: payerId,
          reciever_id: receiverId,
          amount_in_sol: amountNum,
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Transaction failed")
      }

      const data: TransactionResult = await response.json()
      setResult(data)

      // Clear form on success
      setPayerId("")
      setReceiverId("")
      setAmount("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Transaction failed. Make sure your Rust backend is running.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5 text-blue-600" />
            Send SOL Transaction
          </CardTitle>
          <CardDescription>Transfer SOL between wallets on devnet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="payer">Sender Keypair Path</Label>
            <Input
              id="payer"
              placeholder="Path to sender's keypair file (e.g., /path/to/keypair.json)"
              value={payerId}
              onChange={(e) => setPayerId(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receiver">Receiver Public Key</Label>
            <Input
              id="receiver"
              placeholder="Receiver's public key"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (SOL)</Label>
            <Input
              id="amount"
              type="number"
              step="0.0001"
              placeholder="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <Button
            onClick={handleTransaction}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing Transaction...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Send Transaction
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

      {result && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <CheckCircle className="h-5 w-5" />
              Transaction Successful
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-600">Transaction Signature</Label>
              <p className="font-mono text-sm bg-gray-100 p-2 rounded break-all">{result.signature}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Sender Balance</Label>
                <p className="text-lg font-semibold text-blue-600">{result.sender_balance_sol.toFixed(4)} SOL</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-600">Receiver Balance</Label>
                <p className="text-lg font-semibold text-green-600">{result.receiver_balance_sol.toFixed(4)} SOL</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
