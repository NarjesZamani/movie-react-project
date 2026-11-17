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



  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);


  return (
    <main >
      <div className="pattern" />

      <div className="wrapper">
        <header>
          <div class="flex w-full justify-between items-center mb-20">
            <nav class="flex gap-x-5 lg:gap-x-9">
              <div class="shrink-0 w-[180px] ml-[150px]">
                <img src="./Logoo.png" alt="Movie Logo" />
              </div>
              <ul class="flex  lg:gap-x-10 items-center justify-center text-xl h-full text-gray-300 mt-5 ">
                <li class="font-DanaDemi text-orange-300">
                  <a href="#">خانـــه</a>
                </li>
                <li>
                  <a href="#">فیلــم</a>
                </li>
                <li>
                  <a href="#">سریــال</a>
                </li>
                <li>
                  <a href="#">انیمیشــن</a>
                </li>
                <li>
                  <a href="#">اشتــراک</a>
                </li>
              </ul>
            </nav>
          </div>
          <img src="./hero.png" alt="Hero Banner" />
          <h1 className="text-5xl py-8">
        اینجا میتونی  <span className="text-gradient">فیلم </span> مورد علاقت را پیدا کنی!
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        <section className="all-movies">
          <h2 className="text-2xl">جدیدترین فیلم‌ها</h2>

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
