import {
  createInitializeMint2Instruction,
    createInitializeMintInstruction,
    getMinimumBalanceForRentExemptMint,
    MINT_SIZE,
    TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
  import {
    clusterApiUrl,
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
  } from "@solana/web3.js";
  
  
  export const createNewmint = async (walletAddress: string) => {
    try {
      const { solana } = window as any;
      if (!solana || !solana.isPhantom)
        throw new Error("Phantom wallet not found");
      if (!walletAddress) {
        throw new Error("Wallet is not connected");
      }

      // Connect to Phantom Wallet
      const response = await solana.connect();
      console.log("Connected wallet:", response.publicKey.toString());

      // Establish connection to Solana devnet
      const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
      const phantomPublicKey = new PublicKey(walletAddress);

      const programId = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
      const decimals = 6;
      const lamports = await getMinimumBalanceForRentExemptMint(connection);

      // Generate a new keypair for the mint account
      const mintAccount = Keypair.generate();

      const transaction = new Transaction().add(
        SystemProgram.createAccount({
            fromPubkey: phantomPublicKey,
            newAccountPubkey: mintAccount.publicKey,
            space: MINT_SIZE,
            lamports,
            programId,
        }),
        createInitializeMint2Instruction(mintAccount.publicKey, decimals, phantomPublicKey, phantomPublicKey, programId),
    );

      // Set the recent blockhash and fee payer
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = phantomPublicKey;

      // Request Phantom Wallet to sign and send the transaction
      const { signature } = await solana.signAndSendTransaction(transaction);

      // Log the transaction signature
      console.log("Transaction signature:", signature);

      // Confirm the transaction
      const transactionConfirmation = await connection.confirmTransaction(signature);
      console.log("Transaction confirmed:", transactionConfirmation);

      // Log the mint account address
      console.log("Mint account created:", mintAccount.publicKey.toString());
    } catch (error: unknown) {
      console.error(
        "Transaction failed:",
        error
      );
    }
  };