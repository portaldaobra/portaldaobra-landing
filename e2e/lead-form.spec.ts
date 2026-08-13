import { expect, test, type Locator, type Page } from "@playwright/test";

// Phase v51.0-C1 — landing lead-capture smoke suite (scenarios F1-F3, F5-F7).
//
// Default run is self-contained: POST /public/leads is mocked at the network
// layer, so no backend is required.
//
//   npx playwright test
//
// Set E2E_MOCK_API=0 (plus E2E_API_BASE) to let the happy paths hit a REAL api
// — that is scenario F4, whose DB-row assertion is made outside this suite:
//
//   E2E_MOCK_API=0 E2E_API_BASE=http://localhost:8011/api/v1 npx playwright test
//
// F6 (server failure) always injects its failure through the route mock: it
// asserts CLIENT behaviour that no healthy api would ever produce.

const MOCK_API = process.env.E2E_MOCK_API !== "0";
const LEADS_ROUTE = "**/public/leads";
const STUB_TURNSTILE_TOKEN = "turnstile-stub-ok";

const JSON_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
};

interface FormValues {
  email: string;
  name: string;
  description: string;
  city: string;
  uf: string;
  phone: string;
}

function makeValues(): FormValues {
  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return {
    email: `lead-e2e-${unique}@example.com`,
    name: "Ana Souza",
    description: "Reforma de tres lojas em shopping, com inicio previsto para 60 dias.",
    city: "São Paulo",
    uf: "SP",
    phone: "(11) 99999-0000",
  };
}

function successEnvelope(email: string) {
  return {
    success: true,
    data: {
      claim_url: "http://localhost:3005/invite/tok-e2e-abc123?src=lead",
      claim_token: "tok-e2e-abc123",
      email,
      expires_at: "2026-09-01T12:00:00Z",
    },
    message: "Lead recebido",
    request_id: "req-e2e-1",
    timestamp: "2026-08-13T12:00:00Z",
  };
}

interface LeadRecorder {
  count: number;
  payloads: Array<Record<string, unknown>>;
}

/**
 * Observe every POST /public/leads. Mocked runs answer 201 locally; unmocked
 * runs record the payload and let the request reach the real api.
 */
async function recordLeadRequests(page: Page, email: string): Promise<LeadRecorder> {
  const recorder: LeadRecorder = { count: 0, payloads: [] };
  await page.route(LEADS_ROUTE, async (route) => {
    recorder.count += 1;
    recorder.payloads.push((route.request().postDataJSON() ?? {}) as Record<string, unknown>);
    if (!MOCK_API) {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 201,
      headers: JSON_HEADERS,
      body: JSON.stringify(successEnvelope(email)),
    });
  });
  return recorder;
}

/** Failure injection — always mocked, in both run modes. */
async function failLeadRequests(page: Page, status: number, errortag: string): Promise<void> {
  await page.route(LEADS_ROUTE, async (route) => {
    await route.fulfill({
      status,
      headers: JSON_HEADERS,
      body: JSON.stringify({
        success: false,
        error: { errortag, code: errortag, message: "boom" },
        message: "boom",
        request_id: "req-e2e-err",
        timestamp: "2026-08-13T12:00:00Z",
      }),
    });
  });
}

/**
 * Load the home page and wait for React to take over. The page is prerendered,
 * so the submit button is server-rendered disabled and only enables once the
 * component hydrates — that makes it an honest interactivity gate.
 */
async function gotoForm(page: Page): Promise<Locator> {
  await page.goto("/");
  const form = page.getByTestId("lead-form");
  await form.scrollIntoViewIfNeeded();
  await expect(page.getByTestId("lead-submit")).toBeEnabled({ timeout: 30_000 });
  return form;
}

async function fillForm(page: Page, values: FormValues): Promise<void> {
  const form = page.getByTestId("lead-form");
  await form.getByLabel("E-mail", { exact: true }).fill(values.email);
  await form.getByLabel("Nome", { exact: true }).fill(values.name);
  await form.getByLabel("Descrição da obra").fill(values.description);
  await form.getByLabel("Cidade").fill(values.city);
  await form.getByLabel("UF", { exact: true }).click();
  await page.getByRole("option", { name: values.uf, exact: true }).click();
  await form.getByLabel("Telefone").fill(values.phone);
  await page.getByRole("radio", { name: "Quero contratar uma obra" }).click();
}

