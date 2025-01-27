const periods = [
  { id: 2, name: 'Epoca Fascista', range: [1922, 1943] },
  { id: 3, name: 'Il Dopoguerra', range: [1944, 1950] },
  { id: 4, name: 'Il Boom Economico', range: [1951, 1967] },
  { id: 5, name: 'Il Sessantotto', range: [1968, 1980] },
  { id: 6, name: 'Gli Anni 80â€™ e 90â€™', range: [1981, 1999] },
  { id: 7, name: 'Nuovo Millennio', range: [2000, 9999] },
];

const symbolToCategory = {
  '∅': 'politica',
  '∓': 'religione',
  '≡': 'violenza',
  '∇': 'sesso',
};

const findBanningPeriod = (banningDate) => {
  for (const period of periods) {
    if (
      banningDate >= period['range'][0] &&
      banningDate <= period['range'][1]
    ) {
      return period['name'];
    }
  }
};

let loadedData = [];
const loadCSV = async (url) => {
  try {
    const response = await fetch(url);
    const text = await response.text();
    const lines = text.split(/\r?\n/).map((line) => line.split(','));
    const headers = lines[0];
    const data = lines.slice(1);

    let films = data.map((row, index) => {
      const film = headers.reduce((acc, header, i) => {
        acc[header] = row[i].toString();
        return acc;
      }, {});
      film['Banning Period'] =
        findBanningPeriod(film['Banning Date']) || 'Unknown';
      film['id'] = index + 1;
      return film;
    });
    loadedData = films;
    return films;
  } catch (error) {
    console.error('Error loading CSV:', error);
    return null;
  }
};

let activeFolder = null;

function toggleFolder(index) {
  const folders = document.querySelectorAll('.folder');
  const clickedFolder = document.getElementById(`folder-${index}`);

  if (clickedFolder.classList.contains('film-open')) {
    clickedFolder.classList.remove('film-open');
    clickedFolder.classList.add('open');
  } else if (clickedFolder.classList.contains('open')) {
    folders.forEach((folder) => {
      if (folder !== clickedFolder) {
        folder.classList.remove('not-visible');
      } else {
        clickedFolder.classList.remove('open');
      }
    });
  } else {
    folders.forEach((folder) => {
      if (folder !== clickedFolder) {
        folder.classList.add('not-visible');
      } else {
        clickedFolder.classList.add('open');
      }
    });
  }
}

function displayFilmInfo(film) {
  const folderId = periods.find(
    (period) => period['name'] === film['Banning Period']
  )['id'];
  const folder = document.getElementById(`folder-${folderId}`);
  const filmInfo = document.getElementById(`film-${folderId}`);
  filmInfo.innerHTML = '';

  folder.classList.remove('open');
  folder.classList.add('film-open');

  const asideElement = document.createElement('aside');
  asideElement.classList.add('img-container');

  const imgElement = document.createElement('img');
  imgElement.src = `./assets/img/posters/${film['Title']}:d${film['id']}.png`;

  asideElement.appendChild(imgElement);

  const infoElement = document.createElement('div');
  infoElement.classList.add('info');

  const titleElement = document.createElement('h2');
  titleElement.innerHTML = film['Title'];

  const infoBox = document.createElement('div');
  infoBox.classList.add('info-box');

  const uscitaSection = document.createElement('section');
  const uscitaTitle = document.createElement('h3');
  uscitaTitle.innerHTML = 'Data Uscita:';
  const uscitaText = document.createElement('strong');
  uscitaText.innerHTML = film['Banning Date'];
  uscitaSection.appendChild(uscitaTitle);
  uscitaSection.appendChild(uscitaText);

  const registaSection = document.createElement('section');
  const registaTitle = document.createElement('h3');
  registaTitle.innerHTML = 'Regista:';
  const registaText = document.createElement('strong');
  registaText.innerHTML = film['Directors'];
  registaSection.appendChild(registaTitle);
  registaSection.appendChild(registaText);

  const censuraSection = document.createElement('section');
  const censuraTitle = document.createElement('h3');
  censuraTitle.innerHTML = 'Motivo Censura:';
  const censuraText = document.createElement('strong');
  censuraText.innerHTML =
    film['Censorship Symbols'] + ' ' + film['Categorie censura'];
  censuraSection.appendChild(censuraTitle);
  censuraSection.appendChild(censuraText);

  const linkSection = document.createElement('section');
  const linkTitle = document.createElement('h3');
  linkTitle.innerHTML = 'Link:';
  const linkText = document.createElement('a');
  linkText.href = film['URL'];
  linkText.innerHTML = film['URL'];
  linkText.target = '_blank';
  linkSection.appendChild(linkTitle);
  linkSection.appendChild(linkText);

  infoBox.appendChild(uscitaSection);
  infoBox.appendChild(registaSection);
  infoBox.appendChild(censuraSection);
  infoBox.appendChild(linkSection);

  infoElement.appendChild(titleElement);
  infoElement.appendChild(infoBox);

  filmInfo.appendChild(asideElement);
  filmInfo.appendChild(infoElement);
}

