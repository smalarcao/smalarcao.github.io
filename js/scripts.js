// Function to load XML data for publications
function loadXMLData() {
  const xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      const xmlDoc = this.responseXML;
      const publications = xmlDoc.getElementsByTagName('publication');
      const publicationsByYear = {};

      // Group publications by year
      for (let i = 0; i < publications.length; i++) {
        const pub = publications[i];
        const year = pub.getElementsByTagName('year')[0].textContent;
        if (!publicationsByYear[year]) {
          publicationsByYear[year] = [];
        }
        publicationsByYear[year].push(pub);
      }

      // Sort years in descending order
      const years = Object.keys(publicationsByYear).sort((a, b) => b - a);

      // Dynamically create pagination buttons
      const paginationContainer = document.getElementById('pagination-container');
      paginationContainer.innerHTML = ''; // Clear existing pagination

      // Add "All Publications" button
      const allButton = document.createElement('button');
      allButton.textContent = 'All';
      allButton.onclick = function () {
        showAllPublications(publications);
      };
      paginationContainer.appendChild(allButton);

      // Add year-based buttons
      years.forEach(year => {
        const button = document.createElement('button');
        button.textContent = year;
        button.onclick = function () {
          showYear(year, publicationsByYear);
        };
        paginationContainer.appendChild(button);
      });

      // Show publications for the first year by default
      showYear(years[0], publicationsByYear);
    }
  };
  xhttp.open('GET', 'xml/publications.xml', true);
  xhttp.send();
}

// Function to show publications for a given year
function showYear(year, publicationsByYear) {
  const publications = publicationsByYear[year];
  renderPublications(publications);

  // Set active button
  setActivePaginationButton(year);
}

// Function to show all publications
function showAllPublications(publications) {
  renderPublications(publications);

  // Set active button
  setActivePaginationButton('All');
}

// Function to render publications
function renderPublications(publications) {
  const publicationList = document.getElementById('publications-page');
  publicationList.innerHTML = '';

  for (let i = 0; i < publications.length; i++) {
    const pub = publications[i];
    const title = pub.getElementsByTagName('title')[0].textContent;
    let author = pub.getElementsByTagName('author')[0].textContent;
    let name = "Soraia M. Alarcão";
    author = author.replace(name, '<strong>' + name + '</strong>');
    const year = pub.getElementsByTagName('year')[0].textContent;
    const abstract = pub.getElementsByTagName('abstract')[0].textContent;
    const conference = pub.getElementsByTagName('conference')[0]
      ? pub.getElementsByTagName('conference')[0].textContent
      : '';
    const journal = pub.getElementsByTagName('journal')[0]
      ? pub.getElementsByTagName('journal')[0].textContent
      : '';
    const venue = conference || journal || 'Unknown Venue';
    const acronym = pub.getElementsByTagName('acronym')[0].textContent;
    const doi = pub.getElementsByTagName('doi')[0].textContent;

    publicationList.innerHTML += `
      <div class="publication">
        <h3>${title}</h3>
        <p class="abstract">${abstract}</p>
        <p class="author">${author}</p>
        <p><span class="acronym">${acronym}</span> 
           <span class="separator"> &#8226;</span> 
           <span class="venue">${venue}</span>
           <span class="separator"> &#8226;</span> 
           <span class="year">${year}</span>
           <span class="separator"> &#8226;</span>
           <span class="doi"> DOI:</span> 
           <a href=${doi} target="_blank"><i class="doi">${doi}</i></a>
        </p>
      </div>
    `;
  }
}

// Function to set active pagination button
function setActivePaginationButton(label) {
  const paginationButtons = document.querySelectorAll('.pagination button');
  paginationButtons.forEach(button => {
    button.classList.remove('active-page-button');
  });
  const activeButton = Array.from(paginationButtons).find(button => button.textContent === label);
  if (activeButton) {
    activeButton.classList.add('active-page-button');
  }
}

// Function to show a section based on the menu link clicked
function showSection(sectionId) {
  const sections = document.querySelectorAll('.content');
  sections.forEach(section => {
    section.classList.remove('active-section');
  });

  const activeSection = document.getElementById(sectionId + '-section');
  activeSection.classList.add('active-section');
}

// Initialize page on load
window.onload = () => {
  loadXMLData();
};

// Handle menu link clicks to switch sections
const menuLinks = document.querySelectorAll('.menu-link');
menuLinks.forEach(link => {
  link.addEventListener('click', event => {
    event.preventDefault();

    // Remove active class from all menu links
    menuLinks.forEach(link => link.classList.remove('active'));
    link.classList.add('active');

    const sectionId = link.getAttribute('href').substring(1);
    showSection(sectionId); // Show the selected section
  });
});