test.describe("landing lead form", () => {
  // F1 — the form renders the agreed field set, and nothing more.
  test("F1: renders the five fields plus both role options, with no Empresa/CNPJ field", async ({
    page,
  }) => {
    const form = await gotoForm(page);

    await expect(form.getByLabel("E-mail", { exact: true })).toBeVisible();
    await expect(form.getByLabel("Nome", { exact: true })).toBeVisible();
    await expect(form.getByLabel("Descrição da obra")).toBeVisible();
    await expect(form.getByLabel("Cidade")).toBeVisible();
    await expect(form.getByLabel("UF", { exact: true })).toBeVisible();
    await expect(form.getByLabel("Telefone")).toBeVisible();

    await expect(page.getByRole("radio", { name: "Quero contratar uma obra" })).toBeVisible();
    await expect(page.getByRole("radio", { name: "Quero fornecer serviços" })).toBeVisible();

    // "These fields exactly, and nothing more" — the label set is the contract.
    // (Scoped to labels so prose like "sua empresa" in the sidebar copy is not
    // mistaken for a field.)
    expect((await form.locator("label").allInnerTexts()).map((text) => text.trim())).toEqual([
      "E-mail",
      "Nome",
      "Descrição da obra",
      "Cidade",
      "UF",
      "Telefone",
      "O que você procura?",
      "Quero contratar uma obra",
      "Quero fornecer serviços",
    ]);

    // Ruling 3 + the "no Empresa field" ruling, asserted as absence.
    await expect(form.getByLabel(/empresa/i)).toHaveCount(0);
    await expect(form.getByLabel(/cnpj/i)).toHaveCount(0);
    await expect(page.locator("#contato #c-empresa")).toHaveCount(0);

    // Validation belongs to zod only — no HTML5 `required` racing it.
    await expect(form.locator("[required]")).toHaveCount(0);
  });

  // F2 — every input is genuinely bound (the defect this phase fixes).
  test("F2: typed values reach the request payload", async ({ page }) => {
    const values = makeValues();
    const recorder = await recordLeadRequests(page, values.email);

    await gotoForm(page);
    await fillForm(page, values);
    await page.getByTestId("lead-submit").click();

    await expect(page.getByTestId("lead-confirmation")).toBeVisible();
    expect(recorder.count).toBe(1);
    expect(recorder.payloads[0]).toMatchObject({
      email: values.email,
      name: values.name,
      description: values.description,
      city: values.city,
      state: values.uf,
      phone: values.phone,
      role_intent: "client",
      turnstile_token: STUB_TURNSTILE_TOKEN,
    });
  });

  // F3 — client validation blocks the request entirely.
  test("F3: empty submit shows inline errors and fires no request", async ({ page }) => {
    const recorder = await recordLeadRequests(page, "unused@example.com");

    await gotoForm(page);
    await page.getByTestId("lead-submit").click();

    await expect(page.getByText("Informe seu e-mail.")).toBeVisible();
    await expect(page.getByText("Informe seu nome.")).toBeVisible();
    await expect(page.getByText("Selecione o estado (UF).")).toBeVisible();
    await expect(page.getByText("Escolha uma das opções acima.")).toBeVisible();

    expect(recorder.count).toBe(0);
    await expect(page.getByTestId("lead-form")).toBeVisible();
  });

  // F5 — inline confirmation replaces the form; the claim link is a real anchor.
  test("F5: success replaces the form with an inline confirmation carrying the claim link", async ({
    page,
  }) => {
    const values = makeValues();
    await recordLeadRequests(page, values.email);

    await gotoForm(page);
    await fillForm(page, values);
    await page.getByTestId("lead-submit").click();

    const confirmation = page.getByTestId("lead-confirmation");
    await expect(confirmation).toBeVisible();
    await expect(page.getByTestId("lead-form")).toHaveCount(0);
    await expect(page.getByTestId("lead-confirmation-email")).toHaveText(values.email);

    const claimLink = page.getByTestId("lead-claim-link");
    await expect(claimLink).toBeVisible();
    const href = await claimLink.getAttribute("href");
    expect(href).toContain("/invite/");

    // Ruling 8: the claim link must survive on screen, so it is NOT a toast.
    await expect(page.locator("[data-sonner-toast]")).toHaveCount(0);
  });

  // F6 — server failure keeps the typed values and offers a retry.
  test("F6: server failure shows an inline error, keeps the data, and retries successfully", async ({
    page,
  }) => {
    const values = makeValues();
    await failLeadRequests(page, 500, "LEAD_UNEXPECTED");

    await gotoForm(page);
    await fillForm(page, values);
    await page.getByTestId("lead-submit").click();

    const errorBox = page.getByTestId("lead-error");
    await expect(errorBox).toBeVisible();
    await expect(errorBox).toHaveAttribute("role", "alert");
    await expect(page.getByTestId("lead-retry")).toBeVisible();

    // No data loss: the form is still there, still populated.
    const form = page.getByTestId("lead-form");
    await expect(form).toBeVisible();
    await expect(form.getByLabel("E-mail", { exact: true })).toHaveValue(values.email);
    await expect(form.getByLabel("Descrição da obra")).toHaveValue(values.description);
    await expect(page.getByRole("radio", { name: "Quero contratar uma obra" })).toBeChecked();

    // Retry against a now-healthy endpoint: same values, no retyping.
    await page.unroute(LEADS_ROUTE);
    const recorder = await recordLeadRequests(page, values.email);
    await page.getByTestId("lead-retry").click();

    await expect(page.getByTestId("lead-confirmation")).toBeVisible();
    expect(recorder.payloads[0]).toMatchObject({ email: values.email, role_intent: "client" });
  });

  // F7 — plain-language role labels, exactly as ruled.
  test("F7: role options use the ruled pt_br wording", async ({ page }) => {
    await gotoForm(page);

    const section = page.locator("#contato");
    await expect(section.getByText("Quero contratar uma obra", { exact: true })).toBeVisible();
    await expect(section.getByText("Quero fornecer serviços", { exact: true })).toBeVisible();
    await expect(section.getByText("Contratante", { exact: true })).toHaveCount(0);
    await expect(section.getByText("Fornecedor", { exact: true })).toHaveCount(0);
  });
});
