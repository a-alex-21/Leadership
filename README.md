# Konflikt na pracovišti

HTML prezentace k předmětu Leadership pro lokální použití i GitHub Pages. Otevřete `index.html` v moderním
prohlížeči. Není potřeba server, připojení k internetu ani instalace knihoven.

## Struktura

```text
index.html             Slidy, texty, poznámky řečníka a ovládací prvky
assets/
  styles.css           Vzhled, mobilní rozložení a tisk do PDF
  app.js               Navigace, dialogy, fullscreen, gesta a časomíra
  pdf-export.js        Přímé vytvoření a stažení PDF 16 : 9
  pdf-images.js        Generovaná data obrázků pro offline export
  vendor/              Lokálně uložené knihovny pro PDF
  images/              Ilustrace (dvě použité v prezentaci)
podklady/              Lokální podklady (nejsou součástí veřejného repozitáře)
scripts/check.mjs      Kontrola integrity bez externích závislostí
README.md              Tento návod
```

Existuje jedna zdrojová verze prezentace. Při kopírování či posílání webu přiložte
k `index.html` celou složku `assets`. Složku `podklady` není pro promítání potřeba
přikládat. Obrázky nejsou vložené jako Base64 do HTML, takže kód zůstává čitelný.

## Úprava obsahu

- Každý slide je samostatný `<section class="slide">` v `index.html`.
- Poznámky jsou přímo u slidu v `<aside class="speaker-notes" hidden>`.
- Přehled slidů a rozbalovací seznam se vytvářejí automaticky z nadpisů.
- Při přidání slidu zachovejte souvislé číslování `slide-1`, `slide-2` atd.
  Aktualizujte také jeho přístupný název a viditelné číslo v `.slide-number`.
- Barvy jsou definované na začátku `assets/styles.css` v bloku `:root`.
- Teorie je na slidech 2–4, aplikace na rozhovory na slidu 13.
- Modelové doplnění na slidech 11–12 je výslovně smyšlené; není součástí rozhovorových zjištění.
- Časový plán je 12 minut 15 sekund, zbývají 2 minuty 45 sekund na diskusi a rezervu.
- Zdroje jsou v patičkách a bibliografii na slidu 16. Pouze otevření online
  zdrojů vyžaduje internet; prezentace nemá externí načítané závislosti.

## Ovládání

| Klávesa | Akce |
| --- | --- |
| ← / →, Page Up / Down, mezerník | Posun slidů |
| Home / End | První / poslední slide |
| F | Celá obrazovka |
| O | Přehled slidů |
| N | Poznámky řečníka |
| B | Černá obrazovka |
| Escape | Zavření dialogu / černé obrazovky |

Na dotykovém zařízení lze přejíždět vodorovně. Časomíra se spouští a pozastavuje
kliknutím, sousední tlačítko ji vynuluje. Odkaz s `#5` otevře pátý slide.

## Uložení PDF

Klikněte na **Stáhnout PDF**. Prezentace přímo vytvoří soubor
`Konflikt-na-pracovisti.pdf` se 16 stránkami o rozměrech **320 × 180 mm (16 : 9)**.
Každý slide je jedna celá stránka, bez okrajů a tiskového dialogu. Ovládání
ani poznámky řečníka se do PDF nezahrnou. Průběh je viditelný a lze jej zrušit.

Export probíhá lokálně, včetně obrázků. Slidy jsou v PDF vykresleny jako obrázky
ve vysokém rozlišení 3200 × 1800 px; text proto není samostatně označitelný.
Online citace zůstávají klikatelné. Export využívá skutečný aktuální obsah HTML,
takže po úpravě textů není potřeba předem vytvářet nový PDF soubor.

Po změně ilustrací obnovte data pro export:

```sh
node scripts/build-pdf-assets.mjs
```

Tento generovaný soubor řeší omezení canvasu při otevření stránky přes `file://`.
Knihovny i data se načtou pouze při exportu. Standardní tisk přes nabídku
prohlížeče je stále dostupný, ale tlačítko PDF jej nevyvolává.

## Kontrola

Pokud máte Node.js, spusťte:

```sh
node scripts/check.mjs
```

Kontrola ověřuje lokální soubory, ID a strukturu slidů, poznámky, vazby ovládání,
alternativní texty obrázků, přítomnost tiskového rozvržení, časový plán, citace a syntaxi JavaScriptu.
Nenahrazuje vizuální kontrolu v prohlížeči a PDF. Při refaktoringu byly navíc
ověřeny chování navigace, dialogů, časomíry, zkratek a gest v simulovaném DOM.
Přímé stažení bylo ověřeno v Safari. Kontrola předchozí verze PDF potvrdila 18 stran formátu
320 × 180 mm; vizuálně byl zkontrolován přehled všech stránek.

## Podklady

Prezentace vychází ze dvou individuálních rozhovorů o konfliktech s jednotlivými
lídry. Každý rozhovor trval 20 minut. Soubory ve složce `podklady` slouží jako
písemné podklady k těmto rozhovorům.

`Leader 1.docx` obsahuje opakovaný příběh pod nadpisem druhého leadera. Druhý
případ prezentace proto vychází ze samostatného `Leader 2.pdf`. Originály jsou
zachovány ve složce `podklady`. Ilustrace vytvořil Imagegen; nejde o podobizny
respondentů. Jejich zadání je uchováno v `podklady/ilustrace.md`.

Teoretický podklad `podklady/teorie-konflikty.pptx` je zachován beze změny.
Celkové obsahové zhodnocení a výsledky kontroly jsou v `AUDIT.md`.

## GitHub Pages

Repozitář: https://github.com/a-alex-21/Leadership

GitHub Pages publikuje kořen větve `main`. Soubor `.nojekyll` vypíná zpracování
Jekyllem. Web používá relativní cesty a stejné soubory jako lokální verze.
Po úpravě a odeslání do `main` GitHub web automaticky znovu publikuje.

Před odesláním změn spusťte `node scripts/check.mjs`. Pokud se změnily obrázky,
nejprve spusťte `node scripts/build-pdf-assets.mjs`.

Původní rozhovorové dokumenty ve složce `podklady` se neodesílají do Gitu ani
na GitHub Pages. V prezentaci na ně odkazuje seznam podkladů na posledním slidu.

## Lokální revize 11. 11. 2026

Odstraněn druhý slide, zkráceny texty a zjednodušen vzhled. Dopady na týmy
jsou dva jasně označené modelové scénáře. Tato revize nebyla publikována.

Aktuální lokální úprava: 16 slidů, citace pouze teorie, doporučení v šesti blocích, závěr tvoří jediná diskusní otázka.

Fullscreen skryje obě ovládací lišty i ukazatel průběhu a zvětší slide na dostupnou plochu. Na běžné obrazovce zachová poměr 16 : 9. Ovládání: šipky, mezerník, gesta; návrat klávesou Esc nebo F.
