import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

// ✅ Persisted wallet address using localStorage
export const WalletAddress = atomWithStorage<string | null>("walletAddress", null);

// ✅ Persisted balance using localStorage
export const BalanceAtom = atomWithStorage<number | null>("walletBalance", null);

// ✅ Phantom Wallet Connection Atom
export const WalletAtom = atomWithStorage<any | null>("wallet", null);

