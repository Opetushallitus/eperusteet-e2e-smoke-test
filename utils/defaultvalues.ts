export const CI_baseUrl = 'https://virkailija.hahtuvaopintopolku.fi';

export const CI_VALUES = {
  baseUrl: 'https://virkailija.hahtuvaopintopolku.fi',
  eperusteUrl: 'https://virkailija.hahtuvaopintopolku.fi/eperusteet-app',
}

export const LOCAL_VALUES = {
  baseUrl: 'http://localhost:9001',
  eperusteUrl: 'http://localhost:9001',
}

export const ENVIRONMENT_VALUES = process.env.CI ? CI_VALUES : LOCAL_VALUES;

export const DEFAULT_VALUES = {
  ...ENVIRONMENT_VALUES,
  loginUrl: `${ENVIRONMENT_VALUES.baseUrl}`,
  loginTitleExpect: 'Perusteprojektit - ePerusteet',
  perusteprojektitUrl: `${ENVIRONMENT_VALUES.eperusteUrl}/#/fi/perusteprojektit`,
  uusiPerusteUrl: `${ENVIRONMENT_VALUES.eperusteUrl}/#/fi/perusteprojektit/uusi`,
}
