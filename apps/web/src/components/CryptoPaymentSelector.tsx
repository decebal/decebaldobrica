'use client'

import { Badge } from '@decebal/ui/badge'
import { Button } from '@decebal/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@decebal/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@decebal/ui/select'
import {
  CRYPTO_PAYMENT_METHODS,
  type CryptoPaymentMethod,
  L2_NETWORKS,
  PAYMENT_GATEWAYS,
  estimateTransactionFee,
  recommendPaymentMethod,
} from '@/lib/cryptoPayments'
import { CheckCircle2, Info, Shield, Zap } from 'lucide-react'
import { useState } from 'react'

interface CryptoPaymentSelectorProps {
  amountUsd: number
  onPaymentMethodSelected: (method: CryptoPaymentMethod, network?: string) => void
}

export default function CryptoPaymentSelector({
  amountUsd,
  onPaymentMethodSelected,
}: CryptoPaymentSelectorProps) {
  const [selectedMethod, setSelectedMethod] = useState<CryptoPaymentMethod | null>(null)
  const [selectedNetwork, setSelectedNetwork] = useState<string>('mainnet')

  const recommendation = recommendPaymentMethod(amountUsd)

  const handleSelectMethod = (method: CryptoPaymentMethod) => {
    setSelectedMethod(method)
    // Auto-select optimal network
    if (method === 'eth') {
      setSelectedNetwork('arbitrum')
    } else if (method === 'usdc') {
      setSelectedNetwork('polygon')
    } else if (method === 'btc') {
      setSelectedNetwork('lightning')
    }
  }

  const handleProceed = () => {
    if (selectedMethod) {
      onPaymentMethodSelected(selectedMethod, selectedNetwork)
    }
  }

  return (
    <div className="space-y-6">
      {/* Recommendation Banner */}
      <Card className="bg-brand-teal/10 border-brand-teal/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-brand-teal" />
            <CardTitle className="text-white text-lg">Recommended for You</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white font-semibold">
                {CRYPTO_PAYMENT_METHODS[recommendation.primary].name}
                {CRYPTO_PAYMENT_METHODS[recommendation.primary].network && (
                  <span className="text-sm text-gray-400 ml-2">
                    via {CRYPTO_PAYMENT_METHODS[recommendation.primary].network}
                  </span>
                )}
              </p>
              <p className="text-sm text-gray-300 mt-1">{recommendation.reasoning}</p>
              <p className="text-xs text-brand-teal mt-1">
                Est. fee: {CRYPTO_PAYMENT_METHODS[recommendation.primary].feeEstimate}
              </p>
            </div>
            <Button
              onClick={() => handleSelectMethod(recommendation.primary)}
              className="bg-brand-teal hover:bg-brand-teal/80"
            >
              Use This
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Payment Methods */}
      <div>
        <h3 className="text-lg font-semibold text-white mb-4">Or Choose Your Preferred Method</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {Object.values(CRYPTO_PAYMENT_METHODS).map((method) => {
            const fee = estimateTransactionFee(method.id, selectedNetwork)
            const isSelected = selectedMethod === method.id

            return (
              <Card
                key={method.id}
                className={`cursor-pointer transition-all ${
                  isSelected
                    ? 'border-brand-teal shadow-lg shadow-brand-teal/20 bg-brand-teal/5'
                    : 'border-white/10 hover:border-brand-teal/50 bg-white/5'
                }`}
                onClick={() => handleSelectMethod(method.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        <span className="text-2xl">{method.icon}</span>
                        {method.name}
                        {method.recommended && (
                          <Badge className="bg-brand-teal/20 text-brand-teal border-0">
                            Recommended
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription className="text-gray-400 mt-1">
                        {method.description}
                      </CardDescription>
                    </div>
                    {isSelected && <CheckCircle2 className="h-6 w-6 text-brand-teal" />}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {method.network && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Network:</span>
                        <span className="text-white">{method.network}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Est. Fee:</span>
                      <span className="text-brand-teal font-semibold">{method.feeEstimate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Network Selector for ETH/USDC */}
      {selectedMethod && (selectedMethod === 'eth' || selectedMethod === 'usdc') && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Select Network (Fee Optimization)</CardTitle>
            <CardDescription>Choose a Layer 2 network for lower fees</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="polygon">Polygon (MATIC) - ~$0.01-0.10 fee</SelectItem>
                <SelectItem value="arbitrum">Arbitrum - ~$0.01-0.50 fee</SelectItem>
                <SelectItem value="base">Base - ~$0.01-0.30 fee</SelectItem>
                <SelectItem value="mainnet">
                  Ethereum Mainnet - ~$2-10 fee (not recommended)
                </SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Network Selector for BTC */}
      {selectedMethod === 'btc' && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white text-lg">Bitcoin Network</CardTitle>
            <CardDescription>Lightning Network for instant, low-fee payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={selectedNetwork} onValueChange={setSelectedNetwork}>
              <SelectTrigger className="bg-white/5 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lightning">
                  Lightning Network - ~$0.001 fee (recommended)
                </SelectItem>
                <SelectItem value="mainnet">Bitcoin Mainnet - ~$1-5 fee</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Payment Gateway Info */}
      {selectedMethod && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-brand-teal" />
              <CardTitle className="text-white text-lg">Recommended Payment Gateways</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PAYMENT_GATEWAYS.filter((gateway) =>
                gateway.supportedCurrencies.includes(selectedMethod)
              )
                .slice(0, 3)
                .map((gateway) => (
                  <div
                    key={gateway.name}
                    className="p-4 bg-white/5 rounded-lg border border-white/10"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white flex items-center gap-2">
                          {gateway.name}
                          {gateway.recommended && (
                            <Badge className="bg-brand-teal/20 text-brand-teal border-0 text-xs">
                              Best Value
                            </Badge>
                          )}
                        </h4>
                        <p className="text-xs text-gray-400">Fees: {gateway.fees}</p>
                      </div>
                      {gateway.setupUrl && (
                        <a
                          href={gateway.setupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-brand-teal hover:underline text-xs"
                        >
                          Learn More →
                        </a>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <p className="text-green-500 font-semibold mb-1">Pros:</p>
                        <ul className="text-gray-400 space-y-0.5">
                          {gateway.pros.slice(0, 2).map((pro, i) => (
                            <li key={i}>• {pro}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-yellow-500 font-semibold mb-1">Cons:</p>
                        <ul className="text-gray-400 space-y-0.5">
                          {gateway.cons.slice(0, 2).map((con, i) => (
                            <li key={i}>• {con}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Proceed Button */}
      {selectedMethod && (
        <div className="flex justify-end">
          <Button
            onClick={handleProceed}
            size="lg"
            className="bg-brand-teal hover:bg-brand-teal/80 text-white"
          >
            <Shield className="mr-2 h-5 w-5" />
            Proceed with {CRYPTO_PAYMENT_METHODS[selectedMethod].name}
          </Button>
        </div>
      )}
    </div>
  )
}
