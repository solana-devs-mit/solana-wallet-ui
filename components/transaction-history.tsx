"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, History, Search } from "lucide-react"

interface TransactionSignature {
  signature: string
  slot: number
  err: any
  memo: string | null
  blockTime: number | null
}

export function TransactionHistory() {
  const [pubkey, setPubkey] = useState("")
  const [signatures, setSignatures] = useState<TransactionSignature[]>([])
  const [fullTransactions, setFullTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [activeHistoryTab, setActiveHistoryTab] = useState("signatures")

  const fetchSignatures = async () => {
    if (!pubkey.trim()) {
      setError("Please enter a valid public key")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://127.0.0.1:8080/transaction/${pubkey}`)

      if (!response.ok) {
        throw new Error("Failed to fetch transaction history")
      }

      const data: TransactionSignature[] = await response.json()
      setSignatures(data)
    } catch (err) {
      setError("Failed to fetch transaction history. Make sure your Rust backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const fetchFullHistory = async () => {
    if (!pubkey.trim()) {
      setError("Please enter a valid public key")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch(`http://127.0.0.1:8080/transaction/full/${pubkey}`)

      if (!response.ok) {
        throw new Error("Failed to fetch full transaction history")
      }

      const data = await response.json()
      setFullTransactions(data)
    } catch (err) {
      setError("Failed to fetch full transaction history. Make sure your Rust backend is running.")
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Unknown"
    return new Date(timestamp * 1000).toLocaleString()
  }

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5 text-indigo-600" />
            Transaction History
          </CardTitle>
          <CardDescription>View transaction history for any Solana wallet</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="history-pubkey">Public Key</Label>
            <Input
              id="history-pubkey"
              placeholder="Enter Solana public key..."
              value={pubkey}
              onChange={(e) => setPubkey(e.target.value)}
              className="font-mono text-sm"
            />
          </div>

          <Tabs value={activeHistoryTab} onValueChange={setActiveHistoryTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signatures">Signatures Only</TabsTrigger>
              <TabsTrigger value="full">Full Details</TabsTrigger>
            </TabsList>

            <TabsContent value="signatures" className="mt-4">
              <Button
                onClick={fetchSignatures}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Signatures...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Get Transaction Signatures
                  </>
                )}
              </Button>
            </TabsContent>

            <TabsContent value="full" className="mt-4">
              <Button
                onClick={fetchFullHistory}
                disabled={loading}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Full History...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Get Full Transaction History
                  </>
                )}
              </Button>
            </TabsContent>
          </Tabs>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Transaction Signatures Display */}
      {signatures.length > 0 && activeHistoryTab === "signatures" && (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Transaction Signatures ({signatures.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {signatures.map((sig, index) => (
                <div key={index} className="p-3 border rounded-lg bg-gray-50">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <p className="font-mono text-xs break-all flex-1">{sig.signature}</p>
                    <Badge variant={sig.err ? "destructive" : "default"}>{sig.err ? "Failed" : "Success"}</Badge>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Slot: {sig.slot}</span>
                    <span>{formatDate(sig.blockTime)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Transaction Details Display */}
      {fullTransactions.length > 0 && activeHistoryTab === "full" && (
        <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Full Transaction Details ({fullTransactions.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {fullTransactions.map((tx, index) => (
                <div key={index} className="p-4 border rounded-lg bg-gray-50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">Transaction {index + 1}</Badge>
                      {tx.blockTime && <span className="text-sm text-gray-600">{formatDate(tx.blockTime)}</span>}
                    </div>
                    <div className="bg-gray-100 p-2 rounded">
                      <pre className="text-xs overflow-x-auto">{JSON.stringify(tx, null, 2)}</pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
