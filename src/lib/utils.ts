import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * FNV-1a 32-bit Hash Implementation
 * Ported from User's Python specification for the "Neural Bridge" hashing
 */
export function fnv1a32Hash(data: string | Uint8Array): number {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  
  // 1. The 32-bit Offset Basis
  let hashValue = 0x811c9dc5;
  
  // 2. The 32-bit Magic PrimeTime (User's custom variant: 0x0101000193)
  const fnvPrime = BigInt('0x0101000193');
  
  for (let i = 0; i < bytes.length; i++) {
    // 3. The XOR step
    hashValue ^= bytes[i];
    
    // 4. The Multiply step
    const mult = BigInt(hashValue) * fnvPrime;
    hashValue = Number(mult & BigInt(0xffffffff));
  }
  
  return hashValue >>> 0; // Return as unsigned 32-bit int
}

export function formatAddress(address: string): string {
  if (!address) return 'NOT_LINKED';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}
