export const CI_baseUrl = `https://virkailija.${process.env.CI}.fi`;
export const julkinenBaseUrl = `https://eperusteet.${process.env.CI}.fi`;
export const koulutustoimija = process.env.CI ? '98278' : process.env.test_koulutustoimija;
export const amosaaOphKoulutustoimija = process.env.CI ? '10' : process.env.test_amosaa_oph_koulutustoimija;

export const CI_VALUES = {
  basePerusteetUrl: `${CI_baseUrl}/eperusteet-service/ui`,
  baseAmosaaUrl: `${CI_baseUrl}/eperusteet-amosaa-service/ui`,
  baseYlopsUrl: `${CI_baseUrl}/eperusteet-ylops-service/ui`,
  baseJulkinenUrl: julkinenBaseUrl,
  eperusteUrl: `${CI_baseUrl}/eperusteet-service/ui`,
  amosaaUrl: `${CI_baseUrl}/eperusteet-amosaa-service/ui`,
  ylopsUrl: `${CI_baseUrl}/eperusteet-ylops-service/ui`,
}

export const LOCAL_VALUES = {
  basePerusteetUrl: 'http://test:test@localhost:9001',
  baseAmosaaUrl: 'http://test:test@localhost:9002',
  baseYlopsUrl: 'http://test:test@localhost:9040',
  baseJulkinenUrl: 'http://localhost:9020',
  eperusteUrl: 'http://test:test@localhost:9001',
  amosaaUrl: 'http://test:test@localhost:9002',
  ylopsUrl: 'http://test:test@localhost:9040',
}

export const ENVIRONMENT_VALUES = process.env.CI ? CI_VALUES : LOCAL_VALUES;

export const DEFAULT_VALUES = {
  ...ENVIRONMENT_VALUES,
  loginPerusteetUrl: `${ENVIRONMENT_VALUES.basePerusteetUrl}`,
  loginAmmatillinenUrl: `${ENVIRONMENT_VALUES.baseAmosaaUrl}/#/ammatillinen`,
  loginVapaasivistystyo: `${ENVIRONMENT_VALUES.baseAmosaaUrl}/#/vapaasivistystyo`,
  loginTutkintoonvalmentava: `${ENVIRONMENT_VALUES.baseAmosaaUrl}/#/tutkintoonvalmentava`,
  loginKotoutumiskoulutus: `${ENVIRONMENT_VALUES.baseAmosaaUrl}/#/kotoutumiskoulutus`,
  loginYlopsUrl: `${ENVIRONMENT_VALUES.baseYlopsUrl}`,
  loginTitleExpect: 'Perusteprojektit - ePerusteet',
  julkinenMaarayksetUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}/#/fi/maaraykset`,
  perusteprojektitUrl: `${ENVIRONMENT_VALUES.eperusteUrl}/#/fi/perusteprojektit`,
  perusteprojektiUrl: `${ENVIRONMENT_VALUES.eperusteUrl}/#/fi/perusteprojekti`,
  uusiPerusteUrl: `${ENVIRONMENT_VALUES.eperusteUrl}/#/fi/perusteprojektit/uusi`,
  opsPohjatUrl: `${ENVIRONMENT_VALUES.ylopsUrl}/#/fi/pohjat`,
  opsUrl: `${ENVIRONMENT_VALUES.ylopsUrl}/#/fi/opetussuunnitelmat`,
  totsuUrl: `${ENVIRONMENT_VALUES.amosaaUrl}/#/ammatillinen/fi/koulutustoimija/${koulutustoimija}/toteutussuunnitelmat`,
  vstOpsUrl: `${ENVIRONMENT_VALUES.amosaaUrl}/#/vapaasivistystyo/fi/koulutustoimija/${koulutustoimija}/opetussuunnitelmat`,
  tuvaOpsUrl: `${ENVIRONMENT_VALUES.amosaaUrl}/#/tutkintoonvalmentava/fi/koulutustoimija/${koulutustoimija}/opetussuunnitelmat`,
  tuvaOphKoulutustoimijaOpsUrl: `${ENVIRONMENT_VALUES.amosaaUrl}/#/tutkintoonvalmentava/fi/koulutustoimija/${amosaaOphKoulutustoimija}/opetussuunnitelmat/pohjat`,
  kotoOpsUrl: `${ENVIRONMENT_VALUES.amosaaUrl}/#/kotoutumiskoulutus/fi/koulutustoimija/${koulutustoimija}/opetussuunnitelmat`,
  julkinenUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}`,
  julkinenAmmatillinenUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/selaus/ammatillinen`,
  julkinenKoosteUrlUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/kooste/`,
  julkinenVstKoosteUrlUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/kooste/vapaasivistystyo`,
  julkinenJotpaKoosteUrlUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/kooste/muukoulutus`,
  julkinenTuvaKoosteUrlUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/kooste/tutkintoonvalmentava`,
  julkinenKotoKoosteUrlUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/kooste/kotoutumiskoulutus`,
  osaamismerkitUrl: `${ENVIRONMENT_VALUES.basePerusteetUrl}/#/fi/osaamismerkit`,
  osaamismerkkiTeematUrl: `${ENVIRONMENT_VALUES.basePerusteetUrl}/#/fi/osaamismerkit/kategoriat`,
  julkinenTaideKoosteUrlUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/kooste/taiteenperusopetus`,
}
