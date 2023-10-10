let result = document.getElementById("result");
let searchbtn= document.getElementById("search-btn");
let cityStates = document.getElementById("city");
let historySelect = document.getElementById("search-history-select");
let clearHistoryButton = document.getElementById("clear-history-button");
let key= "d975e7b7e218ce667608b84b5fae85c4";
let key1 = "tfTzGqGJhYyUjdGH6MM1CK5fnCBujx1Uhia4FETkcj5jp2v0dIVhBKNO";

const spinner = document.createElement("div");
spinner.className = "spinner";
searchbtn.appendChild(spinner);

//function to hide spinner
let hideSpinner = () => {
    spinner.style.display = "none";
    document.querySelector('#search-text').style.display = 'block';
  }
let showSpinner = () => {
    spinner.style.display = "inline-block";
    document.querySelector('#search-text').style.display = 'none';

  }


//fetch weather details from API and display them
let getWeather = () => {
    let cityValue = cityStates.value;

    //checking if input field is empty
    if(cityValue.length == 0){
        result.innerHTML=`<h3>Please enter name and city</h3>`;
    }
    else{
    let url = `https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${key}&units=metric`;

    //clear input field
    cityStates.value="";
    fetch(url).then((resp) => resp.json())
    //checking if city name is valid
    .then((data) => {

        
        let imageUrl = `https://api.pexels.com/v1/search?query=${cityValue}&per_page=1`;
        fetch(imageUrl, {
            method:"GET",
            headers: {
                Accept: "application/json",
                Authorization: key1
            }
        })
            .then((resp) => resp.json())
            .then((imageData) => {
                if (imageData.photos && imageData.photos.length > 0) {
                    let cityImage = imageData.photos[0].src.original;
                    
                    // Set the city image as background
                    document.body.style.backgroundImage = `url(${cityImage})`;
                }
        result.innerHTML = `
        <h2>${data.name}</h2>
        <h4 class="weather">${data.weather[0].main}</h4> 
        <h4 class="desc">${data.weather[0].description}</h4>
        <img src="https://openweathermap.org/img/w/${data.weather[0].icon}.png">
        <h1>${data.main.temp} &#176;</h1>
        <div class="temp-container">
            <div>
                <h4 class="title">min</h4>
                <h4 class="temp">${data.main.temp_min}</h4>
            </div>
            <div>
                <h4 class="title">max</h4>
                <h4 class="temp">${data.main.temp_max}</h4>
            </div>
        
        </div>`;
       
            
                saveToLocalStorage(cityValue);
        })
            .catch(()=>{
                result.innerHTML=`<h3 class="msg">city not found</h3>`
            })
     })
        
    .catch(()=>{
        result.innerHTML=`<h3 class="msg">city not found</h3>`
    })  
}
};

let saveToLocalStorage = (cityValue) => {
    // Retrieve the existing history or initialize an empty array
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    console.log(history);


    if (!history.includes(cityValue)) {
        // Add the current cityValue to the history
        history.push(cityValue);

        // Save the updated history to local storage
        localStorage.setItem("weatherHistory", JSON.stringify(history));
    }
    populateHistoryDropdown();
};

// Function to populate the search history dropdown
let populateHistoryDropdown = () => {
    // Retrieve the history from local storage
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];

    history.reverse();
    
    historySelect.innerHTML = "";
    // Populate the dropdown with history items
    history.forEach((city) => {
        let option = document.createElement("option");
        option.value = city;
        option.textContent = city;
        historySelect.appendChild(option);
    });
};

let clearSearchHistory = () => {
    localStorage.removeItem("weatherHistory");
    historySelect.innerHTML = '<option value="" disabled selected>search history</option>'; // Clear the dropdown options
};

clearHistoryButton.addEventListener("click", clearSearchHistory);

// Populate the search history dropdown
historySelect.addEventListener("change", () => {
    let selectedCity = historySelect.value;
    cityStates.value = selectedCity;
    getWeather(selectedCity);
});





searchbtn.addEventListener("click", () => {
    getWeather();
    showSpinner();
    setTimeout(() => {
        hideSpinner();
      }, 2000); 
  });
  
window.addEventListener("load", getWeather);