import { expect, test } from "@playwright/test";

test("retry selected returns at least one success", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("combobox", { name: /status filter/i }).selectOption("failed");

  await expect(
    page.getByRole("combobox", { name: /status filter, currently: show failed/i }),
  ).toBeVisible();

  const checkboxes = page.getByRole("checkbox", { name: /select transaction/i });

  await expect(checkboxes).toHaveCount(6);

  await checkboxes.nth(0).check();
  await checkboxes.nth(1).check();

  const retryButton = page.getByRole("button", { name: /retry selected \(2\)/i });

  await expect(retryButton).toBeVisible();
  await retryButton.click();

  await expect(page.getByText("Success").first()).toBeVisible({ timeout: 15_000 });
});
