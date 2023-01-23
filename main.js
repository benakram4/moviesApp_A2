/********************************************************************************* 
*  BTI425 – Assignment 2 
*  I declare that this assignment is my own work in accordance with Seneca Academic Policy.   
*  No part of this assignment has been copied manually or electronically from any other source 
*  (including web sites) or distributed to other students. 
*  
*  Name: Ben Akram Student ID: 158523217  Date: Jan 23 2023 
* 
********************************************************************************/ 

// dom requirement to run jsdom in node
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dom = new JSDOM();
global.document = dom.window.document;

var page = 1;
const perPage = 10;
const noImagePNG = "https://upload.wikimedia.org/wikipedia/commons/d/dc/No_Preview_image_2.png";

// ====================================================
//calculate time from minutes
// ====================================================
function calculateTime(minutes) {
    let hours = Math.floor(minutes / 60);
    let mins = (minutes % 60);
    return `${hours}h ${mins.toString().padStart(2, '0')}m`;
}
// ====================================================


// ====================================================
// Load the data from the API
// ====================================================
function loadMoviesData(title = null) {

    let url = (title ?
        `https://zany-teal-narwhal-cap.cyclic.app/api/movies?page=${page}&perPage=${perPage}&title=${title}`
        : `https://zany-teal-narwhal-cap.cyclic.app//api/movies?page=${page}&perPage=${perPage}`);

    //loading the data from the API
    fetch(url)
        .then((res) => res.json())
        .then((data) => {
            console.log(data)
            //Creating the <tr> Elements
            let postRows = `${data.map(movie => (
                `<tr data-id=${movie._id}>
                        <td>${movie.year}</td>
                        <td>${movie.title}</td>
                        <td>${movie.plot ? movie.plot : "N/A"}</td>
                        <td>${movie.rated ? movie.rated : "N/A"}</td>
                        <td>${calculateTime(movie.runtime)}</td>
                    </tr>`
            )).join('')}
                `;

            if (title != null) {
                document.querySelector(`#current-page`).innerHTML = 1;
                document.querySelector('.pagination').classList.add('d-none');
            } else {
                ;
                //document.querySelector(`#current-page`).innerHTML = page;
                document.querySelector('.pagination').classList.remove('d-none');
            }

            //Adding <tr> Elements to the Table Body
            document.querySelector('#moviesTable tbody').innerHTML = postRows;

            //Updating the "Current Page"
            document.querySelector(`#current-page`).innerHTML = page;

            //Adding Click Events & Loading / Displaying Movie Data
            document.querySelectorAll('#moviesTable tbody tr').forEach((row) => {
                row.addEventListener('click', (e) => {
                    // get the clicked movie ID
                    let movieID = row.getAttribute('data-id');
                    console.log(`The Movie ID is: ${movieID}`);

                    // load the movie data
                    fetch(`https://zany-teal-narwhal-cap.cyclic.app/api/movies/${movieID}`)
                        .then((res) => res.json())
                        .then((data) => {
                            console.log(data);

                            let modalBody = `
                                        <div class = "container">
                                            <div class="text-center">
                                                <img class="img-fluid" src="${data.poster ? data.poster : noImagePNG }"  alt="${data.title}">
                                            </div>
                                            <br><br>
                                            <div>
                                                <strong>Directed By:</strong> ${data.directors.length !== 0 ? data.directors.join(',') : "N/A"}<br><br>
                                                <p>${data.fullplot ? data.fullplot : "N/A" }</p>
                                                <strong>Cast: </strong> ${data.cast.length !== 0  ? data.cast.join(', ') : "N/A" }<br><br>
                                                <strong>Awards:</strong> ${data.awards.text ? data.awards.text : "N/A" }<br>
                                                <strong>IMDB Rating:</strong> ${data.imdb.rating} (${data.imdb.votes}) votes<br> 
                                            </div>
                                        </div>
                                    `;

                            document.querySelector('#detailsModal .modal-title').innerHTML = data.title;

                            document.querySelector('#detailsModal div .modal-body').innerHTML = modalBody;

                            let myModal = new bootstrap.Modal(document.getElementById('detailsModal'), {
                                backdrop: 'static', // default true - "static" indicates that clicking on the backdrop will not close the modal window
                                keyboard: false, // default true - false indicates that pressing on the "esc" key will not close the modal window
                                focus: true, // default true - this instructs the browser to place the modal window in focus when initialized
                              });
                              myModal.show();
                        });
                });
            });

        })
        console.log(`AAAA : ${page}`)
}
// ====================================================


// ====================================================
// Nav Bar/Search bar button functionality
// ====================================================
function buttonFunc() {

    //if search button is clicked, load the data with the search bar value
    document.querySelector('#searchForm').addEventListener('submit', (event) => {
        // prevent the form from from 'officially' submitting
        event.preventDefault();
        // populate the table with the search results
        console.log(`page val in search ${page}`);
        page = 1;
        loadMoviesData(document.querySelector('#findTitle').value);
    });

    //clear button click event,  clear the search bar and load the data
    document.querySelector('#clearButton').addEventListener('click', (event) => {
        document.querySelector('#findTitle').value = "";
        page = 1;
        loadMoviesData();
    });

    //added by me for extra functionality
    // navbar-brand click event, clear the search bar and load the data
    document.querySelector('#navTitle').addEventListener('click', (event) => {
        document.querySelector('#findTitle').value = "";
        page = 1;
        loadMoviesData();
    })
}
// ====================================================


// ====================================================
// Pagination Buttons Functionality
// ====================================================
function paginationFunc() {

    console.log(`BBBB : ${page}`)
    //if the next button is clicked, load the next page
    document.querySelector('#next-page').addEventListener('click', (event) => {
        page++;
        return loadMoviesData();
    });

    //if the previous button is clicked and page is greater than 1, load the previous page
    document.querySelector('#previous-page').addEventListener('click', (event) => {
        if (page > 1) {
            page--;
            return loadMoviesData();
        }
    });
}
// ====================================================


// ====================================================
// Execute when the DOM is 'ready'
// ====================================================
document.addEventListener('DOMContentLoaded', function () {

    // loadMoviesData("The Matrix"); // for testing, remove before submission
    loadMoviesData();

    // Search bar button functionality
    buttonFunc();

    // Pagination Buttons Functionality
    paginationFunc();

});
// ====================================================