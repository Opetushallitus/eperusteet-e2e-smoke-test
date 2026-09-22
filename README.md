# eperusteet-e2e-smoke-test

Ulkoa ajettavat savutestit ePerusteet-palveluille.

[![Playwright Tests - qa environment](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test/actions/workflows/playwright.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test/actions/workflows/playwright.yml)

[![Playwright Tests - untuva environment](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test/actions/workflows/playwright-untuva.yml/badge.svg)](https://github.com/Opetushallitus/eperusteet-e2e-smoke-test/actions/workflows/playwright-untuva.yml)

# Asennus ja ajaminen

Riippuvuudet asennetaan Yarn 4:llä (corepack). Playwrightin selain asennetaan erikseen.

```
corepack enable
yarn install
yarn playwright install
```

| Komento | Kohde |
| --- | --- |
| `yarn test` | `playwright test`. Ympäristö tulee `CI`-muuttujasta. |
| `yarn test:dev` | Playwright UI. Ympäristö tulee `CI`-muuttujasta. |
| `yarn test:dev:local` | Playwright UI lokaalia ympäristöä vasten (`CI` tyhjä). |
| `yarn test:dev:qa` | Playwright UI qa-ympäristöä vasten. |
| `yarn test:dev:untuva` | Playwright UI untuva-ympäristöä vasten. |

# Ympäristö

`CI` on ympäristön domain-osa, ei pelkkä on/off-lippu. Osoitteet kootaan tiedostossa `utils/defaultvalues.ts`.

* Tyhjä tai asettamaton: lokaali.
  * perusteet `http://test:test@localhost:9001`
  * amosaa `http://test:test@localhost:9002`
  * ylops `http://test:test@localhost:9040`
  * julkinen `http://localhost:9020`
  * Lokaalissa kirjautuminen on basic auth URL:ssa (`test:test`).
* `testiopintopolku`: qa (`https://virkailija.testiopintopolku.fi`, `https://eperusteet.testiopintopolku.fi`).
* `untuvaopintopolku`: untuva (`https://virkailija.untuvaopintopolku.fi`, `https://eperusteet.untuvaopintopolku.fi`).

Pilvessä kirjautuminen käyttää ympäristömuuttujia `TEST_AUTOMATION_USERNAME` ja `TEST_AUTOMATION_PASSWORD`.

## Koulutustoimijat

* Testeissä käytetään koulutustoimijaa Jyväskylän kaupunki. Ylops-opetussuunnitelman luonnissa organisaatio valitaan nimellä.
* Pilven koulutustoimijan id on `98278` (`utils/defaultvalues.ts`). Lokaalissa id tulee ympäristömuuttujasta `test_koulutustoimija`.
* TUVA:n OPH-pohjat käyttävät pilvessä id:tä `10`. Lokaalissa id tulee ympäristömuuttujasta `test_amosaa_oph_koulutustoimija`.
* Pilven testitunnuksella on oltava pääkäyttäjäoikeudet Jyväskylän kaupunkiin.

# Testataan seuraavat putket

Yhteinen perusteputki: luodaan peruste, julkaistaan se, tarkistetaan pdf ja että määräys näkyy julkisen sivun määräyskokoelmassa. Sen jälkeen luodaan opetussuunnitelma tai toteutussuunnitelma, julkaistaan se ja tarkistetaan pdf. Lopuksi arkistoidaan luodut kohteet.

### eperusteet-service, amosaa-service ja pdf-service

* Ammatillinen perustutkinto: peruste ja toteutussuunnitelma.
* Vapaa sivistystyö: peruste ja opetussuunnitelma.
* Tutkintokoulutukseen valmentava koulutus (TUVA): peruste ja opetussuunnitelma.
* Kotoutumiskoulutus: peruste ja opetussuunnitelma.

### eperusteet-service, ylops-service ja pdf-service

Perusteesta luodaan ensin opetussuunnitelman pohja, joka asetetaan valmiiksi, ja pohjasta opetussuunnitelma.

* Varhaiskasvatus
* Perusopetus
* Aikuisten perusopetus
* Lukiokoulutus
* Taiteen perusopetus

Peruste ja opetussuunnitelma arkistoidaan. Pohjan osoite arkistoidaan samassa jälkikäsittelyssä.

### Vapaa sivistystyö, JOTPA

Uutta perustetta ei luoda. Ensin luodaan osaamismerkki, sitten siitä opetussuunnitelma amosaassa. Opetussuunnitelma arkistoidaan ja osaamismerkki poistetaan.

### Osaamismerkit

Luodaan osaamismerkkiteema ja osaamismerkki, tarkistetaan näkyvyys julkisella sivulla ja poistetaan merkki.

### Kirjautuminen

Kirjaudutaan perusteisiin ja tarkistetaan perusteprojektien sivun otsikko.

# GitHub Actions

* Qa ([`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)): ajetaan pushissa, käsin ja päivittäin kello 03:00 UTC. Aikataulutetun ajon epäonnistuminen ilmoitetaan Slackiin. Node 24, jobin timeout 120 minuuttia.
* Untuva ([`.github/workflows/playwright-untuva.yml`](.github/workflows/playwright-untuva.yml)): vain käsin. Node 24, jobin timeout 120 minuuttia.

Molemmat lataavat Playwright-raportin artefaktina seitsemäksi päiväksi.

# Muuta

* Testit ajetaan yhdellä workerilla. Epäonnistunut testi yritetään uudelleen kolme kertaa.
* Testin timeout on 10 minuuttia. Expect-timeout on pilvessä 90 sekuntia ja lokaalisti 15 sekuntia.
* Pilvessä `maxFailures` on 99, lokaalisti ajo pysähtyy ensimmäiseen epäonnistumiseen.
