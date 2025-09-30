
import { createQR, encodeURL, findReference, validateTransfer, FindReferenceError } from '@solana/pay';
import { Connection, clusterApiUrl, PublicKey, Keypair } from '@solana/web3.js';
import { BigNumber } from 'bignumber.js';

// Devnet connection
const connection = new Connection(clusterApiUrl('devnet'));

// The merchant wallet that will receive the payment
// In production, this would be your actual wallet address
const MERCHANT_WALLET = new PublicKey('3fTR8GGL2mniY4hsAPgBqKvZKXh6MJ7s7gm6QHxzUBji');

export const createSolanaPayment = async (
  amount: number, 
  reference: string, 
  label: string, 
  message: string
): Promise<{ url: string, qrCode: HTMLDivElement }> => {
  // URL for Solana Pay transfer
  const url = encodeURL({
    recipient: MERCHANT_WALLET,
    amount: new BigNumber(amount * 10 ** 9), // Convert to lamports (1 SOL = 10^9 lamports) as BigNumber
    reference: new PublicKey(reference),
    label,
    message,
  });

  // Create QR code from the URL
  const qrCode = createQR(url);
  const qrElement = document.createElement('div');
  qrCode.append(qrElement);
  
  return { url: url.toString(), qrCode: qrElement };
};

export const checkSolanaPayment = async (
  reference: PublicKey, 
  amount: number,
  onSuccess: () => void,
  onError: (error: string) => void
): Promise<void> => {
  try {
    // Check if there's a transaction for the reference
    const signatureInfo = await findReference(connection, reference);
    
    // Validate the transaction
    await validateTransfer(
      connection,
      signatureInfo.signature,
      {
        recipient: MERCHANT_WALLET,
        amount: new BigNumber(amount * 10 ** 9), // Convert to lamports as BigNumber
        reference,
      }
    );
    
    // Payment is valid
    onSuccess();
  } catch (e) {
    if (e instanceof FindReferenceError) {
      // No transaction found yet
      onError("Payment not found. Please complete the payment.");
    } else {
      // Another error
      onError(`Error validating payment: ${e.message}`);
    }
  }
};

export const generateUniqueReference = (): PublicKey => {
  // Generate a new keypair as a unique reference
  const reference = Keypair.generate().publicKey;
  return reference;
};
