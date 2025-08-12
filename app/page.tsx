"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wallet, Send, History } from "lucide-react"
import { WalletBalance } from "@/components/wallet-balance"
import { TransactionForm } from "@/components/transaction-form"
import { TransactionHistory } from "@/components/transaction-history"

export default function SolanaWalletDashboard() {
  const [activeTab, setActiveTab] = useState("balance")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Solana Wallet
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Manage your Solana devnet wallet with ease</p>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Devnet Connected
          </Badge>
        </div>

        {/* Main Dashboard */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="balance" className="flex items-center gap-2">
              <Wallet className="h-4 w-4" />
              Balance
            </TabsTrigger>
            <TabsTrigger value="transfer" className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Transfer
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="h-4 w-4" />
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="balance">
            <WalletBalance />
          </TabsContent>

          <TabsContent value="transfer">
            <TransactionForm />
          </TabsContent>

          <TabsContent value="history">
            <TransactionHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
