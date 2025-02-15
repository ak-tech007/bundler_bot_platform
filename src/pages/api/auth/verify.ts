import type { NextApiRequest, NextApiResponse } from "next";
import nacl from "tweetnacl";
import bs58 from "bs58";
import * as dotenv from 'dotenv';
dotenv.config()

const ADMIN_WALLET = process.env.ADMIN_WALLET as string;

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const { publicKey, signature, nonce } = req.body;

    if (!publicKey || !signature || !nonce) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    if (publicKey !== ADMIN_WALLET) {
        return res.status(401).json({ message: "Unauthorized wallet" });
    }

    try {
        const isVerified = nacl.sign.detached.verify(
            new TextEncoder().encode(nonce), // Convert nonce to Uint8Array
            bs58.decode(signature), // Decode the signed message
            bs58.decode(publicKey) // Decode the wallet public key
        );

        if (!isVerified) {
            return res.status(401).json({ message: "Signature verification failed" });
        }

        return res.status(200).json({ message: "Authenticated", verified: true });
    } catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ message: "Server error", error: error.message });
        }
        return res.status(500).json({ message: "Server error", error: "Unknown error" });
    }
}