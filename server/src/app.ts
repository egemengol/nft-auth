import { WebSocketServer } from "ws";
import { generateSlug } from "random-word-slugs";
import { verifySignature } from "./crypto";
import { filterByContract, getAllOwners, getNFTs, isOwner } from "./nft";

async function checkNFTOwnership(walletAddress: string): Promise<boolean> {
  const contractAddress = "0x1A92f7381B9F03921564a437210bB9396471050C";

  // either this way
  const owners = await getAllOwners(contractAddress);
  return isOwner(owners, walletAddress);

  // or this way
  const assets = await getNFTs(walletAddress);
  const interestingAssets = filterByContract(assets, contractAddress);
  return interestingAssets.length > 0;
}

function randomString(nofWords: number = 4): string {
  return generateSlug(nofWords, { format: "lower" });
}

const wss = new WebSocketServer({ port: 8080 });
wss.on("connection", function connection(ws, req) {
  const ip = req.socket.remoteAddress;
  const digest = randomString();

  ws.on("error", console.error);

  ws.on("message", async function message(signatureSerialized: string) {
    console.log("Received signature");
    const pubkey = verifySignature(digest, signatureSerialized);
    console.log("Pubkey == %s", pubkey);
    const isOwner = await checkNFTOwnership(pubkey)
    console.log(`Is ${isOwner ? '' : 'NOT '}owner!\n`)
  });

  ws.send(digest);
  console.log("IP %s | challange: %s", ip, digest);
});

// For testing purposes
(async function() {
  // const isOwner = await checkNFTOwnership("0x61afb0589527fa9e50873284cc9edfbd412e5f23")
  // console.log(`Is ${isOwner ? '' : 'NOT '}owner!\n`)
})()