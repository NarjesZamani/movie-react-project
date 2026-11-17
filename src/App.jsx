import Search from "./assets/componenets/Search";
import Spinner from "./assets/componenets/Spinner";
import MovieCard from "./assets/componenets/MovieCard";
import { useDebounce } from "react-use";
import { useEffect, useState } from "react";
//import { getTrendingMovie, updateSearchCount } from "./appwrite";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TDMB_API_KEY;

const API_OPTION = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  //const [trendingMovies, setTrendingMovies] = useState([]);

  /* const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTION);
      if (!response.ok) {
        throw new Error("Faild to fetch movies");
      }
      const data = await response.json();

      if (data.Response === "false") {
        setErrorMessage(data.Error || "Faild to fetch movies");
        setMovieList([]);
        return;
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies, Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };*/

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTION);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      setMovieList(data.results || []);

      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(`Error fetching movies: ${error}`);
      setErrorMessage("Error fetching movies, Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  /* const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovie();
      setTrendingMovies(movies);
    } catch (error) {
      console.log(error);
    }
  };*/

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  /* useEffect(() => {
    loadTrendingMovies();
  }, []);*/

  return (
    <main >
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <div class="flex w-full justify-between items-center">
            <nav class="flex gap-x-5 lg:gap-x-9 h-14">
              <div class="shrink-0">
                <img src="./logo.png" alt="Golden Coffee" />
              </div>
              <ul class="flex gap-x-5 lg:gap-x-9 items-center text-xl h-full text-gray-300 tracking-tightest child:leading-[56px] ">
                <li class="font-DanaDemi text-orange-200">
                  <a href="#">صفحه اصلی</a>
                </li>

                <li>
                  <a href="#">خانه</a>
                </li>
                <li>
                  <a href="#">بلاگ</a>
                </li>
                <li>
                  <a href="#">درباره ما</a>
                </li>
                <li>
                  <a href="#">تماس با ما</a>
                </li>
              </ul>
            </nav>
          </div>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>
            Find <span className="text-gradient">Movies</span>You'll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2>All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
};

export default App;
