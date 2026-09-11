import { expect, Page } from "@playwright/test";
import { PERUSTE_SMOKE, perusteenTekstikappale } from "./perusteSisalto";
import { TestData } from "../utils/testUtils";
import { DEFAULT_VALUES } from "../../utils/defaultvalues";
import { saveAndCheck, startEditMode, waitMedium, waitSmall, PERUSTE_PDF_LINKKI, OPS_PDF_LINKKI, tarkistaPdfSisalto } from "../../utils/commonmethods";

/** Virkailija-UI:n perusteen relatiivipolku */
const AIPE_PATH = "aikuistenperusopetus/";

/** Vakiot julkisten ja OPS-tarkistusten tekstisisällölle */
export const AIPE_SMOKE = {
  laajaAlainenNimi: "AIPE laaja-alainen osaaminen",
  laajaAlainenKuvaus: "AIPE laaja-alaisen kuvaus",
  vaiheNimi: "AIPE vaihe",
  vaiheTekstiOtsikko: "AIPE vaihe tekstikappale otsikko",
  vaiheTekstiSisalto: "AIPE vaihe tekstikappale sisältö",
  vaiheTavoitealue: "AIPE vaihe tavoitealue",
  oppiaineNimi: "A1-kieli",
  oppiaineTekstiOtsikko: "AIPE oppiaine tekstin otsikko",
  oppiaineTekstiSisalto: "AIPE oppiaine tekstin sisältö",
  tavoitteenNimi: "AIPE tavoitteen nimi",
  kurssiNimi: "Adventistinen uskonto",
  kurssiTekstiSisalto: "AIPE kurssi tekstin sisältö",
  tavoiteJohdetutOppimiset: "AIPE tavoitteista johdetut oppimisen tavoitteet",
  opetussuunnitelmaVaihePaikallinenTarkennus: "AIPE opetussuunnitelma vaihe paikallinen tarkennus",
  opetussuunnitelmaOppiainePaikallinenTarkennus: "AIPE opetussuunnitelma oppiaine paikallinen tarkennus",
  opetussuunnitelmaKurssiPaikallinenTarkennus: "AIPE opetussuunnitelma kurssi paikallinen tarkennus",
} as const;

const AIPE_PERUSTE_TEKSTIT = [
  PERUSTE_SMOKE.tekstikappaleNimi,
  AIPE_SMOKE.vaiheNimi,
  AIPE_SMOKE.laajaAlainenNimi,
  AIPE_SMOKE.laajaAlainenKuvaus,
  AIPE_SMOKE.vaiheTekstiOtsikko,
  AIPE_SMOKE.vaiheTekstiSisalto,
  AIPE_SMOKE.vaiheTavoitealue,
  AIPE_SMOKE.oppiaineNimi,
  AIPE_SMOKE.tavoitteenNimi,
  AIPE_SMOKE.tavoiteJohdetutOppimiset,
  AIPE_SMOKE.kurssiNimi,
  AIPE_SMOKE.kurssiTekstiSisalto,
];

export async function aikuistenperusopetusSisallot(testData: TestData) {
  const page = testData.page;
  const url = testData.url!;
  await perusteenTekstikappale(page);
  await aipeLaajaAlainenOsaaminen(page, url);
  await aipeVaihe(page, url);
  await aipeOppiaineSivulta(page, url);
  await aipeKurssiSivulta(page, url);
}

async function aipeLaajaAlainenOsaaminen(page: Page, baseUrl: string) {
  await page.getByRole('link', { name: 'Laaja-alaiset osaamiset' }).click();
  await page.getByRole("button", { name: "Uusi laaja-alainen osaaminen" }).click();
  await page.getByRole("textbox").first().fill(AIPE_SMOKE.laajaAlainenNimi);
  await page.locator(".ProseMirror").first().fill(AIPE_SMOKE.laajaAlainenKuvaus);
  await page.getByRole("button", { name: "Tallenna" }).click();
  await expect(page.locator(".notification")).toContainText("Tallennus onnistui");
  await expect(page.locator(".editointi-container")).toContainText("Muokkaa");
  await page.getByRole("link", { name: "Yleisnäkymä" }).click();
}

