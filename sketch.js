// Parametri globali
let folders = [];
let activeFolderIndex = -1; // Nessuna cartella attiva all'inizio
let folderHeight = 600;
let folderWidth = 1080;
let tabHeight = 46;
let tabWidth = 233;

// Distanze irregolari tra le cartelle
let folderSpacings = [72, 80, 85, 75, 73, 80, 90, 95]; // Array di distanze predefinite

let tabColors = [
  "#E0DED8", // Introduzione
  "#D4C2AC", // Epoca Fascista
  "#C29A9E", // Il Dopoguerra
  "#978C7A", // Il Boom Economico
  "#A9BAD1", // Il Sessantotto
  "#67796B", // Gli Anni 80’ e 90’
  "#CAE2C1", // Nuovo Millennio
  "#F5C3A8", // About
];

let titles = [
  "Introduzione",
  "Epoca Fascista",
  "Il Dopoguerra",
  "Il Boom Economico",
  "Il Sessantotto",
  "Gli Anni 80’ e 90’",
  "Nuovo Millennio",
  "About",
];

let introText = `Il rapporto tra cinema e censura è da sempre complesso e affascinante, un dialogo continuo tra espressione artistica e controllo sociale. Attraverso i decenni, la censura ha plasmato il linguaggio cinematografico, imponendo limiti che hanno spesso costretto registi e autori a trovare soluzioni creative per aggirare o reinterpretare tali vincoli. Questo progetto esplora le dinamiche tra ciò che viene mostrato e ciò che viene nascosto, analizzando come il cinema, nelle sue molteplici forme, sia stato al tempo stesso vittima e oppositore della censura.`;

let typingIndex = 0;
let typingSpeed = 30; // Velocità dell'effetto macchina da scrivere

let dataset; // Variabile per contenere il dataset
let sectionData = {}; // Oggetto per gestire i dati di tutte le sezioni

