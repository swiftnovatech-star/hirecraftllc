import { expect, test } from "@playwright/test";

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

test("service inquiry keeps selection and prepares an encoded email draft", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .getByRole("link", { name: "Let’s build your team with Contract-to-hire" })
    .click();
  await expect(page.getByLabel("How can we help?")).toHaveValue(
    "contract-to-hire",
  );
  await page.getByLabel("Full name").fill("Alex & Morgan");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page.getByLabel("Company name").fill("Example Co");
  await page
    .getByLabel("Tell us about your hiring needs")
    .fill("We need a cloud engineer for our next project.");
  await page.getByRole("button", { name: "Prepare your message" }).click();
  await expect(page.getByRole("status")).toContainText(
    "Your message hasn’t been sent yet.",
  );
  const href = await page
    .getByRole("link", { name: "Open email app" })
    .getAttribute("href");
  expect(href).toContain("mailto:pavan.velaga@gmail.com?");
  const draft = new URL(href!);
  expect(draft.searchParams.get("subject")).toContain("Alex & Morgan");
  expect(draft.searchParams.get("body")).toContain("Service: Contract-to-hire");
  await page.getByLabel("Company name").fill("Changed Company");
  await expect(page.getByRole("status")).toHaveCount(0);
});

test("career inquiry preselects intent and supports clipboard fallback", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/contact?intent=career");
  await expect(
    page.getByRole("radio", { name: "Find my next role" }),
  ).toBeChecked();
  await expect(page.getByLabel("Company name")).toHaveCount(0);
  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Email address").fill("alex@example.com");
  await page
    .getByLabel("Tell us about your next move")
    .fill("I am looking for my next software engineering role.");
  await page.getByRole("button", { name: "Prepare your message" }).click();
  await page.getByRole("button", { name: "Copy draft" }).click();
  await expect(
    page.getByRole("button", { name: "Copied", exact: true }),
  ).toBeVisible();
  expect(await page.evaluate(() => navigator.clipboard.readText())).toContain(
    "Interest: Career opportunities",
  );
});

test("career links update the form when already on the contact page", async ({
  page,
}) => {
  await page.goto("/contact");
  await expect(
    page.getByRole("radio", { name: "Hire great talent" }),
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
  await page.getByRole("button", { name: "Prepare your message" }).click();
  await expect(page.getByRole("status")).toHaveCount(0);
  await expect(page.getByLabel("Full name")).toBeFocused();
  await page.getByLabel("Full name").fill("Alex Morgan");
  await page.getByLabel("Email address").fill("invalid-email");
  await page.getByRole("button", { name: "Prepare your message" }).click();
  await expect(page.getByLabel("Email address")).toBeFocused();
  await page.getByLabel("Email address").fill("alex@example.com");
  await page
    .getByLabel("Tell us about your hiring needs")
    .fill("                   ");
  await page.getByRole("button", { name: "Prepare your message" }).click();
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
    page.getByText("The form does not submit or store", { exact: false }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator("html")).toHaveCSS("scroll-behavior", "auto");
});
