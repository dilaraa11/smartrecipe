# Projektdokumentation - SmartRecipe

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2.  [Sketch](#32-sketch)
    3. [Decide](#33-decide)
    4. [Prototype](#34-prototype)
    5. [Validate](#35-validate)
4. [Erweiterungen [Optional]](#4-erweiterungen-optional)
5. [Projektorganisation [Optional]](#5-projektorganisation-optional)
6. [KI-Deklaration](#6-ki-deklaration)
7. [Anhang [Optional]](#7-anhang-optional)

> **Hinweis:** Massgeblich sind die im **Unterricht** und auf **Moodle** kommunizierten Anforderungen.

<!-- WICHTIG: DIE KAPITELSTRUKTUR DARF NICHT VERÄNDERT WERDEN! -->

<!-- Diese Vorlage ist für eine README.md im Repository gedacht. Abschnitte mit [Optional] können weggelassen werden, wenn in den Übungen nichts anderes verlangt wird. -->

## 1. Ausgangslage
Viele Personen stehen täglich vor der Frage, was sie mit den vorhandenen Zutaten zuhause kochen können. Oft fehlen Ideen für passende Gerichte, obwohl bereits genügend Lebensmittel vorhanden wären. Zusätzlich verbringen Nutzer viel Zeit mit der Suche nach einfachen Rezepten oder vergessen interessante Gerichte, die sie bereits gefunden haben.
- **Problem:** 
   Viele Personen besitzen zuhause verschiedene Zutaten, wissen jedoch oft nicht, welche Gerichte sie daraus zubereiten können. Die Suche nach passenden Rezepten ist häufig zeitaufwendig und interessante Rezepte gehen schnell verloren, da keine zentrale Verwaltung vorhanden ist.
- **Ziele:** 
  Entwicklung einer benutzerfreundlichen Webapplikation zur Rezeptsuche anhand vorhandener Zutaten. Nutzer sollen passende Rezepte finden, eigene Rezepte erstellen und interessante Rezepte als Favoriten speichern können.
- **Primäre Zielgruppe:** 
  Personen, die schnell und unkompliziert Rezeptideen auf Basis vorhandener Zutaten suchen.
- **Weitere Stakeholder [Optional]:** 
  Hobbyköche, Studierende, Familien sowie Personen mit wenig Zeit für die Essensplanung.

## 2. Lösungsidee
Die Anwendung „SmartRecipe“ ist eine Fullstack-Webapplikation, welche Nutzern ermöglicht, Zutaten einzugeben und passende Rezepte anzuzeigen. Die Daten werden dynamisch aus einer MongoDB-Datenbank geladen. Zusätzlich können eigene Rezepte erstellt und Favoriten gespeichert werden.
- **Kernfunktionalität:** 
  - Rezeptsuche anhand vorhandener Zutaten
  - Filterung nach Zubereitungszeit, Schwierigkeit und Kategorien
  - Anzeige von Rezeptdetails
  - Registrierung und Login
  - Favoritenfunktion für persönliche Rezeptsammlungen
  - Eigene Rezepte erstellen und verwalten
  - Persönlicher Profilbereich
- **Annahmen:** 
 Nutzer bevorzugen eine einfache und übersichtliche Benutzeroberfläche. Zudem möchten sie Rezeptvorschläge möglichst schnell finden und durch Filterfunktionen gezielt nach passenden Rezepten suchen können.
- **Abgrenzung:**
Nicht Bestandteil des Projekts sind soziale Funktionen wie Kommentare, Bewertungen oder das Teilen von Rezepten mit anderen Nutzern. Ebenso werden keine externen Rezeptplattformen oder KI-generierten Rezeptvorschläge integriert.

## 3. Vorgehen & Artefakte
Die Durchführung erfolgt phasenbasiert; dokumentieren Sie die wichtigsten Ergebnisse je Phase.

### 3.1 Understand & Define
- **Zielgruppenverständnis:** _[Problemraumanalyse, Recherche, (Proto-)Personas]_
  <img width="1021" height="537" alt="image" src="https://github.com/user-attachments/assets/ce93961f-5347-47ab-814f-c83035f7cf18" />
  <img width="983" height="786" alt="image" src="https://github.com/user-attachments/assets/ac0c493b-8a85-4378-93bc-d383b29571f4" />


Zu Beginn wurde das Problem analysiert, dass viele Personen zwar Zutaten zuhause haben, jedoch keine passende Rezeptidee finden. Zudem wurde untersucht, welche Funktionen bestehende Rezeptplattformen anbieten und welche Bedürfnisse Nutzer bei der Rezeptsuche haben.

- **Wesentliche Erkenntnisse:**
  - Nutzer möchten Rezepte möglichst schnell finden.
  - Die Suche anhand vorhandener Zutaten bietet einen klaren Mehrwert.
  - Filter nach Zeit, Schwierigkeit und Kategorien unterstützen die Suche.
  - Nutzer möchten interessante Rezepte speichern und später wiederfinden.
  - Eine einfache und übersichtliche Benutzeroberfläche ist wichtiger als viele Funktionen.

### 3.2 Sketch
- **Variantenüberblick:** Im Rahmen der Konzeptphase wurden mithilfe der Kreativmethode Crazy 8s verschiedene Lösungsansätze für die Gestaltung der Startseite und der Rezeptsuche erarbeitet. Die Varianten unterscheiden sich hinsichtlich Suchkonzept, Navigation, Informationsdarstellung und Personalisierung. Ziel war es, die für die Zielgruppe verständlichste und effizienteste Lösung auszuwählen.
- **Skizzen:** _[Mehrere Varianten; Unterschiede kurz dokumentieren.]_
<img width="5712" height="4284" alt="Crazy 8s" src="https://github.com/user-attachments/assets/5a132e86-662e-4599-8c48-f769105baa9d" />

Es wurden insgesamt acht Varianten erstellt und verglichen.

- Variante 1 stellt die Suche anhand vorhandener Zutaten in den Mittelpunkt. 
- Variante 2 fokussiert auf eine klassische Rezeptsuche über ein Suchfeld.
- Variante 3 kombiniert Zutaten-Suche mit zusätzlichen Filtern.
- Variante 4 setzt auf eine bildorientierte Kartenansicht der Rezepte.
- Variante 5 zeigt eine Übersicht der gespeicherten Favoriten. Der Fokus liegt auf dem schnellen Wiederfinden bereits gespeicherter Rezepte und einer persönlichen Rezeptsammlung.
- Variante 6 integriert persönliche Bereiche wie Favoriten und eigene Rezepte direkt auf der Startseite. 
- Variante 7 organisiert Rezepte primär über Kategorien und Tags.
- Variante 8 führt den Nutzer schrittweise durch den Suchprozess.



### 3.3 Decide
- **Gewählte Variante & Begründung:** _[Entscheidkriterien nennen]_
Gewählt wurde eine Kombination aus Variante 3, Variante 4 und Variante 6. Die Lösung kombiniert die Suche anhand vorhandener Zutaten mit zusätzlichen Filtermöglichkeiten sowie einer übersichtlichen und bildorientierten Darstellung der Rezepte.

  Die Entscheidung erfolgte aufgrund folgender Kriterien:
  - Einfache und intuitive Bedienung
  - Schnelles Finden passender Rezepte
  - Übersichtliche Darstellung der Suchergebnisse
  - Unterstützung durch Filterfunktionen
  - Gute Erweiterbarkeit für Favoriten, Benutzerkonten und eigene Rezepte

Diese Variante bietet den grössten Mehrwert für die Zielgruppe und unterstützt den gesamten Suchprozess effizient.
- **End-to-End-Ablauf:** _[Beschreibung inkl. User Journey Map]_
1. Der Nutzer öffnet die Startseite.
2. Vorhandene Zutaten werden eingegeben.
3. Optional werden Filter wie Zeit, Schwierigkeit oder Kategorien ausgewählt.
4. Die Anwendung zeigt passende Rezepte an.
5. Der Nutzer öffnet ein Rezept und betrachtet die Details.
6. Das Rezept kann als Favorit gespeichert werden.
7. Das Rezept kann nun unter Favoriten wieder angezeigt werden.
<img width="4980" height="3637" alt="user journey" src="https://github.com/user-attachments/assets/28b47a07-ceca-49b5-ad7c-e5dcae6052ef" />


- **Mockup:** _[URL, z. B. Figma; Screenshots mit kurzen Beschreibungen]_
    https://www.figma.com/design/tqw3EUuCFW5JyzpeIys8QV/SmartRecipe?node-id=0-1&p=f&t=WYy86HqDyapit9uA-0

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)
Beschreibt die Gestaltung und Interaktion.
> **Hinweis:** Hier wird der **Prototyp** beschrieben, nicht das **Mockup**.
- **Informationsarchitektur:** _[z. B. Seiten/Navigation: Konzept, nicht die technische Umsetzung]_
Die Navigation ist über eine zentrale Menüleiste im oberen Bereich der Anwendung umgesetzt. Dadurch können Nutzer jederzeit schnell zwischen den wichtigsten Funktionen wechseln.

   Die Navigation umfasst folgende Bereiche:

   - Home: Rezeptsuche anhand vorhandener Zutaten
   - Rezepte: Übersicht aller verfügbaren Rezepte
   - Erstellen: Erfassung neuer Rezepte
   - Meine Rezepte: Übersicht der selbst erstellten Rezepte
   - Favoriten: Gespeicherte Lieblingsrezepte
   - Profilbereich: Persönliche Kontoinformationen und Kontoverwaltung

<img width="1256" height="43" alt="image" src="https://github.com/user-attachments/assets/f4ddc1a9-5889-4974-956b-2f0a36b81599" />

- **User Interface Design:** _[wichtige Screens: Screenshots mit kurzen Erläuterungen]_
  Startseite: Die Startseite dient als zentraler Einstiegspunkt der Anwendung. Nutzer können vorhandene Zutaten eingeben und die Rezeptsuche mithilfe verschiedener Filter wie Zubereitungszeit, Schwierigkeit oder Kategorien einschränken. Ziel ist es, schnell passende Rezeptvorschläge zu finden.
  <img width="1249" height="599" alt="image" src="https://github.com/user-attachments/assets/9959ce95-1665-4f65-93d7-649e3763f8fb" />
  Rezeptübersicht: Die Rezeptübersicht zeigt alle verfügbaren Rezepte in einer übersichtlichen Darstellung. Nutzer können durch die Sammlung stöbern und einzelne Rezepte für weitere Informationen öffnen.
  <img width="2504" height="1251" alt="image" src="https://github.com/user-attachments/assets/c8edc201-f191-48bd-a3d8-5792321c9fa3" />
  Rezeptdetailseite: Die Rezeptdetailseite enthält alle relevanten Informationen zu einem Rezept. Dazu gehören Zutaten, Mengenangaben, Zubereitungsschritte sowie ein Bild des Gerichts. Angemeldete Nutzer können Rezepte zusätzlich als Favoriten speichern.
  <img width="2516" height="1242" alt="image" src="https://github.com/user-attachments/assets/1073c39b-faaa-4732-a370-80f276f74e24" />
  Rezept erstellen: Auf dieser Seite können registrierte Nutzer eigene Rezepte erfassen. Neben den Grundinformationen wie Name, Dauer und Schwierigkeit können Zutaten, Zubereitungsschritte und ein Bild des Gerichts hinzugefügt werden.
  <img width="2514" height="1253" alt="image" src="https://github.com/user-attachments/assets/fdfc923a-1a56-4e35-bb35-d2c6d990c45d" />
  Meine Rezepte: Die Seite „Meine Rezepte“ bietet eine Übersicht aller selbst erstellten Rezepte eines Benutzers. Dadurch können persönliche Rezepte einfach verwaltet und jederzeit wieder aufgerufen werden.
  <img width="2510" height="1216" alt="image" src="https://github.com/user-attachments/assets/8aae5e0b-ef84-4592-b626-fd12b0051949" />
  Meine Favoriten: Hier werden alle vom Benutzer gespeicherten Lieblingsrezepte angezeigt. Die Favoritenfunktion ermöglicht einen schnellen Zugriff auf häufig genutzte oder interessante Rezepte.
  <img width="2503" height="1238" alt="image" src="https://github.com/user-attachments/assets/c3d9799d-38b7-4034-b154-98da2ba6d7fc" />
  Login / Registrierung Seite: Über die Login- und Registrierungsseite können Benutzer ein Konto erstellen oder sich anmelden. Erst nach erfolgreicher Anmeldung stehen personalisierte Funktionen wie Favoriten, eigene Rezepte und das Profil zur Verfügung.
  <img width="2521" height="1243" alt="image" src="https://github.com/user-attachments/assets/867ccbd4-6a58-4e61-8aed-491448e18ce4" />
  Profilseite: Die Profilseite enthält die persönlichen Kontoinformationen des Benutzers. Zusätzlich können Benutzer ihr Passwort ändern und ihr Profilbild verwalten.
  <img width="2514" height="1236" alt="image" src="https://github.com/user-attachments/assets/f0ca538d-2b8d-49e7-9234-d19baadc1043" />

- **Designentscheidungen:** _[zentrale Entscheidungen und Begründungen]_
Die visuelle Gestaltung von SmartRecipe wurde teilweise von der Rezeptplattform Fooby inspiriert. Insbesondere die grossen Titel, die minimalistische Gestaltung und die übersichtliche Struktur dienten als Vorbild. Die Funktionen und die konkrete Umsetzung wurden jedoch eigenständig entwickelt und an die Bedürfnisse der Zielgruppe angepasst.

    Zentrale Designentscheidungen:

    - Verwendung eines minimalistischen Layouts mit viel Weissraum, um die Inhalte übersichtlich darzustellen.
    - Grosse und auffällige Überschriften sorgen für eine klare Orientierung auf den einzelnen Seiten.
    - Die Rezeptsuche anhand vorhandener Zutaten wurde bewusst auf der Startseite platziert, da sie die Kernfunktion der Anwendung darstellt.
    - Bilder werden verwendet, um Rezepte visuell ansprechender darzustellen und die Wiedererkennung zu verbessern.
    - Die Navigation wurde einfach gehalten und umfasst nur die wichtigsten Bereiche der Anwendung.
    - Persönliche Funktionen wie Favoriten, eigene Rezepte und Profilinformationen sind nur für angemeldete Benutzer verfügbar, um eine individuelle Nutzung zu ermöglichen.
    - Das Design wurde auf allen Seiten konsistent umgesetzt, um die Bedienung möglichst intuitiv zu gestalten.

#### 3.4.2. Umsetzung (Technik)
Fasst die technische Realisierung zusammen.
- **Technologie-Stack:** _[SvelteKit, Bibliotheken falls genutzt]_
     Für die Entwicklung der Anwendung wurde SvelteKit als Fullstack-Framework verwendet. Die Programmlogik wurde mit TypeScript umgesetzt. Zur Speicherung der Daten kommt eine MongoDB-Datenbank zum Einsatz. Das Deployment der Anwendung erfolgt über Netlify.

  Verwendete Technologien:

  - SvelteKit
  - TypeScript
  - MongoDB Atlas
  - Netlify
  - GitHub


- **Tooling:** _[IDE/Erweiterungen, lokale/Cloud-Tools; den Einsatz von KI beschreiben Sie im Kapitel **KI-Deklaration**]_
   Für die Entwicklung wurden folgende Werkzeuge eingesetzt:

  - Visual Studio Code als Entwicklungsumgebung
  - Git für die Versionsverwaltung
  - GitHub zur Verwaltung des Quellcodes
  - MongoDB Atlas als Cloud-Datenbank
  - Netlify für das Deployment der Anwendung

- **Struktur & Komponenten:** _[Seiten, Routen, State/Stores, wichtige Komponenten]_
   Die Anwendung besteht aus mehreren Hauptbereichen:

  - Startseite mit Zutaten-Suche und Filtern
  - Rezeptübersicht
  - Rezeptdetailseiten
  - Favoritenverwaltung
  - Eigene Rezepte
  - Profilbereich
  - Login und Registrierung

   Zusätzlich wurden API-Endpunkte für die Verwaltung von Rezepten, Benutzern und Favoriten implementiert.
  
- **Daten & Schnittstellen:** _[Wie werden Daten gespeichert, verwaltet, abgerufen?]_
   Die Daten werden in einer MongoDB-Datenbank gespeichert.

   Gespeichert werden unter anderem:    

   - Benutzerkonten
   - Rezepte
   - Favoriten

   Die Kommunikation zwischen Frontend und Datenbank erfolgt über API-Endpunkte innerhalb von SvelteKit. Benutzer können Rezepte abrufen, erstellen und verwalten. Favoriten werden benutzerbezogen gespeichert.

- **Deployment:** _[URL]_
    https://smartrecipe-dilara.netlify.app/
  
- **Besondere Entscheidungen:** _[z. B. Trade-offs, Vereinfachungen]_  
    - Für persönliche Funktionen wie Favoriten, eigene Rezepte und Profilinformationen wurde eine Benutzeranmeldung implementiert.
    - Rezeptbilder werden lokal innerhalb des Projekts gespeichert und über den Static-Ordner bereitgestellt.
    - Die Suche anhand vorhandener Zutaten wurde als zentrale Kernfunktion direkt auf der Startseite platziert.
    - Das Design wurde bewusst einfach und übersichtlich gehalten, um eine intuitive Bedienung zu ermöglichen.
    - Für die visuelle Gestaltung diente die Rezeptplattform Fooby als Inspiration.

### 3.5 Validate
- **URL der getesteten Version** (separat deployt) : https://6a0d738ffc371f24ed47e821--smartrecipe-dilara.netlify.app/
  <img width="925" height="414" alt="image" src="https://github.com/user-attachments/assets/d809c153-5fbe-4eb8-88cc-ac30cf87326f" />
  <img width="1055" height="590" alt="image" src="https://github.com/user-attachments/assets/ec039821-571d-4bdd-873b-c3c773f8cb10" />
  <img width="1021" height="536" alt="image" src="https://github.com/user-attachments/assets/2b969863-7a57-45f8-82da-173de8d341d5" />

- **Ziele der Prüfung:** _[welche Fragen sollen beantwortet werden?]_
    - Was hat gut funktioniert?
    - Was hat gefallen?
    - Was hat nich/schlecht funktioniert?
    - Was hat gestört?
    - Was hat gefehlt(Funktionen, Optionen, Infos, ...)?
    - Welche neuen Ideen, Anforderungen sind aufgekommen?
    - Was war unklar (Abfolge, Benennungen, Worte, Texte,...)?
    - Welche Fragen sind aufgetaucht?

- **Vorgehen:** _[moderiert/unmoderiert; remote/on-site]_
     Die Evaluation wurde als moderierter Usability-Test durchgeführt. Die Testpersonen erhielten verschiedene Aufgaben, wie die Suche nach Rezepten, das Filtern von Ergebnissen, das Speichern von Favoriten sowie das Erstellen eigener Rezepte. Während des Tests wurden Beobachtungen protokolliert und anschliessend mittels Feedback Grid ausgewertet. 
- **Stichprobe:** _[Mit wem wurde getestet? Profil; Anzahl]_
     - 3 Testpersonen
     - Studierende zwischen 20 und 30 Jahren
     - Unterschiedliche Vorkenntnisse im Umgang mit Rezeptplattformen
- **Aufgaben/Szenarien:** _[Ausformulierte Testaufgaben]_
1. Melde dich an und rufe dein Profil auf.
2. Suche passende Rezepte anhand vorhandener Zutaten.
3. Verwende die Filterfunktionen zur Einschränkung der Suchergebnisse.
4. Öffne ein Rezept und speichere es als Favorit.
5. Erstelle ein eigenes Rezept.
6. Öffne die Favoritenübersicht.
7. Öffne die Seite „Meine Rezepte“.
     
- **Kennzahlen & Beobachtungen:** _[z. B. Erfolgsquote, Zeitbedarf, qualitative Findings]_
    - Alle Testpersonen konnten die Hauptaufgaben erfolgreich abschliessen.
    - Die Rezeptsuche wurde von allen Testpersonen als verständlich und intuitiv wahrgenommen.
    - Das Filtern von Rezepten funktionierte problemlos.
    - Die Favoritenfunktion wurde ohne Schwierigkeiten verstanden und genutzt.
    - Das Erstellen eigener Rezepte wurde als einfach und selbsterklärend bewertet.
    - Die Übersichtlichkeit der Anwendung wurde positiv hervorgehoben.

    Identifizierte Schwachstellen:
    - Die Bezeichnung „Tags“ wurde von mehreren Testpersonen nicht sofort verstanden.
    - Bei Rezepten fehlten teilweise Angaben zu Mengen und Zubereitungsdetails.
    - Die Bearbeitung bereits erfasster Zutaten innerhalb eines neuen Rezepts wurde vermisst.
    - Mehrere Testpersonen wünschten sich Bilder bei allen Rezepten.
    - Die Suche innerhalb der allgemeinen Rezeptübersicht wurde als mögliche Erweiterung vorgeschlagen.
- **Zusammenfassung der Resultate:** _[Wichtigste Erkenntnisse; 2-4 Sätze]_
    Die Evaluation zeigte, dass die Kernfunktionen der Anwendung verständlich und einfach bedienbar sind. Besonders positiv wurden die Zutaten-Suche, die Filtermöglichkeiten, die Favoritenfunktion sowie die Erstellung eigener Rezepte bewertet. Die Benutzeroberfläche wurde als übersichtlich und intuitiv wahrgenommen. Gleichzeitig konnten mehrere Verbesserungspotenziale identifiziert werden, insbesondere bei der Benennung der Tags sowie bei zusätzlichen Informationen innerhalb der Rezepte.
- **Abgeleitete Verbesserungen:** _[Anforderungen, die als nächstes umgesetzt werden sollten, priorisiert, kurz begründet; falls Verbesserungen im Prototyp konkret umgesetzt wurden: In Kap. 4 dokumentieren]_
    - Umbenennung oder bessere Erklärung der Tags/Kategorien.
    - Ergänzung fehlender Mengen- und Zeitangaben bei Rezepten.
    - Möglichkeit zur Bearbeitung bereits hinzugefügter Zutaten beim Erstellen eines Rezepts.
    - Ergänzung von Bildern für alle Rezepte.
    - Erweiterung der Suchfunktion innerhalb der Rezeptübersicht.
    - Weitere Optimierung der Benutzerfreundlichkeit bei der Rezepterstellung.

## 4. Erweiterungen [Optional]
Dokumentiert Erweiterungen über den Mindestumfang hinaus.

### 4.1 Benutzerkonten mit Login und Registrierung
- **Beschreibung & Nutzen:** _[Was wurde erweitert? Warum?]_
     Die Anwendung wurde um eine Benutzerverwaltung erweitert. Nutzer können sich registrieren und anmelden, wodurch persönliche Funktionen wie Favoriten und eigene Rezepte ermöglicht werden.
- **Wo umgesetzt:** _[Wie und wo wurde es gemacht? Frontend, Backend, Datenbank?]_
     - Frontend: Login- und Registrierungsseiten 
     - Backend: Authentifizierungs-API
     - Datenbank: Speicherung von Benutzerkonten
- **Referenz:** _[Wo wird die Erweiterung auch noch beschrieben, z.B. Screenshot oder Beschreibung in einem anderen Kapitel]_
     - Kapitel 3.4.1 – Login / Registrierung
- **Aus Evaluation abgeleitet?:** _[Wurde diese Erweiterung als Folge eines in der Evaluation identifizierten Issues implementiert?]_
     - Nein, bereits zu Beginn als Erweiterung geplant.


## 5. Projektorganisation [Optional]
Beispiele:
- **Repository & Struktur:** _[Link; kurze Strukturübersicht]_
     Der Quellcode wird in einem GitHub-Repository verwaltet.

     Repository: https://github.com/dilaraa11/smartrecipe

     Die Projektstruktur basiert auf SvelteKit und ist in Frontend-Seiten, API-Endpunkte, Datenbankzugriffe und wiederverwendbare Komponenten gegliedert.

     Wichtige Verzeichnisse:

  - src/routes: Seiten und API-Endpunkte
  - src/lib: Wiederverwendbare Komponenten und Typdefinitionen
  - static: Bilder und statische Dateien

- **Issue-Management:** _[Vorgehen kurz beschreiben]_
    Die Entwicklung erfolgte iterativ. Neue Funktionen, Fehlerbehebungen und Verbesserungen wurden schrittweise umgesetzt und getestet. Erkenntnisse aus der Evaluation wurden direkt in die Weiterentwicklung des Prototyps integriert.

- **Commit-Praxis:** _[z. B. sprechende Commits]_
    Für die Versionsverwaltung wurde Git verwendet. Änderungen wurden regelmässig in Form von thematisch zusammengehörenden Commits gespeichert.

Beispiele:

- Added authentication and user accounts
- Added recipe images
- Improved profile page
- Added my recipes page
- Updated recipe creation form

Durch die regelmässigen Commits konnte die Entwicklung nachvollziehbar dokumentiert und jederzeit auf frühere Versionen zurückgegriffen werden.

## 6. KI-Deklaration
Die folgende Deklaration ist verpflichtend und beschreibt den Einsatz von KI im Projekt.

### 6.1 KI-Tools
- **Eingesetzte Tools**: _[z. B. Copilot, ChatGPT, Claude, lokale Modelle; Version/Variante wenn bekannt]_
   - ChatGPT (OpenAI)
   - Claude (Anthropic)
   - Codex innerhalb von Visual Studio Code
- **Zweck & Umfang**: _[wie, wofür und in welchem Ausmass wurde KI eingesetzt (z. B. Textentwürfe, Codevorschläge, Tests, Refactoring); welche Teile stammen (ganz/teilweise) aus KI-Unterstützung?]_
    KI wurde während der Entwicklung in unterschiedlichen Phasen eingesetzt.

   - ChatGPT und Claude wurden insbesondere für die Erstellung des technischen Grundgerüsts, für Architekturfragen, Problemlösungen sowie für einzelne Codebeispiele verwendet.
   - Codex wurde direkt in Visual Studio Code für die Weiterentwicklung der Anwendung, die Implementierung zusätzlicher Funktionen, Refactorings sowie Designanpassungen eingesetzt.
   - ChatGPT wurde zusätzlich zur Erstellung von Textentwürfen für die Projektdokumentation verwendet.
   - Die Bilder der Rezepte wurden mithilfe von KI (ChatGPT) generiert und anschliessend in die Anwendung integriert.

    Die durch KI erzeugten Vorschläge wurden jeweils geprüft, angepasst und in die bestehende Anwendung integriert.
- **Eigene Leistung (Abgrenzung):** _[was ist eigenständig erarbeitet/überarbeitet worden?]_
   Die fachliche Konzeption, die Definition der Anforderungen, die Auswahl der Funktionen, die Gestaltung der Benutzeroberfläche, die Evaluation sowie die Integration der einzelnen Komponenten wurden eigenständig durchgeführt.

Die von den KI-Systemen vorgeschlagenen Lösungen wurden analysiert, angepasst, getestet und in den Gesamtkontext des Projekts eingebettet. Die finale Anwendung stellt somit eine eigenständige Umsetzung der Projektidee dar.

### 6.2 Prompt-Vorgehen
_[Überlegungen zu Prompt-Vorgehen, Qualität und Urheberrecht/Quellen. Wie wurde beim Prompting vorgegangen? Zu beschreiben ist die grundlegende Vorgehensweise. Einzelne, konkrete Prompts sollten höchstens als Beispiele aufgeführt werden. ]_
  KI wurde iterativ eingesetzt. Dabei wurden Anforderungen, gewünschte Funktionen sowie technische Probleme schrittweise beschrieben und konkretisiert. Die generierten Antworten dienten als Grundlage für die weitere Entwicklung und wurden anschliessend überprüft, getestet und gegebenenfalls angepasst.

  Der Schwerpunkt lag auf:

 - Entwicklung einzelner Funktionen
 - Fehleranalyse und Debugging
 - Verbesserung der Benutzeroberfläche
 - Optimierung bestehender Komponenten
 - Generierung von Rezeptbildern

Die Qualität der generierten Ergebnisse wurde jeweils durch eigene Tests und manuelle Überprüfung sichergestellt.

### 6.3 Reflexion
_[Nutzen, Grenzen, Risiken/Qualitätssicherung, ...]_
  Der Einsatz von KI ermöglichte eine deutlich schnellere Entwicklung des Prototyps und unterstützte insbesondere bei technischen Fragestellungen sowie bei der Umsetzung einzelner Funktionen. Zudem konnten verschiedene Lösungsansätze effizient verglichen und bewertet werden.

  Gleichzeitig war eine kritische Überprüfung der generierten Vorschläge notwendig, da nicht alle Lösungen direkt korrekt oder optimal auf das Projekt anwendbar waren. Insbesondere bei der technischen Umsetzung mussten Vorschläge häufig angepasst, erweitert oder korrigiert werden.

  Insgesamt erwies sich der Einsatz von KI als wertvolle Unterstützung bei der Entwicklung des Projekts. Die Verantwortung für Konzeption, Integration, Qualitätssicherung und finale Entscheidungen lag jedoch jederzeit bei der Projektverfasserin. 

## 7. Anhang [Optional]
Beispiele:
- **Quellen:** _[verwendete Vorlagen/Assets/Modelle; Lizenz/Urheberrecht; ...]_
- **Testskript & Materialien:** _[Link/Datei]_  
- **Rohdaten/Auswertung:** _[Link/Datei]_  
