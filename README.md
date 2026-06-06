# Projektdokumentation - SmartRecipe

## Inhaltsverzeichnis

1. [Ausgangslage](#1-ausgangslage)
2. [Lösungsidee](#2-lösungsidee)
3. [Vorgehen & Artefakte](#3-vorgehen--artefakte)
    1. [Understand & Define](#31-understand--define)
    2. [Sketch](#32-sketch)
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

### 3.4 Prototype

#### 3.4.1. Entwurf (Design)
Beschreibt die Gestaltung und Interaktion.
> **Hinweis:** Hier wird der **Prototyp** beschrieben, nicht das **Mockup**.
- **Informationsarchitektur:** _[z. B. Seiten/Navigation: Konzept, nicht die technische Umsetzung]_
- **User Interface Design:** _[wichtige Screens: Screenshots mit kurzen Erläuterungen]_  
- **Designentscheidungen:** _[zentrale Entscheidungen und Begründungen]_

#### 3.4.2. Umsetzung (Technik)
Fasst die technische Realisierung zusammen.
- **Technologie-Stack:** _[SvelteKit, Bibliotheken falls genutzt]_
- **Tooling:** _[IDE/Erweiterungen, lokale/Cloud-Tools; den Einsatz von KI beschreiben Sie im Kapitel **KI-Deklaration**]_  
- **Struktur & Komponenten:** _[Seiten, Routen, State/Stores, wichtige Komponenten]_
- **Daten & Schnittstellen:** _[Wie werden Daten gespeichert, verwaltet, abgerufen?]_
- **Deployment:** _[URL]_  
- **Besondere Entscheidungen:** _[z. B. Trade-offs, Vereinfachungen]_  

### 3.5 Validate
- **URL der getesteten Version** (separat deployt) : https://6a0d738ffc371f24ed47e821--smartrecipe-dilara.netlify.app/
- **Ziele der Prüfung:** _[welche Fragen sollen beantwortet werden?]_  
- **Vorgehen:** _[moderiert/unmoderiert; remote/on-site]_  
- **Stichprobe:** _[Mit wem wurde getestet? Profil; Anzahl]_  
- **Aufgaben/Szenarien:** _[Ausformulierte Testaufgaben]_  
- **Kennzahlen & Beobachtungen:** _[z. B. Erfolgsquote, Zeitbedarf, qualitative Findings]_  
- **Zusammenfassung der Resultate:** _[Wichtigste Erkenntnisse; 2-4 Sätze]_  
- **Abgeleitete Verbesserungen:** _[Anforderungen, die als nächstes umgesetzt werden sollten, priorisiert, kurz begründet; falls Verbesserungen im Prototyp konkret umgesetzt wurden: In Kap. 4 dokumentieren]_  

## 4. Erweiterungen [Optional]
Dokumentiert Erweiterungen über den Mindestumfang hinaus.
> **Hinweis:** Jede Erweiterung ist separat nach dem folgenden Schema zu beschreiben.

### _[4.x Kurzbeschreibung / Titel]_  
- **Beschreibung & Nutzen:** _[Was wurde erweitert? Warum?]_  
- **Wo umgesetzt:** _[Wie und wo wurde es gemacht? Frontend, Backend, Datenbank?]_  
- **Referenz:** _[Wo wird die Erweiterung auch noch beschrieben, z.B. Screenshot oder Beschreibung in einem anderen Kapitel]_  
- **Aus Evaluation abgeleitet?:** _[Wurde diese Erweiterung als Folge eines in der Evaluation identifizierten Issues implementiert?]_  

> Das folgende **Beispiel** wurde bewusst kurz gehalten. Erweiterungen dürfen auch ausführlicher beschrieben werden.

### 4.1 Tabelle nach Kategorien filtern
- **Beschreibung & Nutzen:** Tabelle X kann nach Kategorie gefiltert werden, weil User typischerweise nur an einer bestimmten Kategorie interessiert sind.  
- **Wo umgesetzt:** 
  - **Frontend:** Tabelle mit Dropdown in Datei ...
  - **Backend:** Form Action ... in Datei ...
  - **Datenbank:** MongoDB-Query in Datei ...
- **Referenz:** Screenshot in Kap. x.y
- **Aus Evaluation abgeleitet?:** Ja, Issue x.y

## 5. Projektorganisation [Optional]
Beispiele:
- **Repository & Struktur:** _[Link; kurze Strukturübersicht]_  
- **Issue-Management:** _[Vorgehen kurz beschreiben]_  
- **Commit-Praxis:** _[z. B. sprechende Commits]_

## 6. KI-Deklaration
Die folgende Deklaration ist verpflichtend und beschreibt den Einsatz von KI im Projekt.

### 6.1 KI-Tools
- **Eingesetzte Tools**: _[z. B. Copilot, ChatGPT, Claude, lokale Modelle; Version/Variante wenn bekannt]_
- **Zweck & Umfang**: _[wie, wofür und in welchem Ausmass wurde KI eingesetzt (z. B. Textentwürfe, Codevorschläge, Tests, Refactoring); welche Teile stammen (ganz/teilweise) aus KI-Unterstützung?]_
- **Eigene Leistung (Abgrenzung):** _[was ist eigenständig erarbeitet/überarbeitet worden?]_

### 6.2 Prompt-Vorgehen
_[Überlegungen zu Prompt-Vorgehen, Qualität und Urheberrecht/Quellen. Wie wurde beim Prompting vorgegangen? Zu beschreiben ist die grundlegende Vorgehensweise. Einzelne, konkrete Prompts sollten höchstens als Beispiele aufgeführt werden. ]_

### 6.3 Reflexion
_[Nutzen, Grenzen, Risiken/Qualitätssicherung, ...]_

## 7. Anhang [Optional]
Beispiele:
- **Quellen:** _[verwendete Vorlagen/Assets/Modelle; Lizenz/Urheberrecht; ...]_
- **Testskript & Materialien:** _[Link/Datei]_  
- **Rohdaten/Auswertung:** _[Link/Datei]_  