async function aipeVaihe(page: Page, baseUrl: string) {
  await page.goto(baseUrl);
  await page.locator("button, a").filter({ hasText: "Uusi vaihe" }).first().click();
  await page.getByRole("textbox").first().fill(AIPE_SMOKE.vaiheNimi);

  await page.getByRole("button", { name: "Lisää tekstikappale" }).click();
  await page.getByRole("textbox").nth(1).fill(AIPE_SMOKE.vaiheTekstiOtsikko);
  const vaiheMirrorit = page.locator(".ProseMirror");
  await vaiheMirrorit.nth((await vaiheMirrorit.count()) - 1).fill(AIPE_SMOKE.vaiheTekstiSisalto);

  await page.getByRole("button", { name: "Lisää tavoitealue" }).click();
  await page.getByRole("textbox").last().fill(AIPE_SMOKE.vaiheTavoitealue);

  await saveAndCheck(page);
}

async function aipeOppiaineSivulta(page: Page, baseUrl: string) {
  await page.goto(baseUrl);
  await waitSmall(page);
  await page.getByRole("link", { name: AIPE_SMOKE.vaiheNimi }).first().click();
  await page.getByRole("button", { name: "Lisää oppiaine" }).click();

  await page.getByRole("button", { name: "Hae koodistosta" }).click();
  await waitMedium(page);
  await page.locator(".p-dialog-content").getByText(AIPE_SMOKE.oppiaineNimi, { exact: true }).first().click();
  await expect(page.locator(".p-dialog-content").first()).toBeHidden({ timeout: 15_000 });
  await waitSmall(page);

  await page.getByRole("button", { name: "Lisää tekstikappale" }).click();
  await page.getByRole("textbox").nth(1).fill(AIPE_SMOKE.oppiaineTekstiOtsikko);
  const oppiaineMirrorit = page.locator(".ProseMirror");
  await oppiaineMirrorit.nth((await oppiaineMirrorit.count()) - 1).fill(AIPE_SMOKE.oppiaineTekstiSisalto);

  await page.locator("button").filter({ hasText: "Lisää tavoite" }).filter({ hasNotText: "tavoitealue" }).click();
  await page.locator(".tavoite").last().getByRole("textbox").first().fill(AIPE_SMOKE.tavoitteenNimi);
  const tavoiteMirrorit = page.locator(".tavoite").last().locator(".ProseMirror");
  if ((await tavoiteMirrorit.count()) > 0) {
    await tavoiteMirrorit.first().fill(AIPE_SMOKE.tavoiteJohdetutOppimiset);
  }

  const tavoitealueValinta = page.locator(".tavoite").last().locator(".p-select").first();
  if (await tavoitealueValinta.isVisible().catch(() => false)) {
    await tavoitealueValinta.click();
    await page
      .locator(".p-select-overlay, .p-popover-content")
      .getByText(AIPE_SMOKE.vaiheTavoitealue, { exact: false })
      .first()
      .click();
  }

  await saveAndCheck(page);
}

async function aipeKurssiSivulta(page: Page, baseUrl: string) {
  await page.goto(baseUrl);

  await waitSmall(page);
  await page.getByRole("link", { name: AIPE_SMOKE.vaiheNimi }).first().click();
  await waitSmall(page);
  await page.getByRole("link", { name: AIPE_SMOKE.oppiaineNimi }).first().click();

  await page.getByRole("button", { name: "Lisää kurssi" }).click();
  await page.getByRole("button", { name: "Hae koodistosta" }).click();
  await waitMedium(page);
  await page.locator(".p-dialog-content").getByText(AIPE_SMOKE.kurssiNimi, { exact: true }).first().click();
  await expect(page.locator(".p-dialog-content").first()).toBeHidden({ timeout: 15_000 });
  await waitSmall(page);

  await page.locator(".ProseMirror").first().fill(AIPE_SMOKE.kurssiTekstiSisalto);
  await page.locator('.ep-toggle').getByText(AIPE_SMOKE.tavoitteenNimi).check();

  await saveAndCheck(page);
}

