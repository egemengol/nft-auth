import { WebSocket } from "ws";
import { SigningKey, hashMessage, id } from "ethers";

/* This SigningKey just creates a private&public key pair 
 * You will use metamask for this purpose
*/

const key = new SigningKey(id("some-secret"))

const ws = new WebSocket("ws://localhost:8080");

ws.on("error", console.error);

ws.on("message", (digest: string) => {
    console.log("Working with randomized digest: %s", digest)
    const sig = key.sign(hashMessage(digest))
    console.log("Sending signature")
    ws.send(JSON.stringify(sig.toJSON()))
    console.log("Auth complete")
    console.log("Pubkey == %s", key.publicKey)
    ws.close()
})