function createList(sectionName) {
  const section = periods.find((period) => period.name === sectionName);
  const folder = document.getElementById(`content-${section['id']}`);

  const films = loadedData;
  const sectionFilms = films.filter(
    (film) => film['Banning Period'] === section['name']
  );

  const yearFilms = sectionFilms.reduce((acc, film) => {
    const year = film['Banning Date'];
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(film);
    return acc;
  }, {});

  const filmsContainer = document.createElement('div');
  for (const year in yearFilms) {
    if (yearFilms.hasOwnProperty(year)) {
      const filmList = yearFilms[year];

      const yearBtn = document.createElement('button');
      yearBtn.classList.add('year');
      yearBtn.innerHTML = year;
      yearBtn.onclick = () => {
        if (yearBtn.classList.contains('showed')) {
          yearBtn.classList.remove('showed');
          const films = folder.querySelectorAll(`.year-${year}`);
          films.forEach((film) => {
            film.classList.remove('showed');
          });
        } else {
          yearBtn.classList.add('showed');
          const films = folder.querySelectorAll(`.year-${year}`);
          films.forEach((film) => {
            film.classList.add('showed');
          });
        }
      };
      filmsContainer.appendChild(yearBtn);

      let filmsBtns = filmList.map((film) => {
        const filmBtn = document.createElement('button');
        filmBtn.classList.add('film');

        const symbols = film['Censorship Symbols'].split('');
        const categorieCensura = symbols.map(
          (symbol) => symbolToCategory[symbol]
        );
        symbols.forEach((symbol) => {
          const category = symbolToCategory[symbol];
          const symbolSpan = document.createElement('span');

          symbolSpan.classList.add('symbol');
          symbolSpan.innerHTML = symbol;

          symbolSpan.onclick = () => {
            if (symbolSpan.classList.contains('showed')) {
              symbolSpan.classList.remove('showed');
              const films = folder.querySelectorAll(`.symbol-${category}`);
              films.forEach((film) => {
                film.classList.remove('showed');
              });
            } else {
              symbolSpan.classList.add('showed');
              const films = folder.querySelectorAll(`.symbol-${category}`);
              films.forEach((film) => {
                film.classList.add('showed');
              });
            }
          };

          filmBtn.appendChild(symbolSpan);
        });

        const textBtn = document.createElement('span');
        textBtn.innerHTML = film['Title'];
        textBtn.classList.add('text');

        // Ensure the year is a valid CSS class name
        const yearClass = `year-${year}`;
        textBtn.classList.add(yearClass);

        // Ensure the category is a valid CSS class name
        categorieCensura.forEach((category) => {
          const categoryClass = `symbol-${category}`;
          textBtn.classList.add(categoryClass);
        });

        textBtn.onclick = () => {
          if (textBtn.classList.contains('showed')) {
            displayFilmInfo(film);
            return;
          }
          textBtn.classList.add('showed');
        };

        filmBtn.appendChild(textBtn);
        return filmBtn;
      });

      filmsBtns.forEach((btn) => filmsContainer.appendChild(btn));
      folder.appendChild(filmsContainer);
    }
  }

  return sectionFilms;
}

const main = async () => {
  const csvUrl = './data.csv';
  await loadCSV(csvUrl);
  for (const period of periods) {
    createList(period['name']);
  }
};

main();

// Selezioniamo tutti gli elementi della legenda con la classe "legend-item"
const legendItems = document.querySelectorAll('.legend-item');

// Aggiungiamo un evento mouseover a ciascun elemento
legendItems.forEach((item) => {
  item.addEventListener('mouseover', function () {
    // Mostra la descrizione
    const description = this.querySelector('.description');
    description.style.display = 'inline-block';
  });

  item.addEventListener('mouseout', function () {
    // Nascondi la descrizione quando il mouse esce
    const description = this.querySelector('.description');
    description.style.display = 'none';
  });
});