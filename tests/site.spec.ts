import { expect, test, type Page } from "@playwright/test";

const submissionUrl = "https://api.web3forms.com/submit";

test.beforeEach(async ({ page }) => {
  await page.route("https://api.web3forms.com/**", async (route) => {
    await route.fulfill({ json: { success: true } });
  });
});

async function fillInquiry(page: Page) {
  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.locator("#message").fill("We need help with our next project.");
}

test("three pages load without runtime errors and keep active navigation", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "Your next chapter.",
  );
  const nav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(nav.getByRole("link", { name: "Services" })).toHaveAttribute(
    "aria-current",
    "page",
  );
  await nav.getByRole("link", { name: "About us" }).click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText(
    "human connection.",
  );
  await nav.getByRole("link", { name: "Contact", exact: true }).click();
  await expect(page).toHaveURL(/\/contact$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("hello.");
  expect(errors).toEqual([]);
});

test("staffing inquiry sends the selected service and resets after success", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Let’s build your team with Staffing" }).click();
  await expect(page.getByLabel("How can we help?")).toHaveValue("staffing");
  await page.getByLabel("How can we help?").selectOption("contract-to-hire");
  await fillInquiry(page);
  await page.getByLabel("Full name").fill("Alex & Morgan");
  await page.getByLabel("Company name").fill("Example Co");
  const submitted = page.waitForRequest(submissionUrl);
  await page.getByRole("button", { name: "Send message" }).click();
  const request = await submitted;
  expect(request.method()).toBe("POST");
  expect(request.postDataJSON()).toMatchObject({
    access_key: "5e90270f-dc01-47dd-bf77-9d2e833e49ac",
    name: "Alex & Morgan",
    email: "alex@example.com",
    company: "Example Co",
    service: "Contract-to-hire",
    subject: "HireCraft staffing inquiry — Alex & Morgan",
    botcheck: false,
  });
  await expect(page.getByRole("status")).toContainText("Your message has been sent.");
  await expect(page.getByLabel("Full name")).toHaveValue("");
  await expect(page.getByLabel("How can we help?")).toHaveValue("contract-to-hire");
});

test("development service sends a project inquiry", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Let’s build your solution with Development" }).click();
  await expect(page.getByLabel("How can we help?")).toHaveValue("development");
  await fillInquiry(page);
  await page.getByLabel("Tell us about your project").fill("We need a web application for our customer portal.");
  const submitted = page.waitForRequest(submissionUrl);
  await page.getByRole("button", { name: "Send message" }).click();
  expect((await submitted).postDataJSON()).toMatchObject({
    service: "Development",
    subject: "HireCraft development inquiry — Alex Morgan",
    message: "We need a web application for our customer portal.",
  });
  await expect(page.getByRole("status")).toContainText("Your message has been sent.");
});

test("career inquiry omits hiring details", async ({ page }) => {
  await page.goto("/contact?intent=career&service=development");
  await expect(page.getByRole("radio", { name: "Find my next role" })).toBeChecked();
  await expect(page.getByLabel("Company name")).toHaveCount(0);
  await fillInquiry(page);
  const submitted = page.waitForRequest(submissionUrl);
  await page.getByRole("button", { name: "Send message" }).click();
  const payload = (await submitted).postDataJSON();
  expect(payload).toMatchObject({
    interest: "Career opportunities",
    subject: "HireCraft career inquiry — Alex Morgan",
  });
  expect(payload).not.toHaveProperty("company");
  expect(payload).not.toHaveProperty("service");
  await expect(page.getByRole("status")).toContainText("Your message has been sent.");
});

test("pending submissions disable controls and prevent duplicates", async ({ page }) => {
  let releaseResponse!: () => void;
  const responseReady = new Promise<void>((resolve) => { releaseResponse = resolve; });
  let requests = 0;
  await page.route(submissionUrl, async (route) => {
    requests += 1;
    await responseReady;
    await route.fulfill({ json: { success: true } });
  });
  await page.goto("/contact");
  await fillInquiry(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("button", { name: "Sending…", exact: true })).toBeDisabled();
  await expect(page.getByLabel("Full name")).toBeDisabled();
  await expect(page.getByRole("radio", { name: "Find my next role" })).toBeDisabled();
  await page.locator("form").evaluate((form) => {
    form.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
  });
  await expect.poll(() => requests).toBe(1);
  releaseResponse();
  await expect(page.getByRole("status")).toContainText("Your message has been sent.");
  expect(requests).toBe(1);
});

