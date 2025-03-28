export const CI_baseUrl = 'https://virkailija.testiopintopolku.fi';
export const julkinenBaseUrl = 'https://eperusteet.testiopintopolku.fi';
export const koulutustoimija = process.env.CI ? '98278' : process.env.test_koulutustoimija;

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
  eperusteUrl: 'http://localhost:9001',
  amosaaUrl: 'http://localhost:9002',
  ylopsUrl: 'http://localhost:9040',
}

export const ENVIRONMENT_VALUES = process.env.CI ? CI_VALUES : LOCAL_VALUES;

export const DEFAULT_VALUES = {
  ...ENVIRONMENT_VALUES,
  loginPerusteetUrl: `${ENVIRONMENT_VALUES.basePerusteetUrl}`,
  loginAmmatillinenUrl: `${ENVIRONMENT_VALUES.baseAmosaaUrl}/#/ammatillinen`,
  loginVapaasivistystyo: `${ENVIRONMENT_VALUES.baseAmosaaUrl}/#/vapaasivistystyo`,
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
  julkinenUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}`,
  julkinenAmmatillinenUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/selaus/ammatillinen`,
  julkinenKoosteUrlUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/kooste/`,
  julkinenVstKoosteUrlUrl: `${ENVIRONMENT_VALUES.baseJulkinenUrl}#/fi/kooste/vapaasivistystyo`,
  osaamismerkitUrl: `${ENVIRONMENT_VALUES.basePerusteetUrl}/#/fi/osaamismerkit`,
  osaamismerkkiTeematUrl: `${ENVIRONMENT_VALUES.basePerusteetUrl}/#/fi/osaamismerkit/kategoriat`,
}
