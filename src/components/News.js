import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import axios from "axios";
import { useDebounce } from "../hooks/useDebounce";

const News = ({
  category,
  news_type,
  pageSize,
  country,
  setProgress,
  setNewsType,
}) => {
  const [articles, setArticles] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorCode, setErrorCode] = useState("");
  const [searchInput, setSearch] = useState("");

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const fetchInitialNewsArticles = useCallback(async (search) => {
    setLoading(true);

    // let url = process.env.REACT_APP_NEWS_API_URL;
    let url = "";
    url += news_type ? `${news_type}` : "top-headlines";
    url += search ? `&q=${search}` : "";
    url += country ? `&country=${country}` : "";
    url += category ? `&category=${category}` : "";
    url += `&apiKey=hidden`;
    url += `&page=${page}&pageSize=${pageSize}`;

    let urlNew = `${process.env.REACT_APP_BACKEND_URL}/translate/fetchnews?text=${url}`;

    setProgress(10);
    axios
      .get(urlNew, {
        timeout: 10000, // Set a timeout of 10 seconds
      })
      .then((response) => {
        setProgress(60);
        setLoading(false);

        if (response.data.status === "ok") {
          setArticles(response.data.articles);
          setTotalResults(response.data.totalResults);
        } else {
          let error_code = response.data.code;
          setErrorCode(error_code);
          setProgress(100);
        }
        setProgress(100);
      })
      .catch((error) => {
        console.log(error.message);
        setLoading(false);
        setProgress(100);
      });
    // eslint-disable-next-line
  }, []);

  const fetchNewsArticles = async () => {
    setLoading(true);
    let arrayNews;

    let url = "";
    url += news_type ? `${news_type}` : "top-headlines";
    url += searchInput ? `&q=${searchInput}` : "";
    url += country ? `&country=${country}` : "";
    url += category ? `&category=${category}` : "";
    url += `&apiKey=hidden`;
    url += `&page=${1}&pageSize=${totalResults < 100 ? totalResults : 100}`;

    setProgress(10);
    let urlNew = `${process.env.REACT_APP_BACKEND_URL}/translate/fetchnews?text=${url}`;

    axios
      .get(urlNew)
      .then((response) => {
        setProgress(60);
        arrayNews = response.data.articles;
        setTotalResults(arrayNews.length);
        let articlesLoaded = arrayNews.slice(articles.length);

        setArticles((prevArticles) => [...prevArticles, ...articlesLoaded]);
        setPage(page + 1);
        setLoading(false);
        setProgress(100);
      })
      .catch((error) => {
        console.log(error);
        setErrorCode(error);
        setErrorCode(error.data.code);
        setLoading(false);
        setProgress(100);
      });
  };

  const getScrollEndMessage = () => {
    let newsCategory =
      category === "general"
        ? ""
        : " in " + capitalizeFirstLetter(category) + " category";
    if (errorCode === "") {
      if (!loading) {
        if (articles.length > 0) {
          return (
            <p className="my-3" style={{ textAlign: "center" }}>
              <b>Yay! You have read all the news{newsCategory}</b>
            </p>
          );
        } else {
          return (
            <p className="my-3" style={{ textAlign: "center" }}>
              <b>No News Articles Found!</b>
            </p>
          );
        }
      }
    } else {
      return (
        <h4 className="text-center pt-5">
          Something went wrong 😰 Please try again later...
        </h4>
      );
    }
  };

  const getNewsType = (type) => {
    const arr = type.split("-");
    const new_arr = arr.map((e) => e[0].toUpperCase() + e.slice(1));
    const news_header = new_arr.join(" ");
    return news_header === "Everything" ? "All News" : news_header;
  };

  const debounced = useDebounce(fetchInitialNewsArticles, 1000);

  const handleSearch = (e) => {
    const search_value = e.target.value;
    setSearch(search_value);
    debounced(search_value);
  };

  useEffect(() => {
    let title =
      category === "general" ? "" : "- " + capitalizeFirstLetter(category);
    document.title = `NewsMurphy ${title}`;

    fetchInitialNewsArticles(searchInput);

    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div className="w-100 d-flex justify-content-between align-items-center mt-5 pt-4 flex-column flex-md-row">
        <div className="w-25"></div>
        <div className="w-50">
          <h1 className="text-center">
            {getNewsType(news_type)}
            {category.toUpperCase() !== "GENERAL"
              ? " In " + capitalizeFirstLetter(category)
              : ""}
          </h1>
        </div>
        <div className="w-25 d-flex justify-content-center justify-content-md-end">
          <input
            type="text"
            id="search"
            placeholder="Search"
            value={searchInput}
            onChange={handleSearch}
            className="border border-secondary-subtle m-2 p-2"
          />
          <div></div>
        </div>
      </div>

      {errorCode === "apiKeyExhausted" || errorCode === "rateLimited" ? (
        <div className="my-4 text-center">
          <h2>
            Oops! News API limit has been exhausted. Please try after some time.
          </h2>
        </div>
      ) : (
        <div>
          <h2>{errorCode}</h2>
        </div>
      )}

      {loading && <Spinner />}

      <InfiniteScroll
        key={"news-scroller"}
        dataLength={articles.length}
        next={fetchNewsArticles}
        hasMore={articles.length !== totalResults}
        // loader={<Spinner />}
        endMessage={getScrollEndMessage()}
      >
        <div className="container">
          <div className="row">
            {articles?.map((article, index) => (
              <div
                className="col-md-4 col-md"
                key={`Article-${index}-${article.url}`}
              >
                <NewsItem
                  title={article.title}
                  description={article.description}
                  imageUrl={article.urlToImage}
                  newsUrl={article.url}
                  sourceName={article.source.name}
                  author={article.author ? article.author : "Unknown"}
                  date={article.publishedAt}
                />
              </div>
            ))}
          </div>
        </div>
      </InfiniteScroll>
    </>
  );
};

News.defaultProps = {
  country: "in",
  pageSize: 6,
  category: "general",
  news_type: "top-headlines",
};

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
  news_type: PropTypes.string,
};

export default News;
