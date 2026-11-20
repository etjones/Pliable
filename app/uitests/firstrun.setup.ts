import { expect, test } from "@playwright/test";
import { expectModelLoaded } from "./app.ts";

// Runs once before the other tests. The core remembers that the alpha notice was read, so after this it is not shown again.
// A second attempt may find the notice already read by the first, so only the first attempt insists on seeing it.
test("the alpha notice is shown on first use and stays closed once read", async ({ page }, testInfo) => {
  await page.goto("/");
  await expectModelLoaded(page);
  const understand = page.getByRole("button", { name: "I understand" });
  if (testInfo.retry === 0) await expect(understand).toBeVisible();
  if (await understand.isVisible()) await understand.click();
  await expect(understand).toBeHidden();
  await page.reload();
  await expectModelLoaded(page);
  await expect(page.getByRole("button", { name: "Got it" })).toBeVisible();
  await expect(understand).toBeHidden();
});