for (const scenario of [
  { name: "API rejection", status: 200, body: '{"success":false}' },
  { name: "server error", status: 500, body: '{"success":true}' },
  { name: "invalid JSON", status: 200, body: "Service unavailable" },
  { name: "rate limit", status: 429, body: '{"success":false}' },
]) {
  test(scenario.name + " preserves details and allows retry", async ({ page }) => {
    await page.route(submissionUrl, (route) => route.fulfill({
      status: scenario.status,
      contentType: "application/json",
      body: scenario.body,
    }));
    await page.goto("/contact");
    await fillInquiry(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.locator(".contact-form-card").getByRole("alert")).toContainText(
      scenario.status === 429 ? "Too many requests" : "We couldn’t send your message",
    );
    await expect(page.getByLabel("Full name")).toHaveValue("Alex Morgan");
    await expect(page.getByRole("button", { name: "Send message" })).toBeEnabled();
    await page.route(submissionUrl, (route) => route.fulfill({ json: { success: true } }));
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("Your message has been sent.");
    await expect(page.locator(".contact-form-card").getByRole("alert")).toHaveCount(0);
  });
}

test("network errors keep the message available for retry", async ({ page }) => {
  await page.route(submissionUrl, (route) => route.abort("failed"));
  await page.goto("/contact");
  await fillInquiry(page);
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".contact-form-card").getByRole("alert")).toContainText("We couldn’t send your message");
  await expect(page.locator("#message")).toHaveValue("We need help with our next project.");
  await expect(page.getByRole("button", { name: "Send message" })).toBeEnabled();
});

test("honeypot blocks submissions", async ({ page }) => {
  let requests = 0;
  page.on("request", (request) => {
    if (request.url() === submissionUrl) requests += 1;
  });
  await page.goto("/contact");
  await fillInquiry(page);
  await page.locator('[name="botcheck"]').evaluate((element) => {
    (element as HTMLInputElement).checked = true;
  });
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.locator(".contact-form-card").getByRole("alert")).toContainText("Unable to submit this form");
  expect(requests).toBe(0);
});

test("career links update the form when already on the contact page", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(
    page.getByRole("radio", { name: "Hire talent or build a project" }),
  ).toBeChecked();
  await page
    .getByRole("link", { name: "Looking for your next opportunity?" })
    .click();
  await expect(
    page.getByRole("radio", { name: "Find my next role" }),
  ).toBeChecked();
  await expect(page.getByLabel("Company name")).toHaveCount(0);
});

test("form rejects missing fields, invalid email, and whitespace messages", async ({
  page,
}) => {
  await page.goto("/contact");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByLabel("Full name")).toBeFocused();
  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Email address").fill("invalid-email");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByLabel("Email address")).toBeFocused();
  await page.getByLabel("Email address").fill("alex@example.com");
  await page
    .getByLabel("Tell us about your hiring needs")
    .fill("                   ");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(
    page.getByLabel("Tell us about your hiring needs"),
  ).toBeFocused();
});

test("mobile navigation opens, closes with Escape, and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Open menu" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("button", { name: "Open menu" })).toBeFocused();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "Open menu" }).click();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About us" })
    .click();
  await expect(page).toHaveURL(/\/about$/);
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toHaveCount(0);
});

test("all pages fit mobile, tablet, and desktop widths with loaded images", async ({
  page,
}) => {
  for (const width of [360, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/about", "/contact"]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
      ).toBe(true);
      for (const image of await page.locator("img").all()) {
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(
              (element) => (element as HTMLImageElement).naturalWidth,
            ),
          )
          .toBeGreaterThan(0);
      }
    }
  }
});

test("FAQs work with keyboard and reduced motion preserves content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/contact");
  const question = page
    .locator("summary")
    .filter({ hasText: "What happens after" });
  await question.focus();
  await page.keyboard.press("Enter");
  await expect(
    page.getByText("Your inquiry is sent securely through Web3Forms", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
