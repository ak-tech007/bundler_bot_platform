'use client';
import { useState, useEffect } from "react";
import bs58 from "bs58";
import { Connection, clusterApiUrl } from "@solana/web3.js";

export default function WalletLogin() {
    const [wallet, setWallet] = useState<any>(null);
    const [publicKey, setPublicKey] = useState<string | null>(null);
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        if ("solana" in window) {
            setWallet((window as any).solana);
        }
    }, []);

    const handleLogin = async () => {
        if (!wallet) return alert("Phantom Wallet not found! Install it.");

        try {
            const response = await wallet.connect();
            const publicKeyStr = response.publicKey.toString();
            setPublicKey(publicKeyStr);

            // 1️⃣ Get Nonce from Backend
            const nonceRes = await fetch("/api/auth/nonce", { method: "POST" });
            const { nonce } = await nonceRes.json();

            console.log("Nonce:", nonce);

            // 2️⃣ Sign Nonce using Phantom
            const encodedMessage = new TextEncoder().encode(nonce);
            const signedMessage = await wallet.signMessage(encodedMessage, "utf8");

            console.log("Signed Message:", signedMessage.signature);

            // 3️⃣ Send Signature to Backend for Verification
            const verifyRes = await fetch("/api/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    publicKey: publicKeyStr,
                    signature: bs58.encode(signedMessage.signature),
                    nonce,
                }),
            });

            const { verified } = await verifyRes.json();
            if (verified) {
                setLoggedIn(true);
                alert("✅ Wallet authenticated successfully!");
            } else {
                alert("❌ Verification failed.");
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("❌ Authentication failed.");
        }
    };

    return (
        <div>
            {loggedIn ? (
                <p>✅ Logged in as: {publicKey}</p>
            ) : (
                <button onClick={handleLogin}>Login with Phantom</button>
            )}
        </div>
    );
}
