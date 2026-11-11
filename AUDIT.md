# Audit prezentace

## Obsah a splnění zadání

Prezentace má 17 slidů. Součet plánovaných výstupů v poznámkách je 12:25;
pro diskusi a rezervu zbývá 2:35 do patnáctiminutového limitu. Jde o plán,
nikoli o měření skutečně přednesené prezentace.

| Požadavek | Stav a vyhodnocení |
| --- | --- |
| Teoretické zakotvení | Doplněny úrovně konfliktu, latentní/manifestovaný projev, pět stylů a 5 P z dodaného PPTX. |
| Dva lídři | Dva individuální rozhovory o konfliktech s jednotlivými lídry, každý v délce 20 minut; délka upřesněna zadavatelem. |
| Vznik, průběh a řešení | Popsány u obou; u VOUT jde o širší týmovou situaci s individuálními zásahy. |
| Reflexe a vztahy | Výsledky rozhovorů doplňují dva výslovně modelové scénáře dopadů na týmy. |
| Porovnání a syntéza | Přímá komparace, aplikace teorie na konkrétní jednání a společná doporučení. |
| Zdroje | Odkazy u tvrzení, úplná odborná bibliografie a seznam dodaných materiálů. |
| Chybějící rozhovorová data | Doplněny dva modelové scénáře. Je výslovně fikční a nenahrazuje empirická data. |

**Celkové hodnocení:** prezentace propojuje dva individuální dvacetiminutové
rozhovory s teorií a společnými doporučeními. Písemné soubory jsou podklady
k rozhovorům, nikoli náhrada jejich metodického popisu. U trenéra je hodnocení
zaměřeno na možnost nápravy a dodržení předem sděleného důsledku.
Modelové rozpracování zůstává samostatně označeným didaktickým příkladem,
nikoli výrokem některého z respondentů.

## Opravené obsahové nedostatky

- Pět stylů není prezentováno jako osobnostní typologie ani jako provedený TKI test.
- Kooperace není automaticky nejlepší první krok; výběr postupu závisí na situaci.
- Konfrontační styl není zaměněn s ponižováním či veřejnou odvetou.
- 5 P je připsáno dodané prezentaci, která neuvádí původní odborný zdroj pomůcky.
- Latentní a manifestovaný konflikt nejsou vydávány za úplný model jeho vývoje.
- Výzkumné souvislosti nejsou vydávány za příčinné důkazy nebo výsledky těchto rozhovorů.
- Ukončení spolupráce není automaticky považováno za obnovu důvěry v týmu.
- Údaje o obsloužených zákaznících nejsou zaměněny s úplným měřením pracovní morálky.
- Modelové odpovědi nejsou vydávány za skutečné citace respondentů.

## Zdroje a kontrola dohledatelnosti

Prostudován text všech pěti slidů `podklady/teorie-konflikty.pptx`.
Jeho autor a rok vydání nejsou spolehlivě uvedeny; údaj o posledním editorovi
v metadatech nebyl použit jako autorství. Originál zůstává zachován.

Dohledány oficiální popis Thomasova–Kilmannova modelu (The Myers-Briggs Company),
metaanalýza De Dreu a Weingart (2003; DOI 10.1037/0021-9010.88.4.741) a studie
Edmondson (1999; DOI 10.2307/2666999). V prezentaci jsou bibliografické údaje
včetně DOI a explicitní odkazy na použité místní podklady. Ověřeno 8. 11. 2026.

## Historické technické ověření předchozí verze (18 slidů)

- `node scripts/check.mjs`: prošlo; 18 slidů, souvislá ID, poznámky,
  existující lokální soubory, citace, časový limit, syntaxe JS a tiskové styly.
- Ověřeno správné zanoření HTML, zachování tří ilustrací a odstranění rezerv pro teorii.
- V simulovaném DOM prošly navigace a její hranice, neplatné odkazy na slide,
  respektování vstupních polí, dialogy, přehled, černá obrazovka a vyvolání tisku.
- Prošly testy spuštění, pozastavení, pokračování a resetu časomíry i limitu 15 minut.
- Prošly testy vodorovného, svislého a zrušeného dotykového gesta.
- Online odkazy jsou jen citace otevírané uživatelem; JS, CSS a obrázky jsou lokální.

## Přímé stažení PDF — ověření předchozí verze

Tlačítko nyní generuje PDF přímo pomocí lokálně uložených knihoven
html2canvas a jsPDF. Nevyvolává `window.print()` ani tiskový dialog.
Export má průběh, zrušení, obnovu ovládání po chybě a kontrolu přesahu slidu.

Ověřeno reálné kliknutí na tlačítko v Safari nad lokální adresou 127.0.0.1.
Stažený soubor `Konflikt-na-pracovisti.pdf` má 18 stránek. PDFKit ověřil u všech
stránek rozměry 907,0866 × 510,2362 bodu, tedy 320 × 180 mm a přesný poměr 16 : 9.
Vizuálně zkontrolován přehled všech 18 vykreslených stránek: texty, tabulky,
ilustrace, tmavá pozadí a bibliografie jsou přítomné, bez zjevného ořezu.

Slidy jsou rastrové, 3200 × 1800 px; text se nedá samostatně označit.
Online bibliografické odkazy jsou doplněny jako PDF anotace.
Pro otevření přes `file://` jsou obrázky připraveny v lokálním generovaném
JS souboru, aby se zabránilo zablokování canvasu kvůli přístupu k místním obrázkům.

## Lokální revize 11. 11. 2026

- Odstraněn metodický druhý slide; 17 slidů, plán 12:25.
- Zkráceny titulky a sdělení, odstraněny výzvy k doplnění rozhovorů.
- Dva modelové scénáře konkrétně rozvíjejí provoz, spolupráci a důvěru v týmu.
- Střídmější sazba, jemné linky, tlumená modrá, menší ilustrace případů.
- Opraveny neplatné CSS pseudoselektory (focus, fullscreen, backdrop).
- Statická kontrola prošla pro 17 slidů; lokální slide s dopady vizuálně ověřen v Safari.
- PDF exporter zachován, nový export nebyl v této revizi znovu vizuálně ověřen.
- Žádný commit, push ani publikace této revize.

## Následná lokální úprava

16 slidů, plán 12:15. Odstraněn seznam rozhovorových podkladů a všechny jejich citace. Teoretické zdroje zachovány v patičkách a na slidu 16. Modelové dopady zůstávají označené. Doporučení mají šest oddělených polí, závěr obsahuje pouze otázku. Barvy: tmavě modrá a tlumená zelenomodrá na světlých plochách; tmavý text pro projektor.

Barevná korekce: návrat k původní modré #315cff, odstranění zelenomodré a pastelových karet. Syntéza používá šest otevřených typografických bloků s linkami a modrým číslováním. Pouze lokálně.
