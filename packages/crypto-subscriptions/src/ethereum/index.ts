/**
 * Ethereum L2 integration for crypto subscriptions
 * Supports Base, Arbitrum, and Optimism with low fees ($0.01-$0.50)
 * Native ETH and USDC payments
 */

import {
  createPublicClient,
  createWalletClient,
  http,
  parseEther,
  parseUnits,
  type Address,
  type Hash,
  type PublicClient,
  type TransactionReceipt,
} from 'viem'
import { base, arbitrum, optimism } from 'viem/chains'
import type {
  CreatePaymentRequest,
  PaymentResponse,
  PaymentVerification,
} from '../core/types'

export type L2Network = 'base' | 'arbitrum' | 'optimism'

export interface EthereumConfig {
  network: L2Network
  merchantWallet: Address
  rpcUrl?: string
  usdcTokenAddress?: Address
}

// USDC contract addresses on different L2s
const USDC_ADDRESSES: Record<L2Network, Address> = {
  base: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  arbitrum: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  optimism: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
}

// ERC-20 ABI for USDC transfers
const ERC20_ABI = [
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    type: 'function',
  },
] as const

export class EthereumHandler {
  private publicClient: PublicClient
  private chain: typeof base | typeof arbitrum | typeof optimism
  private usdcAddress: Address

  constructor(private config: EthereumConfig) {
    // Select chain
    this.chain = this.getChain(config.network)
    this.usdcAddress = config.usdcTokenAddress || USDC_ADDRESSES[config.network]

    // Create public client for reading blockchain data
    this.publicClient = createPublicClient({
      chain: this.chain,
      transport: http(config.rpcUrl || this.chain.rpcUrls.default.http[0]),
    }) as PublicClient
  }

  /**
   * Create an Ethereum L2 payment request
   */
  async createPayment(
    request: CreatePaymentRequest,
    amount: number,
    currency: 'ETH' | 'USDC' = 'ETH'
  ): Promise<PaymentResponse> {
    try {
      // Generate unique reference
      const reference = crypto.randomUUID()

      // For Ethereum, we create a payment request that user executes in their wallet
      const paymentResponse: PaymentResponse = {
        paymentId: reference,
        amount,
        currency,
        chain: 'ethereum',
        status: 'pending',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        ethereum: {
          recipient: this.config.merchantWallet,
          chainId: this.chain.id,
          token: currency === 'USDC' ? this.usdcAddress : undefined,
          qrCode: this.generatePaymentQR(
            this.config.merchantWallet,
            amount,
            currency
          ),
        },
        metadata: {
          ...request.metadata,
          reference,
        },
        createdAt: new Date(),
      }

      return paymentResponse
    } catch (error) {
      throw new Error(`Failed to create Ethereum payment: ${error}`)
    }
  }

  /**
   * Verify an Ethereum L2 payment by transaction hash
   */
  async verifyPayment(
    txHash: Hash,
    expectedAmount: number,
    currency: 'ETH' | 'USDC' = 'ETH'
  ): Promise<PaymentVerification> {
    try {
      // Get transaction receipt
      const receipt = await this.publicClient.getTransactionReceipt({
        hash: txHash,
      })

      if (!receipt) {
        return {
          verified: false,
          paymentId: txHash,
          amount: expectedAmount,
          currency,
          chain: 'ethereum',
          timestamp: new Date(),
          error: 'Transaction not found',
        }
      }

      // Check if transaction was successful
      if (receipt.status !== 'success') {
        return {
          verified: false,
          paymentId: txHash,
          transactionHash: txHash,
          amount: expectedAmount,
          currency,
          chain: 'ethereum',
          timestamp: new Date(),
          error: 'Transaction failed',
        }
      }

      // Get transaction details
      const transaction = await this.publicClient.getTransaction({
        hash: txHash,
      })

      // Verify recipient and amount
      const isCorrectRecipient = transaction.to?.toLowerCase() ===
        this.config.merchantWallet.toLowerCase()

      let isCorrectAmount = false

      if (currency === 'ETH') {
        const receivedAmount = Number(transaction.value) / 1e18
        isCorrectAmount = Math.abs(receivedAmount - expectedAmount) < 0.0001 // Small tolerance
      } else {
        // For USDC, parse the transaction logs
        isCorrectAmount = await this.verifyUSDCTransfer(receipt, expectedAmount)
      }

      if (!isCorrectRecipient || !isCorrectAmount) {
        return {
          verified: false,
          paymentId: txHash,
          transactionHash: txHash,
          amount: expectedAmount,
          currency,
          chain: 'ethereum',
          timestamp: new Date(),
          error: 'Incorrect recipient or amount',
        }
      }

      // Get block timestamp
      const block = await this.publicClient.getBlock({
        blockNumber: receipt.blockNumber,
      })

      return {
        verified: true,
        paymentId: txHash,
        transactionHash: txHash,
        amount: expectedAmount,
        currency,
        chain: 'ethereum',
        timestamp: new Date(Number(block.timestamp) * 1000),
      }
    } catch (error) {
      return {
        verified: false,
        paymentId: txHash,
        amount: expectedAmount,
        currency,
        chain: 'ethereum',
        timestamp: new Date(),
        error: `Verification failed: ${error}`,
      }
    }
  }

