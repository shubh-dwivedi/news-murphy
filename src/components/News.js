import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import axios from "axios";

const News = ({ category, news_type, pageSize, country, setProgress })=> {
  const [articles, setArticles] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorCode, setErrorCode] = useState('')
  
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const loadNews = async ()=> {
    // sample url for API - `https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=hidden&page=${page}&pageSize=${pageSize}`;
    let url = process.env.REACT_APP_NEWS_API_URL;
    url += news_type ? `${news_type}?`:'top-headlines?';
    url += country ? `&country=${country}`:'';
    url += category ? `&category=${category}`:'';
    // url += `&apiKey=${process.env.REACT_APP_NEWS_API}`;
    url += `&apiKey=hidden`;
    url += `&page=${page}&pageSize=${pageSize}`;

    setLoading(true);
    let urlNew = `${process.env.REACT_APP_BACKEND_URL}/translate/fetchnews?text=${url}`
    setProgress(10)

    let result = getNewsData(urlNew);
    if(result === 'API request limit exhausted') {
      url.replace(process.env.REACT_APP_NEWS_API, process.env.REACT_APP_NEWS_API_BACKUP)
    } else {
      return
    }
  }

  const getNewsData = async(url) => {
    setProgress(10)
    axios
      .get(url, {
        timeout: 30000, // Set a timeout of 30 seconds
      })
      .then(response => {
        setProgress(60)
        setLoading(false);

        if(response.data.status === 'ok') {
          setArticles(response.data.articles);
          setTotalResults(response.data.totalResults);
        } else {
          let error_code = response.data.code
          setErrorCode(error_code);
          setProgress(100)
          if(error_code === "apiKeyExhausted" || error_code === "rateLimited") {
            if(url.includes(process.env.REACT_APP_NEWS_API)) return 'API request limit exhausted'
            else {
              return 'Failed'
            }
          } else {
            return 'Failed'
          }
        }
        setProgress(100)
        return 'Success'
      }).catch(error => {
        console.log(error.message);
        setLoading(false);
        setProgress(100)
        return 'Failed'
      })
  }
  
  const fetchNews = async () => {
    let arrayNews;
    let url = process.env.REACT_APP_NEWS_API_URL;
    url += news_type ? `${news_type}?`:'top-headlines?';
    url += country ? `&country=${country}`:'';
    url += category ? `&category=${category}`:'';
    url += `&apiKey=hidden`;
    url += `&page=${1}&pageSize=${totalResults < 100 ? totalResults : 100}`;

    setLoading(true);
    setProgress(10)
    let urlNew = `${process.env.REACT_APP_BACKEND_URL}/translate/fetchnews?text=${url}`

    axios
      .get(urlNew)
      .then(response => {
        setProgress(60)
        arrayNews = response.data.articles;
        setTotalResults(arrayNews.length);
        let articlesLoaded = arrayNews.slice(articles.length);
        
        setArticles(prevArticles => [...prevArticles, ...articlesLoaded]);
        setPage(page+1);
        setLoading(false);
        setProgress(100)
      }).catch(error => {
        console.log(error)
        setErrorCode(error);
        setErrorCode(error.data.code);
        setLoading(false);
        setProgress(100)
      })
  };

  const getScrollEndMessage = () => {
    let newsCategory = category === 'general' ? '' : (" in " + capitalizeFirstLetter(category) + ' category');
    if(errorCode==="" ) {
      if(!loading) {
        if(articles.length > 0) {
          return (
            <p className="my-3" style={{ textAlign: 'center' }}>
              <b>Yay! You have read all the news{newsCategory}</b>
            </p>
          )
        } else {
          return <p className="my-3" style={{ textAlign: 'center' }}>
          <b>No News Articles Found!</b>
        </p>
        }
      }
    } else {
      return <h4 className="text-center pt-5">Something went wrong 😰 Please try again later...</h4>
    }
  }
      
  useEffect(() => {
    let title = category === 'general' ? '' : "- " + capitalizeFirstLetter(category);
    document.title = `NewsMurphy ${title}`;

    loadNews();
    // eslint-disable-next-line
  }, [])
  
    return (
      <>
        <h1 className="text-center my-4 mt-5 pt-4">
          Top Headlines
          {category.toUpperCase() !== 'GENERAL' ? " - "+capitalizeFirstLetter(category) : ''}
        </h1>

        { errorCode === "apiKeyExhausted" || errorCode === "rateLimited" ? 
          <div className="my-4 text-center">
            <h2>Oops! API requests limit has been exhausted. Please try after some time.</h2>
          </div> : 
          <div>
            <h2>{errorCode}</h2>
          </div>
        }

        { loading && <Spinner /> }
        
        <InfiniteScroll
          key={'news-scroller'}
          dataLength={articles.length}
          next={fetchNews}
          hasMore={articles.length !== totalResults}
          // loader={<Spinner />}
          endMessage={getScrollEndMessage()}
        >
          <div className="container">
            <div className="row">
              { articles?.map((article) => (
                    <div className="col-md-4 col-sm" key={article.url}>
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
                  )
                )
              }
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
}

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

export default News