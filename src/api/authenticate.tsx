import { NextApiRequest, NextApiResponse } from "next";
import nacl from "tweetnacl";
import bs58 from "bs58";
import * as dotenv from 'dotenv';

dotenv.config()

// Store the predefined admin wallet address securely (use .env)
const ADMIN_WALLET = process.env.ADMIN_WALLET;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { wallet, signature, nonce } = req.body;

        // Step 1: Ensure the wallet is the admin's wallet
        if (wallet !== ADMIN_WALLET) {
            return res.status(401).json({ error: "Unauthorized wallet" });
        }

        try {
            // Step 2: Verify signature using tweetnacl
            const isValid = nacl.sign.detached.verify(
                new TextEncoder().encode(nonce), // Convert nonce to bytes
                bs58.decode(signature), // Decode the signature
                bs58.decode(wallet) // Decode the public key (wallet address)
            );

            if (isValid) {
                // Step 3: Authentication successful
                return res.status(200).json({ message: "Authenticated" });
            } else {
                return res.status(400).json({ error: "Invalid signature" });
            }
        } catch (error) {
            return res.status(500).json({ error: "Server error" });
        }
    } else {
        return res.status(405).json({ error: "Method not allowed" });
    }
}
