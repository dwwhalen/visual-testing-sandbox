# Intro

So, what’s the big deal with visual testing, and how is it different from functional testing?

Visual testing is all about comparing an ACTUAL web page to an EXPECTED (baseline) image. Unlike functional testing, which checks if your app *works* as expected, visual testing focuses on how your web pages *look*. 

Many times visual testing is done manually, but you can (and should) automate it where appropriate using tools like Playwright. 

While Playwright is known for functional testing, it also comes with a really straightforward API that lets you take screenshots and compare them to baseline images automatically. This way, you can easily make sure your app looks just right without spending hours staring at the screen yourself.

# Visual Testing Challenges

Visual testing can be super useful, but like anything else, it has its challenges. Here are two big ones:

## Challenge #1: Consistent Looks Across Browsers/OS/viewport
One of the trickiest parts of visual testing is making sure your app looks good across different browsers, operating systems, and screen resolutions. What looks perfect in Chrome on your MacBook might not look great in Safari on your iPhone 12.

## Challenge #2: Dynamic Content
Web apps often have dynamic content that changes frequently. This makes maintaining baseline images for visual testing a bit of a headache.

Luckily, Playwright has some great features to help with these challenges, so let’s dig into how it works.

# A Basic Example

Let’s start with a simple example to show how easy it is to set up visual testing with Playwright. If you want to see all the details, I’ve got a [sample repo](https://github.com/dwwhalen/visual-testing-sandbox) with a basic ToDo app and some Playwright tests to go with it. Here’s the first test I wrote:

```typescript
test.beforeEach(async ({ page }) => {
    page.goto('/');
});

test.describe('New Todo', () => {
  test('@visual should allow me to add todo items', async ({ page }) => {
    await expect(page).toHaveScreenshot('landing page');
  });
});
```

This test is pretty basic.  It just navigates to the application's home page and then uses Playwright's `toHaveScreenshot()` function to grab a screenshot of the page and compare it to the baseline image. When I run this test in the Chromium browser, I get this:

```console
Error: A snapshot doesn't exist at /Users/denniswhalen/visual-testing-sandbox/e2e-tests/blog.spec.ts-snapshots/landing-chromium-desktop-darwin.png, writing actual.
```

The test failed because Playwright didn’t find a baseline image, which makes sense since I don't have a baseline image yet!   Playwright helpfully created a baseline for me, based on what the page looked like during the test: 

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pqi2mb1nkywb9ln4uraf.png)

After checking the baseline image and confirming it looked good, I can run the test again:

```console
      ✓  1 [chromium-desktop] › blog.spec.ts:10:9 › New Todo › @visual should allow me to add todo items (1.5s)

  1 passed (3.0s)
```
 OK, looks good!

# Dealing with Challenge #1: different browsers and viewports 
That test ran in the Chromium desktop browser, but you can also run it in other browsers like Firefox and WebKit, and also mobile browsers.  To do that I just need to update my `playwright.config.ts` file to include the browsers I want to test:
```typescript
projects: [
    {
      name: 'chrome-desktop',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox-desktop',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit-desktop',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'chrome-mobile',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'safari-mobile',
      use: { ...devices['iPhone 12'] },
    },
  ],
```

With those updates I can run the tests again, and it will run in all the browsers and viewports I specified.

When the test runs, Playwright will look for a baseline image that matches the name of the project for which the test is running.  Since I don't yet have baseline images for the projects I just added, Playwright will generate them for me.  I can then review them and rerun the test to be sure all is green.

With that done I have 1 simple test that runs in 5 browser/viewport combinations, and verifies the screens match the baseline files:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fibrkunselocxbz9tsbk.png)

Boom! My first visual test is working locally. Next up, I could write more tests, but first I want to push this to GitHub and run it in the CI workflow. I just want to be sure it works, but really, what could go wrong?

# Dealing with Challenge #1: different operating systems

Hmmm, when I ran it in CI, I get this error:

```console
Error: A snapshot doesn't exist at /workspace/e2e-tests/blog.spec.ts-snapshots/landing-chromium-desktop-linux.png, writing actual.
```

This happened because the baseline image Playwright is looking for in the CI environment doesn’t match the one I created on my MacBook. Playwright initially generated a baseline with `-darwin.png` (Mac), but the CI system is running Linux, so it’s expecting a `-linux.png` file.

Playwright uses the operating system as part of the baseline filename, which is a good thing since, as I mentioned in Challenge #1, the web page can look different depending on the OS.

So, now I needed to create a Linux baseline image.

## Docker to the rescue!

To solve this, I used Docker on my MacBook to generate the Linux baseline images. Here’s the command I ran:

```
docker run -it --rm \
  --ipc=host \
  -v $(pwd):/workspace \
  -w /workspace \
  -e HOME=/tmp \
  mcr.microsoft.com/playwright:latest \
  /bin/bash -c "npx playwright install --with-deps && npm run e2e:visual"
```

This command runs the visual tests inside a Docker container and generates the baseline images for Linux so now I have all the baseline images I need:
![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o1h34qf9lxwjddt10snc.png) 

I also tweaked my Github workflow to run the visual tests with the same Docer image that I used locally, so I can be sure the if ther tests pass locally in Docker, they'll also pass in the CI environment.

I committed the changes to the repo, and now the tests pass both locally on my Mac and in the CI workflow. 

This setup ensures that the visual aspects of your app look great across different operating systems without needing to set up multiple environments. Pretty slick, right?

# Wrapup
So that's just a little taste of how you can use Playwright for visual testing.  Hopefully you can see the value of visual testing and how it can help you catch visual bugs before your users!

What might nat be as obvious is the fact that visual tersting can help simplify your functionaal testing.  ON futire posts I am going to talk about that, and also talk about how tyou can deal with dynamic data in your visual tesigng. 

Stay tuned!
