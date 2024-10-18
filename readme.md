Pull the latest Playwright container
```
docker pull mcr.microsoft.com/playwright:latest
```


Run the container, mounting the current directory
``
docker run -it --rm \
  --ipc=host \
  -v $(pwd):/workspace \
  -w /workspace \
  mcr.microsoft.com/playwright:latest \
  /bin/bash -c "npx playwright install --with-deps && /bin/bash"
```

Install the browsers
```
npx playwright install --with-deps
```