/** Julkinen peruste: koostesivu ja sisällön tarkistus */
export async function aikuistenperusopetusJulkinenPerusteTarkistukset(testData: TestData) {
  const page = testData.page;
  const projektiNimi = testData.projektiNimi!;
  const koosteUrl = testData.julkinenKoosteUrl ?? DEFAULT_VALUES.julkinenPerusopetusKoosteUrl;

  await page.goto(koosteUrl);
  await expect(page.locator("body")).toContainText(projektiNimi);
  await page.getByRole("link", { name: projektiNimi }).click();
  await waitMedium(page);
  await expect(page.locator("h1")).toContainText(projektiNimi);

  await tarkistaPdfSisalto(page.getByRole('link', { name: PERUSTE_PDF_LINKKI }), [
    projektiNimi,
    ...AIPE_PERUSTE_TEKSTIT,
  ]);

  const tree = page.locator(".navigation-tree");
  await expect(tree).toContainText("tekstikappale 1");
  await expect(tree).toContainText(AIPE_SMOKE.vaiheNimi);
  
  await tree.getByText("Laaja-alaiset osaamiset").click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.laajaAlainenNimi);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.laajaAlainenKuvaus);

  await tree.getByText(AIPE_SMOKE.vaiheNimi).click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.vaiheTekstiOtsikko);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.vaiheTekstiSisalto);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.vaiheTavoitealue);

  await tree.getByText(AIPE_SMOKE.oppiaineNimi).first().click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.tavoitteenNimi);
  await page.locator(".content").getByText(AIPE_SMOKE.tavoitteenNimi).click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.tavoiteJohdetutOppimiset);

  await tree.getByText(AIPE_SMOKE.kurssiNimi).click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.kurssiTekstiSisalto);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.tavoitteenNimi);
}

export async function aikuistenperusopetusJulkinenOpsTarkistukset(testData: TestData) {
  const page = testData.page;
  const tree = page.locator(".navigation-tree");

  await tarkistaPdfSisalto(page.getByRole('link', { name: OPS_PDF_LINKKI }), [
    testData.opsNimi!,
    ...AIPE_PERUSTE_TEKSTIT,
    PERUSTE_SMOKE.tekstikappaleTeksti,
    AIPE_SMOKE.opetussuunnitelmaVaihePaikallinenTarkennus,
    AIPE_SMOKE.oppiaineTekstiOtsikko,
    AIPE_SMOKE.oppiaineTekstiSisalto,
    AIPE_SMOKE.opetussuunnitelmaOppiainePaikallinenTarkennus,
    AIPE_SMOKE.opetussuunnitelmaKurssiPaikallinenTarkennus,
  ]);

  await expect(tree).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await tree.getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator(".content")).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await expect(page.locator(".content")).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);

  await tree.getByText("Laaja-alaiset osaamiset").click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.laajaAlainenNimi);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.laajaAlainenKuvaus);

  await expect(tree).toContainText(AIPE_SMOKE.vaiheNimi);
  await tree.getByText(AIPE_SMOKE.vaiheNimi).click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.vaiheTekstiOtsikko);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.vaiheTekstiSisalto);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.opetussuunnitelmaVaihePaikallinenTarkennus);
  
  await expect(tree).toContainText(AIPE_SMOKE.oppiaineNimi);
  await tree.getByText(AIPE_SMOKE.oppiaineNimi).click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.oppiaineTekstiOtsikko);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.oppiaineTekstiSisalto);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.tavoitteenNimi);
  await page.locator(".content").getByText(AIPE_SMOKE.tavoitteenNimi).click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.tavoiteJohdetutOppimiset);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.vaiheTavoitealue);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.opetussuunnitelmaOppiainePaikallinenTarkennus);

  await expect(tree).toContainText(AIPE_SMOKE.kurssiNimi);
  await tree.getByText(AIPE_SMOKE.kurssiNimi).click();
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.kurssiTekstiSisalto);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.tavoitteenNimi);
  await expect(page.locator(".content")).toContainText(AIPE_SMOKE.opetussuunnitelmaKurssiPaikallinenTarkennus);
}

