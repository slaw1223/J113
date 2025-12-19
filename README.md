# J113 - Forum Internetowe Roddit

## Opis
Aplikacja forum internetowego z funkcjami tworzenia postów, edytowania, usuwania oraz głosowania. (totalnie NIE bazowane na reddicie)

## Funkcjonalności
- Tworzenie kont i logowanie bazowane na sesjach
- Tworzenie i przeglądanie postów
- Edycja i usuwanie postów
- Głosowanie na posty
- Sortowanie i filtracja postów
- Konto Admina mające dodatkowe uprawnienia

## Instalacja

### Wymagania
- Node.js (wersja 14 lub wyższa)
- MongoDB

### Kroki
1. Sklonuj repozytorium
   ```
   git clone https://github.com/slaw1223/J113.git
   cd j113
   ```

2. Zainstaluj zależności:
   ```
   npm install ejs express bcryptjs express-session mongodb
   ```

3. Stwórz i uruchom bazę danych [idź do pliku docker.txt](docker.txt).

4. Uruchom aplikację:
   ```
   npm start
   ```

5. Otwórz przeglądarkę i wpisz `http://localhost:3000`

## Używanie
- Stwórz nowe konto lub zaloguj się na już istniejące
- Twórz posty
- Przeglądaj posty i głosuj na nie

## Technologie
- **Backend**: Node.js, Express.js
- **Baza danych**: Docker, MongoDB
- **Frontend**: EJS
- **Bezpieczeństwo**: express-session, bcryptjs
- **Stylizacja**: CSS

## Project Structure
```
j113/
├── src/
│   ├── app.js              # Aplikacja
│   ├── server.js           # Skrypt startu serweru
│   ├── controllers/        # Kontrolery
│   ├── models/             # Modele danych
│   ├── routes/             # Router
│   ├── views/              # Widoki
│   └── data/               # Połączenie z bazą danych
├── public/                 # Statyczne pliki (CSS, images)
├── package.json            # Zależności projektu i skrypty
└── README.md               # Ten plik
```

## Endpointy
- `GET /` -Strona główna
- `GET /login` - Stwona logowania
- `POST /login` - Obsługa logowania
- `GET /createAccount` - Strona tworzenia konta
- `POST /createAccount` - Obsługa tworzenia konta
- `GET /new` - Strona tworzenia postów
- `POST /new` - Obsługa tworzenia postów
- `GET /post/:id` - Strona ze szczegółami wybranego posta
- `POST /post/:id/upvote` - Głosowanie na posty (+1)
- `POST /post/:id/downvote` - Głosowanie na posty (-1)
- `GET /edit/:id` - Strona edycji posta
- `POST /edit/:id` - Obsługa edycji

## Licencja
ISC

## Autor
Sławomir Kozłowski

## Wersja
1.0.3
