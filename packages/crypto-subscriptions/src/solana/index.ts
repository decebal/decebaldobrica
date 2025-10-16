/**
 * Solana Pay integration for crypto subscriptions
 * Ultra-low fees (<$0.001) and instant confirmations
 */

import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js'
import {
  encodeURL,
  createQR,
  parseURL,
  validateTransfer,
  FindReferenceError,
  ValidateTransferError,
} from '@solana/pay'
import BigNumber from 'bignumber.js'
import type {
  CreatePaymentRequest,
  PaymentResponse,
  PaymentVerification,
  CryptoSubscriptionError,
} from '../core/types'

export interface SolanaPayConfig {
  network: 'mainnet-beta' | 'devnet' | 'testnet'
  merchantWallet: string
  rpcUrl?: string
}

export class SolanaPayHandler {
  private connection: Connection
  private merchantPublicKey: PublicKey

  constructor(private config: SolanaPayConfig) {
    const rpcUrl = config.rpcUrl || this.getDefaultRpcUrl(config.network)
    this.connection = new Connection(rpcUrl, 'confirmed')
    this.merchantPublicKey = new PublicKey(config.merchantWallet)
  }

  /**
   * Create a Solana Pay payment request
   */
  async createPayment(
    request: CreatePaymentRequest,
    amount: number // in SOL
  ): Promise<PaymentResponse> {
    try {
      // Generate unique reference for this payment
      // Use Keypair to generate a valid Solana public key
      const reference = Keypair.generate().publicKey

      // Create Solana Pay URL
      const url = encodeURL({
        recipient: this.merchantPublicKey,
        amount: new BigNumber(amount),
        reference,
        label: `Subscription: ${request.tier}`,
        message: `${request.interval} subscription payment`,
        memo: `sub:${request.subscriberId}:${request.tier}`,
      })

      // Generate QR code
      const qrCode = await createQR(url, 512, 'transparent')

      const paymentResponse: PaymentResponse = {
        paymentId: reference.toBase58(),
        amount,
        currency: 'SOL',
        chain: 'solana',
        status: 'pending',
        expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        solana: {
          recipient: this.merchantPublicKey.toBase58(),
          reference: reference.toBase58(),
          qrCode: qrCode.toString(),
        },
        metadata: request.metadata,
        createdAt: new Date(),
      }

      return paymentResponse
    } catch (error) {
      throw this.handleError(error, 'Failed to create Solana payment')
    }
  }

  /**
   * Verify a Solana Pay payment by reference
   */
  async verifyPayment(
    referenceId: string,
    expectedAmount: number
  ): Promise<PaymentVerification> {
    try {
      const reference = new PublicKey(referenceId)

      // Find transaction with this reference
      const signatureInfo = await this.connection.getSignaturesForAddress(
        reference,
        { limit: 1 },
        'confirmed'
      )

      if (signatureInfo.length === 0 || !signatureInfo[0]) {
        return {
          verified: false,
          paymentId: referenceId,
          amount: expectedAmount,
          currency: 'SOL',
          chain: 'solana',
          timestamp: new Date(),
          error: 'Payment not found',
        }
      }

      const signatureData = signatureInfo[0]
      const signature = signatureData.signature

      // Validate the transfer
      try {
        await validateTransfer(
          this.connection,
          signature,
          {
            recipient: this.merchantPublicKey,
            amount: new BigNumber(expectedAmount),
            reference,
          },
          { commitment: 'confirmed' }
        )

        return {
          verified: true,
          paymentId: referenceId,
          transactionHash: signature,
          amount: expectedAmount,
          currency: 'SOL',
          chain: 'solana',
          timestamp: new Date((signatureData.blockTime || Date.now() / 1000) * 1000),
        }
      } catch (error) {
        if (error instanceof ValidateTransferError) {
          return {
            verified: false,
            paymentId: referenceId,
            amount: expectedAmount,
            currency: 'SOL',
            chain: 'solana',
            timestamp: new Date(),
            error: `Validation failed: ${error.message}`,
          }
        }
        throw error
      }
    } catch (error) {
      if (error instanceof FindReferenceError) {
        return {
          verified: false,
          paymentId: referenceId,
          amount: expectedAmount,
          currency: 'SOL',
          chain: 'solana',
          timestamp: new Date(),
          error: 'Payment not found',
        }
      }
      throw this.handleError(error, 'Failed to verify Solana payment')
    }
  }

  /**
   * Poll for payment confirmation
   * Useful for webhooks or real-time updates
   */
  async pollPayment(
    referenceId: string,
    expectedAmount: number,
    timeoutMs: number = 60000,
    intervalMs: number = 2000
  ): Promise<PaymentVerification> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeoutMs) {
      const verification = await this.verifyPayment(referenceId, expectedAmount)

      if (verification.verified) {
        return verification
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, intervalMs))
    }

    return {
      verified: false,
      paymentId: referenceId,
      amount: expectedAmount,
      currency: 'SOL',
      chain: 'solana',
      timestamp: new Date(),
      error: 'Payment timeout',
    }
  }

  /**
   * Get current SOL price in USD (using Coingecko API)
   */
  async getSolPriceUSD(): Promise<number> {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd'
      )
      const data = await response.json()
      return data.solana.usd
    } catch (error) {
      throw this.handleError(error, 'Failed to fetch SOL price')
    }
  }

  /**
   * Convert USD to SOL amount
   */
  async convertUSDToSOL(usdAmount: number): Promise<number> {
    const solPrice = await this.getSolPriceUSD()
    return usdAmount / solPrice
  }

  /**
   * Get account balance
   */
  async getBalance(publicKey: string): Promise<number> {
    try {
      const pubkey = new PublicKey(publicKey)
      const balance = await this.connection.getBalance(pubkey)
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      throw this.handleError(error, 'Failed to get balance')
    }
  }

  /**
   * Helper: Get default RPC URL for network
   */
  private getDefaultRpcUrl(network: string): string {
    switch (network) {
      case 'mainnet-beta':
        return 'https://api.mainnet-beta.solana.com'
      case 'devnet':
        return 'https://api.devnet.solana.com'
      case 'testnet':
        return 'https://api.testnet.solana.com'
      default:
        return 'https://api.mainnet-beta.solana.com'
    }
  }

  /**
   * Helper: Handle errors
   */
  private handleError(error: unknown, context: string): Error {
    const message = error instanceof Error ? error.message : String(error)
    return new Error(`${context}: ${message}`)
  }
}
