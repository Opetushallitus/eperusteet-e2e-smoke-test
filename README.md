# eperusteet-e2e-smoke-test
For testing services from outside

# Config
* Ympäristömuuttujalla CI voidaan määrittää, ajetaanko testejä lokaalisti pilveä vasten. Riittää kun lisää pelkän CI-muuttujan. Arvo voi olla mitä vaan. Ilman muuttujaa ajetaan lokaalia ympäristöä vasten.
* Amosaa vaatii koulutustoimijan id:n ja nämä eroavat pilven ja lokaalin kesken. Testeissä käytetään koulutustoimijaa 'Jyväskylän kaupunki'. Pilven id on kovakoodattu, mutta lokaalin id tulee lisätä ympäristömuuttujaan test_koulutustoimija.

# Testataan seuraavat putket:

### eperusteet-service ja amosaa-service:
* Perusteiden laadinnassa luodaan uusi ammatillinen peruste, joka julkaistaan
    * Testataan, että pdf on generoitu ja luodaan uusi pdf
* Luodaan perusteesta toteutussuunnitelma, joka julkaistaan
    * Testataan, että pdf on generoitu ja luodaan uusi pdf
*Arkistoidaan peruste ja toteutussuunnitelma

### eperusteet-service ja ylops-service:
* Perusteiden laadinnassa luodaan uusi varhaiskasvatuksen peruste, joka julkaistaan
    * Testataan, että pdf on generoitu ja luodaan uusi pdf
* Luodaan perusteesta opetussuunnitelman pohja, joka asetetaan valmiiksi
* Luodaan pohjasta opetussuunnitelma, joka julkaistaan
    * Testataan, että pdf on generoitu ja luodaan uusi pdf
* Arkistoidaan peruste, opetussuunnitelman pohja ja opetussuunnitelma
