'use client';
import { useState, useEffect } from "react";
import bs58 from "bs58";
import { useAtom } from "jotai";
import { BalanceAtom, WalletAddress } from "@/store/atom";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const DEVNET_ENDPOINT = "https://api.devnet.solana.com";

export default function WalletLogin() {
    const [balance, setBalance] = useAtom(BalanceAtom);
    const [walletAddress, setWalletAddress] = useAtom(WalletAddress);


    const connectWallet = async () => {

        try {
            const {solana} = window as any;
            if(solana) {
                const response = await solana.connect();
                const publicKeyStr = response.publicKey.toString();
                const connection = new Connection(DEVNET_ENDPOINT);
                const _balance = await connection.getBalance(new PublicKey(publicKeyStr));

                setBalance(_balance / LAMPORTS_PER_SOL)

                // 1️⃣ Get Nonce from Backend
                const nonceRes = await fetch("/api/auth/nonce", { method: "POST" });
                const { nonce } = await nonceRes.json();

                // 2️⃣ Sign Nonce using Phantom
                const encodedMessage = new TextEncoder().encode(nonce);
                const signedMessage = await solana.signMessage(encodedMessage, "utf8");

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
                    setWalletAddress(publicKeyStr);
                } else {
                    alert("❌ Verification failed.");
                }
            }
        } catch (error) {
                console.error("Login error:", error);
            }
    }

    const disconnectWallet = async () => {
        setWalletAddress(null);
        setBalance(null);
    }

    return (
        <>
        <div className=" pt-14 pb-10 flex flex-col items-center gap-2">
            {!walletAddress? (
                <button className="py-3 px-3 rounded-md bg-orange-300 text-lg text-black" onClick={connectWallet}>Wallet Connect</button>) : 
                (<>
                <p>{walletAddress.slice(0,4)}...{walletAddress.slice(-4)}</p>
                <p>{balance} SOL</p>
                <button className="py-3 px-3 rounded-md bg-orange-300 text-lg text-black" onClick={disconnectWallet}>Disconnect Wallet</button>
                </>)}
        </div>
        </>
    );
}
