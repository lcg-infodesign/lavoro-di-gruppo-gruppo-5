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
      folder.height = lerp(folder.height, height, 0.05); // Espande la cartella attiva
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
  text(folder.tabText, folder.tabX + tabWidth / 2, folder.y - tabHeight / 2);

  // Contenitore del testo (solo per "Introduzione")
  if (folder.index === activeFolderIndex && folder.tabText === "Introduzione") {
    drawTextContainer(folder.x, folder.y, folderWidth, folder.height, folder.color);
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

function drawTextContainer(x, y, w, h, color) {
  let textX = x + 100; // Padding laterale di 100px
  let textY = y + 50; // Padding superiore di 50px
  fill(color);
  noStroke();
  rect(x, y, w, h, 5); // Rettangolo dello stesso colore della cartella

  fill(0);
  textAlign(LEFT, TOP);
  textSize(14);

  let visibleText = introText.slice(0, typingIndex);
  text(visibleText, textX, textY, w - 200, h - 100); // Riduci la larghezza del testo per rispettare il padding destro e sinistro

  if (typingIndex < introText.length) {
    typingIndex++;
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
        activeFolderIndex = -1; // Chiudi la cartella se è già attiva
        typingIndex = 0; // Resetta l'effetto macchina da scrivere
      } else {
        activeFolderIndex = folder.index; // Apri la cartella cliccata
        typingIndex = 0; // Inizia l'effetto macchina da scrivere
      }
      break;
    }
  }
}
