# eperusteet-e2e-smoke-test
For testing services from outside

# Config
* Ympäristömuuttujalla CI voidaan määrittää, ajetaanko testejä lokaalisti pilveä vasten. Riittää kun lisää pelkän CI-muuttujan. Arvo voi olla mitä vaan. Ilman muuttujaa ajetaan lokaalia ympäristöä vasten.
* Amosaa vaatii koulutustoimijan id:n ja nämä eroavat pilven ja lokaalin kesken.
    * Testeissä käytetään koulutustoimijaa 'Jyväskylän kaupunki'
    * pilven koulutustoimija id on kovakoodattu tiedostossa defaultvalues.ts, mutta lokaalin id tulee lisätä ympäristömuuttujaan test_koulutustoimija
    * pilven testitunnuksilla on oltava pääkäyttäjäoikeudet Jyväskylän kaupunkiin.

# Testataan seuraavat putket:

### eperusteet-service, amosaa-service ja pdf-service:
* Perusteiden laadinnassa luodaan uusi ammatillinen peruste, joka julkaistaan
    * Testataan, että pdf on generoitu ja luodaan uusi pdf
* Luodaan perusteesta toteutussuunnitelma, joka julkaistaan
    * Testataan, että pdf on generoitu ja luodaan uusi pdf
*Arkistoidaan peruste ja toteutussuunnitelma

### eperusteet-service, ylops-service ja pdf-service:
* Perusteiden laadinnassa luodaan uusi varhaiskasvatuksen peruste, joka julkaistaan
    * Testataan, että pdf on generoitu ja luodaan uusi pdf
* Varmistaan, että määräys löytyy julkisen sivun määräyskokoelmasta
* Luodaan perusteesta opetussuunnitelman pohja, joka asetetaan valmiiksi
* Luodaan pohjasta opetussuunnitelma, joka julkaistaan
    * Testataan, että pdf on generoitu ja luodaan uusi pdf
* Arkistoidaan peruste, opetussuunnitelman pohja ja opetussuunnitelma

# Muuta
* Pilvessä testien suoritusajat vaihtelevat. Timeouteja on säädetty pitkiksi, jotta testit menevät todennäköisemmin läpi.
* Joissakin testeissä on jouduttu käyttämään jonkinlaista kiertotietä, jotta testi menee onnistuneesti läpi. Nämä on yleensä kommentoitu erikseen.
