# 📸 Aplikacja mobilna - SnapMail

Aplikacja mobilna została stworzona w React Native z Expo i jest prostym, ale praktycznym narzędziem do pracy ze zdjęciami. Jej główne funkcje to:

- Robienie zdjęć kamerą – użytkownik może uruchomić kamerę wbudowaną w aplikację i od razu wykonać fotografię. Nie trzeba korzystać z systemowej aplikacji aparatu.

- Galeria wewnętrzna – wszystkie zrobione zdjęcia zapisują się w galerii aplikacji, dzięki czemu użytkownik ma je zawsze w jednym miejscu. Galeria pozwala przeglądać zdjęcia i wybierać konkretne pliki do dalszych działań.

- Wysyłanie zdjęć mailem – wybrane fotografie można wysłać bezpośrednio z aplikacji na podany adres e-mail. Funkcja sprawdza się np. do szybkiego udostępniania dokumentów, notatek wizualnych czy zdjęć z pracy w terenie.

---

## 🛠️ Technologie

React Native + Expo – do budowy całej aplikacji i integracji z kamerą oraz pamięcią urządzenia.

- Expo Image Picker / Camera – obsługa robienia zdjęć i zapisywania ich w galerii.

- Expo MailComposer – wysyłka zdjęć mailem z poziomu aplikacji.

- EAS Build – generowanie gotowych paczek .apk / .aab (Android) oraz .ipa (iOS).

---

## 🎯 Zastosowania

- szybkie robienie i archiwizowanie zdjęć do pracy (np. prototypów, notatek, dokumentów),

- wysyłanie raportów ze zdjęciami prosto z telefonu,

- osobista mini-galeria do przechowywania fotek niezależnie od systemowej aplikacji aparatu.

---

## ⚙️ Wymagania
- Node.js (najlepiej wersja LTS v22.19.0)  
- npm lub yarn
- Expo CLI  

EAS CLI (do budowania paczek): 
- npm install -g eas-cli
- Android Studio (opcjonalnie, jeśli chcesz używać emulatora)

---

## 🚀 Instalacja projektu
1. Pobierz aplikacje
2. Wejdź do folderu: 
   - cd projekt
3. Zainstaluj zależnosci:
   - npm install
   
   albo
   - yarn install (jeśli, używasz yarn)

---

## ▶️ Uruchamianie aplikacji
1. Odpal serwer developerski:
   - npx expo start
2. W terminalu zobaczysz QR kod.
Zeskanuj go aplikacją Expo Go na telefonie.
Aplikacja uruchomi się automatycznie.

---

## 📦 Budowanie aplikacji
1. Android
   Musisz posiadać konto na expo.dev i być zalogowany: eas login
   - eas build -p android --profile production
   
   Domyślnie wygeneruje plik .aab (do wrzucenia na Google Play).
   Jeśli chcesz paczkę testową .apk:
      - eas build -p android --profile preview

2. iOS
   - eas build -p ios --profile production

---

## 🔑 Konfiguracja
1. Plik app.json pozwala zmienić nazwę, ikonę i wersję aplikacji.
Przykład:
   - {
  "expo": {
    "name": "MojaAplikacja",
    "slug": "moja-aplikacja",
    "version": "1.0.0",
    "android": {
      "versionCode": 1
    },
    "ios": {
      "buildNumber": "1.0.0"
    }
  }
}
2. Aktualizacja wersji
   - Zmień version oraz android.versionCode (na Androidzie musi być zawsze wyższy numer niż poprzednio).
   - Na iOS zwiększ ios.buildNumber.
