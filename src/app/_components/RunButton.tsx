'use client'
import { useAtom } from "jotai";
import { WalletAddress, WalletAtom} from "@/store/atom";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { createNewmint } from "@/utils/token"
import base58 from "bs58";
import { createMint } from "@solana/spl-token";

export default function RunButton() {
    const [walletAddress] = useAtom(WalletAddress);
    // Setup connection to Solana Devnet (or mainnet, testnet)
    const connection = new Connection("https://api.devnet.solana.com", "confirmed");


    async function handleRun() {
        if (!walletAddress) {
            alert("No wallet connected!");
            return;
        }

        await createNewmint(walletAddress)

        // const PRIVATE_KEY = wallet.secretKey;
        // const secret = base58.decode(PRIVATE_KEY);
        // const pair = Keypair.fromSecretKey(secret);
        // console.log(pair)

        // const mintAuthority = new PublicKey(wallet.publicKey.toString()); // Use the connected wallet's public key
        // const freezeAuthority = new PublicKey(wallet.publicKey.toString()); // Optional (can be set to a specific public key if needed)
        // const decimals = 6;
    
        // console.log("Wallet Address:", wallet.publicKey.toString());

        // const mintAddress = await createNewmint(connection, wallet, mintAuthority, freezeAuthority, decimals);
        // const tokenMint = await createMint(
        //         connection,
        //         wallet,
        //         mintAuthority,
        //         freezeAuthority,
        //         decimals,
        //     )
        // console.log("Token Mint Address:", tokenMint);
    }

    return (
        <button
            onClick={handleRun}
            className="p-2 bg-green-500 text-white rounded"
        >
            Run
        </button>
    );
}
