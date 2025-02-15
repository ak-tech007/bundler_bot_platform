'use client'

import { useState } from "react";
import bs58 from "bs58";

export default function Login() {
    const [wallet, setWallet] = useState<string | null>(null);

    const connectWallet = async () => {
        try {
            const provider = (window as any).solana; // Phantom Wallet
            if (!provider) throw new Error("Phantom Wallet not found");

            const response = await provider.connect();
            setWallet(response.publicKey.toString());

            // Generate a nonce (random challenge)
            const nonce = `Sign this message to verify: ${Math.random().toString(36).substring(7)}`;

            // Request user to sign the nonce
            const encodedMessage = new TextEncoder().encode(nonce);
            const signedMessage = await provider.signMessage(encodedMessage, "utf8");

            // Convert signature to Base58
            const signature = bs58.encode(signedMessage.signature);

            console.log(JSON.stringify({ wallet: response.publicKey.toString(), signature, nonce }))

            // Send wallet address, nonce, and signature to backend
            const res = await fetch("/api/authenticate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ wallet: response.publicKey.toString(), signature, nonce }),
            });

            console.log(res)

            // const data = await res.json();
            // if (data.message === "Authenticated") {
            //     alert("✅ Login successful!");
            // } else {
            //     alert("❌ Authentication failed!");
            // }
        } catch (err) {
            console.error(err);
            alert("Error connecting Phantom Wallet");
        }
    };
    return (
        <div>
            {wallet ? <p>Connected as: {wallet}</p> : <button onClick={connectWallet}>Login with Phantom</button>}
        </div>
    );
}
