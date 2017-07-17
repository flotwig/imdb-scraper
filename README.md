imdb-scraper
==========

This is an API which scrapes the [Internet Movie Database](http://www.imdb.com) for movie and TV show information. It supports both searching for movies and retrieving movies by ID. There is also a caching layer implemented in Redis.

## Using the API

The API has a public endpoint at https://imdb-scraper.herokuapp.com/ where the following functions can be found. You can also run your own instance if you wish.

### search - search IMDb titles

#### Request

```
GET /search?q=Game+of+Thrones&limit=20
```

* ```q``` - *Required.* The string to query IMDb with.
* ```limit``` - Optional. Maximum number of results to return. Defaults to 5.

#### Response

```json
{
    "success": true,
    "result": [{
        "id": "tt0944947",
        "title": "Game of Thrones",
        "year": "2011",
        "genres": ["Adventure", "Drama", "Fantasy", "Romance"],
        "plot": "Nine noble families fight for control over the mythical lands of Westeros, while a forgotten race returns after being dormant for thousands of years.",
        "runtime": "56min",
        "rating": "9.5",
        "votes": "1,176,171",
        "photoUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMjE3NTQ1NDg1Ml5BMl5BanBnXkFtZTgwNzY2NDA0MjI@._V1_UX182_CR0,0,182,268_AL_.jpg",
        "directors": [],
        "writers": [{
            "name": "David Benioff",
            "id": "nm1125275"
        }, {
            "name": "D.B. Weiss",
            "id": "nm1888967"
        }],
        "stars": [{
            "name": "Emilia Clarke",
            "id": "nm3592338"
        }, {
            "name": "Peter Dinklage",
            "id": "nm0227759"
        }, {
            "name": "Kit Harington",
            "id": "nm3229685"
        }],
        "retrieved": "2017-07-17T00:44:40.001Z"
    }, {
        "id": "tt2231444",
        "title": "Game of Thrones (2012)",
        "year": "2012",
        "genres": ["Action", "Adventure", "Fantasy", "Thriller"],
        "plot": "Enter the gritty and medieval fantasy world of Westeros as players will forge alliances and wage battles as they play a pivotal role in the ongoing war for power of the Seven Kingdoms.",
        "runtime": "",
        "rating": "8.1",
        "votes": "1,231",
        "photoUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMjE5NTk5NDg3OV5BMl5BanBnXkFtZTgwNDExNzg2MDE@._V1_UY268_CR4,0,182,268_AL_.jpg",
        "directors": [{
            "name": "Cédric Lagarrigue",
            "id": "nm3023070"
        }],
        "writers": [{
            "name": "George R.R. Martin",
            "id": "nm0552333"
        }],
        "stars": [{
            "name": "Emma Bryant",
            "id": "nm7504167"
        }, {
            "name": "James Cosmo",
            "id": "nm0181920"
        }, {
            "name": "Conleth Hill",
            "id": "nm0384152"
        }],
        "retrieved": "2017-07-17T00:44:39.546Z"
    }, {
        "id": "tt3109620",
        "title": "Game of Thrones",
        "year": "2013",
        "genres": ["Talk-Show"],
        "plot": "Join the co-creators of Game of Thrones, the hit HBO series based on the books by George R. R. Martin.",
        "runtime": "23min",
        "rating": "7.3",
        "votes": "20",
        "photoUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTc4NzYxNDg5M15BMl5BanBnXkFtZTgwMTM3NTEzMjE@._V1_UY268_CR87,0,182,268_AL_.jpg",
        "directors": [],
        "writers": [],
        "stars": [{
            "name": "Jim Rash",
            "id": "nm0711110"
        }, {
            "name": "David Benioff",
            "id": "nm1125275"
        }, {
            "name": "D.B. Weiss",
            "id": "nm1888967"
        }],
        "retrieved": "2017-07-17T00:44:40.051Z"
    }, {
        "id": "tt2653342",
        "title": "Game of Thrones: Season 2 - Character Profiles (2013)",
        "year": "2013",
        "genres": ["Documentary", "Short"],
        "plot": "Get to know the major power players in Season 2 of 'Game of Thrones' with these seven profiles, including Renly and Stannis Baratheon, Robb Stark, Theon Greyjoy and more.",
        "runtime": "16min",
        "rating": "8.9",
        "votes": "916",
        "photoUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BMTU1MzU2MDE4MV5BMl5BanBnXkFtZTgwNTc3NzA2MDE@._V1_UY268_CR87,0,182,268_AL_.jpg",
        "directors": [],
        "writers": [],
        "stars": [{
            "name": "Alfie Allen",
            "id": "nm0654295"
        }, {
            "name": "Gethin Anthony",
            "id": "nm2167445"
        }, {
            "name": "John Bradley",
            "id": "nm4263213"
        }],
        "retrieved": "2017-07-17T00:44:39.361Z"
    }, {
        "id": "tt3391176",
        "title": "Game of Thrones: A Telltale Games Series (2014)",
        "year": "2014",
        "genres": ["Adventure", "Drama", "Fantasy"],
        "plot": "During the War of the Five Kings, House Forrester finds themselves embroiled in a web of deceit and corruption.",
        "runtime": "",
        "rating": "8.8",
        "votes": "2,115",
        "photoUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BYmY5ZjFkOTMtMWYxYy00ZjllLTg5MWMtYTA0OTU3YTNkNmExXkEyXkFqcGdeQXVyMjA1MTA1NDQ@._V1_UY268_CR43,0,182,268_AL_.jpg",
        "directors": [{
            "name": "Jason Latino",
            "id": "nm6339980"
        }, {
            "name": "Martin Montgomery",
            "id": "nm6961201"
        }],
        "writers": [{
            "name": "Andrew Grant",
            "id": "nm6806302"
        }, {
            "name": "Ryan Kaufman",
            "id": "nm0442251"
        }],
        "stars": [{
            "name": "Lena Headey",
            "id": "nm0372176"
        }, {
            "name": "Natalie Dormer",
            "id": "nm1754059"
        }, {
            "name": "Peter Dinklage",
            "id": "nm0227759"
        }],
        "retrieved": "2017-07-17T00:44:40.627Z"
    }]
}
```

### title - get a single title

#### Request

```
GET /title?id=tt0182576
```

* ```id``` - *Required.* The ID, in tt\* format, of the title to find.

#### Response

```json
{
    "success": true,
    "result": {
        "id": "tt0182576",
        "title": "Family Guy",
        "year": "1999",
        "genres": ["Animation", "Comedy"],
        "plot": "In a wacky Rhode Island town, a dysfunctional family strive to cope with everyday life as they are thrown from one crazy scenario to another.",
        "runtime": "22min",
        "rating": "8.2",
        "votes": "254,309",
        "photoUrl": "https://images-na.ssl-images-amazon.com/images/M/MV5BNGRkMTllZTUtZTQyYi00NjVlLTlhZjEtODExNjQ4YjQ1Y2RjXkEyXkFqcGdeQXVyNTA4NzY1MzY@._V1_UY268_CR0,0,182,268_AL_.jpg",
        "directors": [],
        "writers": [{
            "name": "Seth MacFarlane",
            "id": "nm0532235"
        }, {
            "name": "David Zuckerman",
            "id": "nm0958412"
        }],
        "stars": [{
            "name": "Seth MacFarlane",
            "id": "nm0532235"
        }, {
            "name": "Alex Borstein",
            "id": "nm0097504"
        }, {
            "name": "Seth Green",
            "id": "nm0001293"
        }],
        "retrieved": "2017-07-17T00:46:10.692Z"
    }
}
```

### API errors

If there is an error with your request, a message following this format will be returned:

```
{
    "success": false,
    "error": "Some error message here."
}
```

## Running the API

This API is written in TypeScript and the files in ```build/``` are auto-generated by ```tsc -w```. Run ```npm start``` to start ```build/index.js```.

To enable debug output on errors, set the ```DEBUG``` environment variable.

To use Redis for caching, set the ```REDIS_URL``` environment variable to one parsable by the NodeJS redis library.