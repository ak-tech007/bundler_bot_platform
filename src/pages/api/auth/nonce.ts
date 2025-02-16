import type { NextApiRequest, NextApiResponse } from "next";
import { randomBytes } from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ message: "Method Not Allowed" });
    }

    const nonce = `Sign this message to verify: ${randomBytes(16).toString("hex")}`; // Generate a random nonce
    res.status(200).json({ nonce });
}
