export const CI_baseUrl = 'https://virkailija.testiopintopolku.fi';
export const julkinenBaseUrl = 'https://eperusteet.testiopintopolku.fi';
export const koulutustoimija = process.env.CI ? '5967220' : process.env.test_koulutustoimija;

export const CI_VALUES = {
  basePerusteetUrl: CI_baseUrl,
  baseAmosaaUrl: CI_baseUrl,
  baseYlopsUrl: CI_baseUrl,
  eperusteUrl: `${CI_baseUrl}/eperusteet-app`,
  amosaaUrl: `${CI_baseUrl}/eperusteet-amosaa-app`,
  ylopsUrl: `${CI_baseUrl}/eperusteet-ylops-app`,
}

export const LOCAL_VALUES = {
  basePerusteetUrl: 'http://test:test@localhost:9001',
  baseAmosaaUrl: 'http://test:test@localhost:9002',
  baseYlopsUrl: 'http://test:test@localhost:9040',
  eperusteUrl: 'http://localhost:9001',
  amosaaUrl: 'http://localhost:9002',
  ylopsUrl: 'http://localhost:9040',
}

export const ENVIRONMENT_VALUES = process.env.CI ? CI_VALUES : LOCAL_VALUES;

export const DEFAULT_VALUES = {
  ...ENVIRONMENT_VALUES,
  loginPerusteetUrl: `${ENVIRONMENT_VALUES.basePerusteetUrl}`,
  loginAmosaaUrl: `${ENVIRONMENT_VALUES.baseAmosaaUrl}`,
  loginAmmatillinenUrl: `${ENVIRONMENT_VALUES.baseAmosaaUrl}/#/ammatillinen`,
  loginYlopsUrl: `${ENVIRONMENT_VALUES.baseYlopsUrl}`,
  loginTitleExpect: 'Perusteprojektit - ePerusteet',
  julkinenMaarayksetUrl: julkinenBaseUrl + '#/fi/maaraykset',
  perusteprojektitUrl: `${ENVIRONMENT_VALUES.eperusteUrl}/#/fi/perusteprojektit`,
  perusteprojektiUrl: `${ENVIRONMENT_VALUES.eperusteUrl}/#/fi/perusteprojekti`,
  uusiPerusteUrl: `${ENVIRONMENT_VALUES.eperusteUrl}/#/fi/perusteprojektit/uusi`,
  opsPohjatUrl: `${ENVIRONMENT_VALUES.ylopsUrl}/#/fi/pohjat`,
  opsUrl: `${ENVIRONMENT_VALUES.ylopsUrl}/#/fi/opetussuunnitelmat`,
  totsuUrl: `${ENVIRONMENT_VALUES.amosaaUrl}/#/ammatillinen/fi/koulutustoimija/${koulutustoimija}/toteutussuunnitelmat`,
}
