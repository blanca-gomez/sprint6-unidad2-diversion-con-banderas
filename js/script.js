
const getCountries = async () => {
    try{
        const response = await fetch ('https://restcountries.com/v3/all')
        if (!response.ok){
            throw new Error ('Ha surgido un error', response.status)
        }
        const countries = await response.json();
        return countries;
        
    }catch(error){
        console.log('Error al obtener los datos', error)
    }

}

const getCountrieName = ((countries) => {
    const filteredCountries = countries.map((country) => country.name.official);
    return filteredCountries;
});

const getFlags = ((countries) => {
    const countriesFlags = countries.map((country) => {
        return {
            name: country.name.official,
            flag: `https://flagcdn.com/${country.cca2.toLowerCase()}.svg`
        };
    })
    return countriesFlags;
})

function insertCountries (names, flags){
    const container = document.getElementById('countries-list');
    const list = document.createElement('ul');
    list.className = 'list';
    names.forEach((name, index) => {
        const listElement = document.createElement('li');
        listElement.className = 'list-element';
        const flagElement= document.createElement('img');
        flagElement.className = 'image';
        flagElement.src = flags[index].flag;
        flagElement.alt = name;
        const nameParagraph = document.createElement('p');
        nameParagraph.innerHTML = name;
        listElement.appendChild(flagElement);
        listElement.appendChild(nameParagraph);
        list.appendChild(listElement)
    })
    container.appendChild(list);
}

const clickFlags = function (allCountries) {
    const flags = document.querySelectorAll('.image');
    flags.forEach((flag, index) => {
        const country = allCountries[index]; // Obtener el país correspondiente a la bandera
        flag.addEventListener('click', () => {
            informationAboutCountries(
                country.name.official,
                country.population,
                flag.src,
                country.road?.driving_side // Algunos países pueden no tener información sobre el lado de la carretera
            );
        });
    });
}



function informationAboutCountries(countryName, population, flagURL,drivingSize){
    const modalContent = document.querySelector('.modal');
    modalContent.innerHTML = `
        <h2>${countryName}</h2>
        <p>Population: ${population}</p>
        <img src = ${flagURL}/>
        <p>Driving size: ${drivingSize}</P>
        <button id="buttonCloseModal">close</button>`;
   
    modalContent.style.display = 'block';

    const buttonClose = document.getElementById('buttonCloseModal');
    buttonClose.addEventListener('click', () => {
        modalContent.style.display = 'none';
    }) 
}


async function process () {
    try{
        const allCountries = await getCountries();
        const allClountriesNames =  getCountrieName(allCountries);
        console.log(allClountriesNames);
        const allClountriesflags = getFlags(allCountries);
        console.log(allClountriesflags);
        insertCountries(allClountriesNames,allClountriesflags);
        clickFlags(allCountries);
    }catch(error){
        console.log('Error al obtener los datos', error)
    }
}

process();