function preload() {
  // Carica il dataset dalla cartella assets
  dataset = loadTable("assets/Censura-Cinematografica.csv", "header");
  brush = loadImage('assets/img/brush-texture.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let x = (width - folderWidth) / 2; // Centrare orizzontalmente
  let y = 100; // Margine superiore

  // Posizioni predefinite per le linguette, sfalsate ma non casuali
  let tabOffsets = [137, 497, 228, 681, 341, 735, 151, 642];

  // Creazione delle cartelle
  for (let i = 0; i < titles.length; i++) {
    let tabX = x + tabOffsets[i % tabOffsets.length]; // Posizione sfalsata della linguetta
    folders.push({
      x: x,
      y: y,
      tabX: tabX,
      color: tabColors[i],
      tabText: titles[i],
      index: i,
      active: false, // Stato attivo o meno
      targetY: y, // Obiettivo posizione verticale
      height: folderHeight, // Altezza dinamica della cartella
    });
    y += folderSpacings[i % folderSpacings.length]; // Aggiungi una distanza irregolare tra le cartelle
  }

  // Prepara i dati per tutte le sezioni
  prepareData();
}

function draw() {
  background("#F3F2F1");
  drawTitle();

  // Disegna tutte le cartelle
  for (let i = 0; i < folders.length; i++) {
    let folder = folders[i];

    // Aggiorna l'animazione delle cartelle
    if (activeFolderIndex === folder.index) {
      folder.targetY = 100; // Posizione superiore
      folder.height = lerp(folder.height, windowHeight - 100, 0.05); // Espande la cartella attiva fino a fine schermo
    } else if (activeFolderIndex !== -1) {
      folder.targetY = height + 100; // Sposta le altre cartelle fuori schermo
      folder.height = lerp(folder.height, 0, 0.05); // Riduci altezza delle cartelle non attive
    } else {
      folder.targetY = 100 + i * folderSpacings[i % folderSpacings.length]; // Torna alla posizione originale
      folder.height = lerp(folder.height, folderHeight, 0.05); // Ripristina altezza originale
    }

    folder.y = lerp(folder.y, folder.targetY, 0.05); // Transizione morbida verso la posizione target

    drawFolder(folder);
  }
}

function drawTitle() {
  textAlign(CENTER, CENTER);
  textSize(30);
  fill(0);
  text("Cinecensurati", width / 2, 50);
}

function drawFolder(folder) {
  // Corpo della cartella
  noStroke();
  fill(folder.color);
  rect(folder.x, folder.y, folderWidth, folder.height, 7);

  // Linguetta
  drawTab(folder.tabX, folder.y - tabHeight, tabWidth, tabHeight, folder.color);

  // Testo nella linguetta
  drawTextHighlight(folder.tabX + tabWidth / 2, folder.y - tabHeight / 2, folder.tabText);
  fill(0);
  textAlign(CENTER, CENTER);
  textSize(16);
  textFont("Courier New");
  text(folder.tabText, folder.tabX + tabWidth / 2, folder.y - tabHeight / 2);

  // Contenitore del testo
  if (folder.index === activeFolderIndex) {
    if (folder.tabText === "Introduzione") {
      drawIntroContent(folder.x, folder.y, folderWidth, folder.height, folder.color);
    } else {
      drawSectionContent(folder.x, folder.y, folderWidth, folder.height, folder.color, folder.tabText);
    }
  }
}

function drawTab(x, y, w, h, color) {
  fill(color);
  noStroke();
  beginShape();

  // Parte superiore smussata
  vertex(x + 20, y); // Angolo smussato a sinistra
  vertex(x + w - 20, y); // Angolo smussato a destra
  vertex(x + w, y + h); // Parte bassa a destra
  vertex(x, y + h); // Parte bassa a sinistra

  endShape(CLOSE);
}

function drawTextHighlight(x, y, textContent) {
  textSize(16);
  let textWidthVal = textWidth(textContent) + 20;
  let textHeightVal = 24;
  fill("#FFFFFF");
  noStroke();
  rect(x - textWidthVal / 2, y - textHeightVal / 2, textWidthVal, textHeightVal, 3);
}

function drawIntroContent(x, y, w, h, color) {
  fill(color);
  noStroke();
  rect(x + 50, y + 50, w - 100, h - 100, 5);

  fill(0);
  textAlign(LEFT, TOP);
  textSize(14);
  let textX = x + 70;
  let textY = y + 70;

  let visibleText = introText.slice(0, typingIndex);
  text(visibleText, textX, textY, w - 140);

  if (typingIndex < introText.length) {
    typingIndex++;
  }
}

function drawSectionContent(x, y, w, h, color, section) {
  fill(color);
  noStroke();
  rect(x, y, w, h, 5);

  fill(0);
  textAlign(LEFT, TOP);
  textFont("Courier New"); // Imposta tutto il testo in Courier New
  textSize(16);
  textLeading(24);

  let textX = x + 50; // Margine laterale
  let textY = y + 50;
  let contentWidth = w - 100;

  let brushX = x + 52;
  let brushY = y + 52;

  let sectionContent = sectionData[section];

  push();
  for (const [date, films] of Object.entries(sectionContent)) {
    // Mostra la data in bold
    textStyle(BOLD);
    let dateText = date + " ";
    if (textX + textWidth(dateText) > x + contentWidth) {
      textX = x + 50; // Torna a capo
      textY += textSize() + 5;

      brushX = x + 50; // Torna a capo
      brushY += textSize() + 5;
    }
    text(dateText, textX, textY);
    textX += textWidth(dateText);
    brushX += textWidth(dateText);

    // Mostra i film in stile normale
    textStyle(NORMAL);
    for (const film of films) {
      let filmText = film + " ";
      if (textX + textWidth(filmText) > x + contentWidth) {
        textX = x + 50; // Torna a capo
        textY += textSize() + 5;

        brushX = x + 50; // Torna a capo
        brushY += textSize() + 5;
      }
      image(brush, brushX, brushY, textWidth(filmText) - 5, 10);
      text(filmText, textX, textY);
      textX += textWidth(filmText);
      brushX += textWidth(filmText);
    }
  }
  pop();
}

function prepareData() {
  const sections = {
    "Epoca Fascista": [1922, 1943],
    "Il Dopoguerra": [1944, 1950],
    "Il Boom Economico": [1951, 1967],
    "Il Sessantotto": [1968, 1980],
    "Gli Anni 80’ e 90’": [1981, 1999],
    "Nuovo Millennio": [2000, 9999],
  };

  for (const [section, range] of Object.entries(sections)) {
    sectionData[section] = {};
    dataset.rows.forEach(row => {
      let banningDate = parseInt(row.get("Banning Date"));
      if (banningDate >= range[0] && banningDate <= range[1]) {
        let title = row.get("Title");

        if (!sectionData[section][banningDate]) {
          sectionData[section][banningDate] = [];
        }

        sectionData[section][banningDate].push(title);
      }
    });

    sectionData[section] = Object.keys(sectionData[section])
      .sort((a, b) => parseInt(a) - parseInt(b))
      .reduce((acc, key) => {
        acc[key] = sectionData[section][key];
        return acc;
      }, {});
  }
}

function mousePressed() {
  for (let folder of folders) {
    if (
      mouseX > folder.tabX &&
      mouseX < folder.tabX + tabWidth &&
      mouseY > folder.y - tabHeight &&
      mouseY < folder.y
    ) {
      if (folder.index === activeFolderIndex) {
        activeFolderIndex = -1;
      } else {
        activeFolderIndex = folder.index;
        typingIndex = 0;
      }
      break;
    }
  }
}

