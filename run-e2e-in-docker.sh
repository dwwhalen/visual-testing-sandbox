#!/bin/bash

docker run -it --rm \
  --ipc=host \
  -v $(pwd):/workspace \
  -w /workspace \
  -e HOME=/tmp \
  mcr.microsoft.com/playwright:v1.48.0-noble \
  /bin/bash -c "npm run e2e:visual"