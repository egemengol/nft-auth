# Flow and Decisions
1. Server serves a websocket service to the world
    - Should be https, look at ws docs
    - Websocket is used for two-way communication required for the challange feature
2. Client connects using websockets
3. Server sends a challange for signing, for assuring the message just been signed, not from before.
    Akin to taking a photo on request with a weird object configuration for proof.
4. Client signs that challange and sends to the server
5. Server extracts the pubkey from the signature
6. Server asks Infura for ownership information for a given collection
7. Server then checks ownership
8. Logged in!

# Dome
### Server
Create an `.env` file like `.env.template` with infura credentials

```sh
cd server
yarn dev
```

### Client
```sh
cd client
yarn dev
```
