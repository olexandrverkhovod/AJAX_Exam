let input = document.getElementById("name");
let submit = document.getElementById("submit");

input.addEventListener("keyup", function () {
    if (event.keyCode === 13) {
        event.preventDefault();
        ClearPage();
        FetchFilm(input.value, page, 0);
    }
});

submit.addEventListener('click', function () {
    ClearPage();
    FetchFilm(input.value, page, 0);
});

let btn = document.createElement("button");
btn.innerText = "Следущая";
let btnLast = document.createElement("button");
btnLast.innerText = "Предыдущая";

btn.addEventListener('click', function () { FetchFilm(input.value, page, 1); });
btnLast.addEventListener('click', function () { FetchFilm(input.value, page, -1); });

let page = 1;

let wrapper = document.createElement("div");
wrapper.setAttribute('id', 'wrapper');
document.getElementById("panel").appendChild(wrapper);

function FetchFilm(name, pages, increment) {
    pages = pages + increment;
    page = pages;

    let url = `http://www.omdbapi.com/?s=${name}&page=${pages}&apikey=77643b2f`;

    fetch(url)
        .then(response => response.json())
        .then(myJson => {
            obj = myJson;
            wrapper.innerHTML = '';
            document.getElementById('fav-list').innerHTML = '';
            for (let i = 0; i < obj.Search.length; i++) {
                let element = document.createElement('div');
                element.classList.add("element");

                let inner = document.createElement('div');
                inner.classList.add("inner");
                let img = document.createElement('img');
                img.setAttribute("src", `${obj.Search[i].Poster}`);
                inner.appendChild(img);

                let p1 = document.createElement('p');
                p1.classList.add('movie_title');
                p1.innerText = `${obj.Search[i].Title}`;
                let p2 = document.createElement('p');
                p2.innerText = `${obj.Search[i].Year}`;


                let fav = document.createElement('a'); // favourite button
                fav.classList.add("btn-more")

                let liked = false;

                for (let j = 0; j < films.length; j++) { // checking if the film is in the favourite section
                    if (obj.Search[i].imdbID == films[j].id) {
                        liked = true
                    }
                }

                if (liked == true) { // if yes, we color the remove button red
                    fav.innerText = 'Убрать из фавов'
                    fav.classList.add('btn-red')
                    fav.classList.remove('btn-green')
                } else { // if no, we color the remove button green
                    fav.innerText = 'Добавить в фавы'
                    fav.classList.add('btn-green')
                    fav.classList.remove('btn-red')
                }

                fav.addEventListener('click', function () { saveId(obj.Search[i].imdbID, this) });

                element.appendChild(inner);
                element.appendChild(p1);
                element.appendChild(p2);
                element.appendChild(document.createElement('br'));
                element.appendChild(fav);

                wrapper.appendChild(element);
            }

            document.getElementById("nav").appendChild(btnLast);
            document.getElementById("nav").appendChild(btn);

            if (pages == 1) {
                btnLast.disabled = true;
            } else {
                btnLast.disabled = false;
            };

            if (page >= (parseInt(obj.totalResults) / 10)) {
                btn.disabled = true;
            } else {
                btn.disabled = false;
            }

        })
}

let films = JSON.parse(localStorage.films || '[]');

function saveId(_id, button) {
    let btn = button
    let present = false;
    let arrayindex = ''

    for (let i = 0; i < films.length; i++) {

        if (_id == films[i].id) {
            present = true
            arrayindex = i
        }
    }

    if (present == false) {
        films.push({ 'id': `${_id}` })
        localStorage.setItem("films", JSON.stringify(films));
        console.log(localStorage.getItem("films"))
        btn.innerText = 'Убрать из фавов'
        btn.classList.add('btn-red')
        btn.classList.remove('btn-green')
    }

    if (present == true) {
        films.splice(arrayindex, 1)
        localStorage.setItem("films", JSON.stringify(films));
        console.log(localStorage.getItem("films"))
        btn.innerText = 'Добавить в фавы';
        btn.classList.add('btn-green');
        btn.classList.remove('btn-red');

    }

    present = false;
    arrayindex = ''
}

function ClearPage() { // each new search should start from the first page
    page = 1;
}

function ClearWrapper() {
    wrapper.innerHTML = ''
}

function favouriteListBuild() {
    wrapper.innerHTML = ''
    document.getElementById('fav-list').innerHTML = ''
    document.getElementById('fav-list').innerText = ''

    for (let i = 0; i < films.length; i++) {
        fetch(`https://www.omdbapi.com/?i=${films[i].id}&plot=full&apikey=77643b2f`)
            .then(response => response.json())
            .then(myJson => {
                object = myJson;
                let fav_element = document.createElement('div');
                fav_element.classList.add('fav-element');
                let fav_title = document.createElement('p')
                fav_title.innerHTML = `${object.Title}`;
                let fav_year = document.createElement('p')
                fav_year.innerHTML = `${object.Year}`
                let fav_img = document.createElement('img')
                fav_img.setAttribute('src', `${object.Poster}`)

                let fav_btn = document.createElement('a'); // favourite button
                fav_btn.classList.add("btn-fav")
                fav_btn.innerText = "Убрать из фавов"
                fav_btn.addEventListener('click', function () { deleteId(object.imdbID) })

                fav_element.appendChild(fav_img);
                fav_element.appendChild(fav_title);
                fav_element.appendChild(fav_year);
                fav_element.appendChild(fav_btn);

                document.getElementById('fav-list').appendChild(fav_element);

                btn.disabled = true;
                btnLast.disabled = true;
            })
    }

    if (films.length == 0) {
        document.getElementById('fav-list').innerText = 'Пусто. Добавьте фильм в фавы.'
    }

}

document.getElementById('fav-call').addEventListener('click', function () {
    favouriteListBuild();
});


function deleteId(id) {
    let arrayindex = '';

    for (let i = 0; i < films.length; i++) {

        if (id == films[i].id) {
            arrayindex = i;
        }
    }

    films.splice(arrayindex, 1);
    localStorage.setItem("films", JSON.stringify(films));
    console.log(localStorage.getItem("films"));

    favouriteListBuild();
    arrayindex = '';
}