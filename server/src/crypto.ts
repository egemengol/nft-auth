import { SigningKey, hashMessage, Signature } from "ethers";

export function verifySignature(challange: string, signatureSerialized: string): string {
  const signature = Signature.from(JSON.parse(signatureSerialized));
  const pubkey = SigningKey.recoverPublicKey(hashMessage(challange), signature);
  return pubkey;
}
