# Hello World Spec

Goal
- Demonstrate the safe apply flow offline using only whitelisted commands.

Context
- Offline mode: DEV_NO_API=1, USE_PINECONE=0.
- This spec contains a tiny, human-approved run block.

## Run (approved)
- echo "hello from spec"
- ls -1
- head -n 5 ../README.md

## Notes
- Only simple commands are allowed (echo, ls, cat, head).
- To execute, use `!coder-apply --spec 0001 #apply` via /chat or `npm run test:apply:run`.