  /**
   * Poll for payment confirmation by monitoring merchant wallet
   */
  async pollPayment(
    initialBalance: bigint,
    expectedAmount: number,
    currency: 'ETH' | 'USDC' = 'ETH',
    timeoutMs: number = 300000, // 5 minutes
    intervalMs: number = 5000 // 5 seconds
  ): Promise<PaymentVerification> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeoutMs) {
      try {
        const currentBalance = await this.getBalance(
          this.config.merchantWallet,
          currency
        )

        const received = Number(currentBalance - initialBalance) /
          (currency === 'ETH' ? 1e18 : 1e6)

        if (Math.abs(received - expectedAmount) < 0.0001) {
          return {
            verified: true,
            paymentId: 'balance-check',
            amount: expectedAmount,
            currency,
            chain: 'ethereum',
            timestamp: new Date(),
          }
        }
      } catch (error) {
        console.error('Error polling balance:', error)
      }

      await new Promise(resolve => setTimeout(resolve, intervalMs))
    }

    return {
      verified: false,
      paymentId: 'balance-check',
      amount: expectedAmount,
      currency,
      chain: 'ethereum',
      timestamp: new Date(),
      error: 'Payment timeout',
    }
  }

  /**
   * Get wallet balance (ETH or USDC)
   */
  async getBalance(address: Address, currency: 'ETH' | 'USDC' = 'ETH'): Promise<bigint> {
    if (currency === 'ETH') {
      return await this.publicClient.getBalance({ address })
    } else {
      return await this.publicClient.readContract({
        address: this.usdcAddress,
        abi: ERC20_ABI,
        functionName: 'balanceOf',
        args: [address],
      }) as bigint
    }
  }

  /**
   * Get current ETH price in USD
   */
  async getEthPriceUSD(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd'
      )
      const data = await response.json()
      return data.ethereum.usd
    } catch (error) {
      throw new Error(`Failed to fetch ETH price: ${error}`)
    }
  }

  /**
   * Convert USD to ETH
   */
  async convertUSDToETH(usdAmount: number): Promise<number> {
    const ethPrice = await this.getEthPriceUSD()
    return usdAmount / ethPrice
  }

  /**
   * Estimate gas fees for a transaction
   */
  async estimateGasFees(currency: 'ETH' | 'USDC' = 'ETH'): Promise<{
    gasPrice: string
    estimatedFee: string
    usdValue: string
  }> {
    try {
      const gasPrice = await this.publicClient.getGasPrice()
      const gasLimit = currency === 'ETH' ? 21000n : 65000n // Higher for ERC-20

      const totalGas = gasPrice * gasLimit
      const ethFee = Number(totalGas) / 1e18

      const ethPrice = await this.getEthPriceUSD()
      const usdValue = ethFee * ethPrice

      return {
        gasPrice: `${Number(gasPrice) / 1e9} Gwei`,
        estimatedFee: `${ethFee.toFixed(6)} ETH`,
        usdValue: `$${usdValue.toFixed(2)}`,
      }
    } catch (error) {
      throw new Error(`Failed to estimate gas: ${error}`)
    }
  }

  // ============= Helper Methods =============

  private getChain(network: L2Network) {
    switch (network) {
      case 'base':
        return base
      case 'arbitrum':
        return arbitrum
      case 'optimism':
        return optimism
      default:
        return base
    }
  }

  private generatePaymentQR(
    recipient: Address,
    amount: number,
    currency: 'ETH' | 'USDC'
  ): string {
    // Generate EIP-681 payment URL
    const tokenParam = currency === 'USDC' ? `/transfer?address=${this.usdcAddress}&` : '?'
    const amountParam = currency === 'ETH'
      ? `value=${amount}e18`
      : `uint256=${amount}e6`

    const url = `ethereum:${recipient}${tokenParam}${amountParam}`

    // In production, generate actual QR code image
    // For now, return the URL (can be used with QR libraries)
    return url
  }

  private async verifyUSDCTransfer(
    receipt: TransactionReceipt,
    expectedAmount: number
  ): Promise<boolean> {
    // Parse Transfer event logs for USDC
    const transferTopic = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

    const transferLog = receipt.logs.find(
      log => log.topics[0] === transferTopic &&
             log.address.toLowerCase() === this.usdcAddress.toLowerCase()
    )

    if (!transferLog || !transferLog.data) {
      return false
    }

    // Decode amount from log data (USDC has 6 decimals)
    const amount = BigInt(transferLog.data)
    const receivedAmount = Number(amount) / 1e6

    return Math.abs(receivedAmount - expectedAmount) < 0.01 // Small tolerance
  }
}
