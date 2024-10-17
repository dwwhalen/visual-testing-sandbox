Pull the latest Playwright container
```
docker pull mcr.microsoft.com/playwright:latest
```


Run thecaontainer, monthing the current directory
``
docker run -it --rm \
  --ipc=host \
  --network=host \
  -v $(pwd):/workspace \
  -w /workspace \
  mcr.microsoft.com/playwright:latest \
  /bin/bash
```

Install the browsers
```
npx playwright install --with-deps
```