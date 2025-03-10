import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import axios from "axios";
import loading from './loading-waiting.gif'

const News = (props)=> {
  
  const [articles, setArticles] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorCode, setErrorCode] = useState('')
  
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const loadNews = async (pageSize)=> {
    // sample url for API - `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=hidden&page=${page}&pageSize=${pageSize}`;
    let url = process.env.REACT_APP_NEWS_API_URL;
    url += props.news_type ? `${props.news_type}?`:'top-headlines?';
    url += props.country ? `&country=${props.country}`:'';
    url += props.category ? `&category=${props.category}`:'';
    url += `&apiKey=${process.env.REACT_APP_NEWS_API}`;
    url += `&page=${page}&pageSize=${pageSize}`;
    // console.log(navigator.userAgent.indexOf("Firefox") != -1)

    setLoading(true);
    // let urlNew = `${process.env.REACT_APP_NEWS_URL}/translate/fetchnews?text=${url}`
    // props.setProgress(10)
    // let newsData = await fetch(urlNew, { signal: AbortSignal.timeout(10000) });
    // let parsedNewsData = await newsData.json();
    // let status = parsedNewsData.status;
    // props.setProgress(60)
    // if (status === "ok") {
    //     setArticles(parsedNewsData.articles);
    //     setTotalResults(parsedNewsData.totalResults);
    //     setLoading(false);
    // } else {
    //     setErrorCode(parsedNewsData);
    //     setErrorCode(parsedNewsData.code);
    //     setLoading(false);
    // }
    // props.setProgress(100)

    let result = getNewsData(url);
    if(result === 'API request limit exhausted') {
      url.replace(process.env.REACT_APP_NEWS_API, process.env.REACT_APP_NEWS_API_BACKUP)
    } else {
      return
    }
  }

  const getNewsData = async(url) => {
    props.setProgress(10)
    axios
      .get(url)
      .then(response => {
        props.setProgress(60)
        // console.log(response.data)
        setLoading(false);
        if(response.data.status === 'ok') {
          setArticles(response.data.articles);
          setTotalResults(response.data.totalResults);
          props.setProgress(100)
        } else {
          let error_code = response.data.code
          setErrorCode(error_code);
          props.setProgress(100)
          if(error_code === "apiKeyExhausted" || error_code === "rateLimited") {
            if(url.includes(process.env.REACT_APP_NEWS_API)) return 'API request limit exhausted'
            else {
              return 'Failed'
            }
          } else {
            return 'Failed'
          }
        }
        return 'Success'
      }).catch(error => {
        console.log(error)
        setLoading(false);
        props.setProgress(100)
        return 'Failed'
      })
  }

  const getScrollEndMessage = () => {
    let category = props.category === 'general' ? '' : (" in " + capitalizeFirstLetter(props.category) + ' category');
    if(errorCode==="" ) {
      if(!loading) {
        if(articles.length > 0) {
          return (
            <p className="my-3" style={{ textAlign: 'center' }}>
              <b>Yay! You have read all the news{category}</b>
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
    let title = props.category === 'general' ? 'Home' : capitalizeFirstLetter(props.category)
    document.title = `NewsMurphy - ${title}`;

    loadNews(props.pageSize+1);
    // eslint-disable-next-line
  }, [])
  
  const fetchNewsData = async () => {
    var arrayNews;
    // const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=hidden&page=1&pageSize=${totalResults<=100 ? totalResults :100}`;
    let url = process.env.REACT_APP_NEWS_API_URL;
    url += props.news_type ? `${props.news_type}?`:'top-headlines?';
    url += props.country ? `&country=${props.country}`:'';
    url += props.category ? `&category=${props.category}`:'';
    url += `&apiKey=${process.env.REACT_APP_NEWS_API}`;
    url += `&page=${1}&pageSize=${totalResults < 100 ? totalResults : 100}`;

    setLoading(true);
    // let urlNew = `${process.env.REACT_APP_NEWS_URL}/translate/fetchnews?text=${url}`
    // let newsData = await fetch(urlNew);
    // let parsedNewsData = await newsData.json();
    // console.log(parsedNewsData)
    // arrayNews = parsedNewsData.articles;
    // setTotalResults(arrayNews.length);
    // let articlesLoaded = arrayNews.slice(pageSize);
    
    // setArticles(articles.concat(articlesLoaded));
    // setPage(page+1);
    // setLoading(false);

    props.setProgress(10)
    axios
      .get(url)
      .then(response => {
        // console.log(response.data)
        props.setProgress(60)
        arrayNews = response.data.articles;
        setTotalResults(arrayNews.length);
        let articlesLoaded = arrayNews.slice(props.pageSize);
        
        setArticles(articles.concat(articlesLoaded));
        setPage(page+1);
        setLoading(false);
        props.setProgress(100)
      }).catch(error => {
        console.log(error)
        setErrorCode(error);
        setErrorCode(error.data.code);
        setLoading(false);
        props.setProgress(100)
      })
  };
  
    return (
      <>
        <h1 className="text-center my-4 mt-5 pt-4">
          Top Headlines
          {props.category.toUpperCase() !== 'GENERAL' ? " - "+capitalizeFirstLetter(props.category) : ''}
        </h1>

        { errorCode === "apiKeyExhausted" || errorCode === "rateLimited" ? 
          <div className="my-4 text-center">
            <h2>Oops! API requests limit has been exhausted. Please try after some time.</h2>
          </div> : 
          (loading && <Spinner />)
        }
        
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchNewsData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
          endMessage={getScrollEndMessage()}
        >
          <div className="container">
            <div className="row">
              {!loading &&
                articles.map((element) => {
                  return (
                    <div className="col-md-4 col-sm" key={element.url}>
                      <NewsItem
                        title={element.title}
                        description={element.description}
                        imageUrl={element.urlToImage}
                        newsUrl={element.url}
                        sourceName={element.source.name}
                        author={element.author ? element.author : "Unknown"}
                        date={element.publishedAt}
                      />
                    </div>
                  );
                })}
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