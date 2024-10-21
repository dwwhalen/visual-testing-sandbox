#!/bin/bash

docker run -it --rm \
  --ipc=host \
  -v $(pwd):/workspace \
  -w /workspace \
  -e HOME=/tmp \
  mcr.microsoft.com/playwright:latest \
  /bin/bash -c "npx playwright install --with-deps && npm run e2e:visual"