export async function aikuistenperusopetusOpsSisallot(testData: TestData) {
  const page = testData.page;
  const url = testData.url!;
  const tree = page.locator(".navigation");
  await expect(tree).toContainText("Laaja-alaiset osaamiset");
  await tree.getByText("Laaja-alaiset osaamiset").click();
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.laajaAlainenNimi);
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.laajaAlainenKuvaus);

  await tree.getByText("Yleisnäkymä").click();
  await page.reload();

  await expect(tree).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await tree.getByText(PERUSTE_SMOKE.tekstikappaleNimi).click();
  await expect(page.locator(".editointi-container")).toContainText(PERUSTE_SMOKE.tekstikappaleNimi);
  await expect(page.locator(".editointi-container")).toContainText(PERUSTE_SMOKE.tekstikappaleTeksti);

  await aikuistenperusopetusOpsSisallotVaihe(testData);
  await aikuistenperusopetusOpsSisallotOppiaine(testData);
  await aikuistenperusopetusOpsSisallotKurssi(testData);
}

export async function aikuistenperusopetusOpsSisallotVaihe(testData: TestData) {
  const page = testData.page;
  const tree = page.locator(".navigation");
  await tree.getByText("Yleisnäkymä").click();
  await page.reload();

  await page.locator("button, a").filter({ hasText: "Lisää vaihe" }).first().click();
  await page.locator(".p-dialog-content .p-select").click();
  await page.locator(".p-select-overlay").getByText(AIPE_SMOKE.vaiheNimi, { exact: false }).first().click();
  await page.locator('.p-dialog-footer').getByRole('button', { name: 'Lisää vaihe' }).click();
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.vaiheNimi);
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.vaiheTekstiOtsikko);
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.vaiheTekstiSisalto);

  await startEditMode(page);
  await page.locator(".ProseMirror").first().fill(AIPE_SMOKE.opetussuunnitelmaVaihePaikallinenTarkennus);
  await saveAndCheck(page);
}

export async function aikuistenperusopetusOpsSisallotOppiaine(testData: TestData) {
  const page = testData.page;
  const tree = page.locator(".navigation");
  await tree.getByText(AIPE_SMOKE.oppiaineNimi).click();
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.oppiaineTekstiOtsikko);
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.oppiaineTekstiSisalto);
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.tavoitteenNimi);
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.tavoiteJohdetutOppimiset);
  await startEditMode(page);
  await page.locator(".ProseMirror").first().fill(AIPE_SMOKE.opetussuunnitelmaOppiainePaikallinenTarkennus);
  await saveAndCheck(page);
}

export async function aikuistenperusopetusOpsSisallotKurssi(testData: TestData) {
  const page = testData.page;
  const tree = page.locator(".navigation");
  await tree.getByText(AIPE_SMOKE.kurssiNimi).click();
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.kurssiTekstiSisalto);
  await expect(page.locator(".editointi-container")).toContainText(AIPE_SMOKE.tavoitteenNimi);
  await startEditMode(page);
  await page.locator(".ProseMirror").first().fill(AIPE_SMOKE.opetussuunnitelmaKurssiPaikallinenTarkennus);
  await saveAndCheck(page);
}