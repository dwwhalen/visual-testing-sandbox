# Intro

So, what’s the big deal with visual testing, and how is it different from functional testing?

Visual testing is all about comparing an *actual* web page to an *expected* (baseline) image. Unlike functional testing, which checks if your application *works* as expected, visual testing focuses on how your web pages *look*. 

Many times, visual testing is done manually, but you can (and should) automate it where appropriate using tools like Playwright.

While Playwright is known for functional testing, it also comes with a straightforward API that lets you take screenshots and compare them to baseline images automatically. This way, you can easily include visual testing in your automated suite to ensure that as your application evolves, it continues to look great.

# Visual Testing Challenges

Visual testing can be super useful, but, like anything else, it has its challenges. Here are a couple that come to mind:

## Challenge #1: Testing across multiple browsers, viewports, and operating systems
One of the trickiest parts of visual testing is ensuring your application looks good across different browsers, operating systems, and screen resolutions. What looks perfect in Chrome on your MacBook might not look so great in Safari on an iPhone 12.

## Challenge #2: Manual validation is boring and error-prone
Visual testing is often done manually, which can be time-consuming and easy to mess up. It’s easy to miss a visual bug, especially if you’re testing on multiple browsers and devices.

Luckily, Playwright has some great features to help with these challenges, so let’s dig into how it works.

# A Basic Example

Let’s start with a simple example to show how easy it is to set up visual testing with Playwright. If you want to see all the details, I’ve got a [sample repo](https://github.com/dwwhalen/visual-testing-sandbox) with a basic task-tracking application and some Playwright tests to go with it. Here’s the first test I wrote:

```typescript
test.beforeEach(async ({ page }) => {
    page.goto('/');
});

test.describe('New Todo', () => {
  test('@visual should allow me to add todo items', async ({ page }) => {
    await expect(page).toHaveScreenshot('landing');
  });
});
```

This test is pretty basic. It just navigates to the application’s home page and uses Playwright’s `toHaveScreenshot()` function to grab a screenshot of the page and compare it to the baseline image. When I run this test in the Chromium browser, I get this:

```console
Error: A snapshot doesn't exist at /Users/denniswhalen/visual-testing-sandbox/e2e-tests/blog.spec.ts-snapshots/landing-chromium-desktop-darwin.png, writing actual.
```

The test failed because Playwright didn’t find a baseline image, which makes sense since I don’t have one yet! Playwright created a baseline for me based on what the page looked like during the test:

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/pqi2mb1nkywb9ln4uraf.png)

After manually checking the baseline image and confirming it looked good, I can run the test again:

```console
      ✓  1 [chromium-desktop] › blog.spec.ts:10:9 › New Todo › @visual should allow me to add todo items (1.5s)

  1 passed (3.0s)
```

This time, Playwright found the baseline screenshot, compared it to the actual screenshot in the test, and verified they match. All good!

# Dealing with Challenge #1: Different Browsers and Viewports

That test ran in the Chromium desktop browser, but you can also run it in other browsers like Firefox and WebKit, and even on mobile devices. To do that, I updated my `playwright.config.ts` file to include the browsers and viewports I wanted to test:

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

With these updates, I can run the tests again, and they’ll run across all the browsers and viewports I specified.

When the test runs, Playwright will look for a baseline image that matches the name of the project for which the test is running. Since I don’t yet have baseline images for the new projects, Playwright will generate them for me. After reviewing the images and rerunning the test, I’m all set.

With that done, I have one simple test that runs in five browser/viewport combinations, verifying the screens against the baseline files. The baseline filenames include the page name (`landing`), browser name, and OS (`-darwin`), so it’s easy to track which baseline images are being used.

![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fibrkunselocxbz9tsbk.png)

Boom! My first visual test is working locally. Next, I could write more tests, but first, I want to push this to GitHub and run it in the CI workflow, just to be sure it works. But really, what could go wrong?

# Dealing with Challenge #1: Different Operating Systems

Hmmm, when I ran it in CI, I got this error:

```console
Error: A snapshot doesn't exist at /workspace/e2e-tests/blog.spec.ts-snapshots/landing-chromium-desktop-linux.png, writing actual.
```

This happened because the baseline image Playwright is looking for in the CI environment doesn’t exist. The baseline images I created earlier had names ending in `-darwin.png` (Mac), but the CI system is running Linux, so it’s expecting a `-linux.png` file.

Playwright uses the operating system as part of the baseline filename, which is helpful, as mentioned in Challenge #1.

So, now I need to create a Linux baseline image.

## Docker to the Rescue!

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

This command runs the visual tests inside a Docker container and generates the baseline images for Linux, so now I have all the baseline images I need:

![Docker command](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/o1h34qf9lxwjddt10snc.png) 

I also tweaked my GitHub workflow to run the visual tests with the same Docker image I used locally, so if the tests pass in Docker locally, they should also pass in the CI environment.

After committing the changes to the repo, the tests now pass both locally on my Mac and in the CI workflow. Pretty slick, right?

# Dealing with a Failed Test

Let’s see how Playwright helps you when a test fails. I’m going to change the application so the ToDo textbox doesn’t have placeholder text. When I run the test, I get this error:

```console
Error: Screenshot comparison failed:
``` 

To see the specific issue, I can check the HTML report that Playwright generates:

![HTML report with side-by-side view](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/fe35465y45yftvp1mw4k.png)

I selected the side-by-side view, which shows the actual image on the left and the expected image on the right. You can easily spot differences and decide if they’re acceptable. If they are expected, you can update the baseline image. If not, you can update the page to fix the issue.

# Wrap-up

So that’s just a little taste of how you can use Playwright for visual testing. Hopefully, you can see the value of visual testing and how it helps catch visual bugs before your users do!

One benefit that might not be as obvious is how visual testing can simplify your functional testing. In future posts, I’ll talk about that and cover how to handle dynamic data in automated visual testing. 

Stay tuned!

<a href="https://dev.to/leading-edje">
  ![Smart EDJE Image](https://dev-to-uploads.s3.amazonaws.com/i/5uo60qforg9yqdpgzncq.png)
</a>