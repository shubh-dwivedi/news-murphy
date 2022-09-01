import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";

const News = (props)=> {
  
  const [articles, setArticles] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errorCode, setErrorCode] = useState('')
  
  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

    
    const loadNews = async ()=> {
        let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=hidden&page=${page}&pageSize=${props.pageSize}`;
        let urlNew = `${process.env.REACT_APP_NEWS_URL}/translate/fetchnews?text=${url}`
        setLoading(true);
        props.setProgress(10)
        let newsData = await fetch(urlNew);
        let parsedNewsData = await newsData.json();
        let status = parsedNewsData.status;
        props.setProgress(60)
        if (status === "ok") {
            setArticles(parsedNewsData.articles);
            setTotalResults(parsedNewsData.totalResults);
            setLoading(false);
        } else {
            setErrorCode(parsedNewsData.code);
            setLoading(false);
        }
        props.setProgress(100)
      }
    
  useEffect(() => {
    document.title = `NewsMurphy - ${capitalizeFirstLetter(props.category)}`;
    loadNews();
    // eslint-disable-next-line
  }, [])
  
  const fetchNewsData = async () => {
    var arrayNews;
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=hidden&page=1&pageSize=${totalResults<=100 ? totalResults :100}`;
    let urlNew = `${process.env.REACT_APP_NEWS_URL}/translate/fetchnews?text=${url}`
    let newsData = await fetch(urlNew);
    let parsedNewsData = await newsData.json();
    arrayNews = parsedNewsData.articles;
    setTotalResults(arrayNews.length);
    setLoading(true);
    let articlesLoaded = arrayNews.slice(props.pageSize);
    
    setArticles(articles.concat(articlesLoaded));
    setPage(page+1);
    setLoading(false);
  };
  
    return (
      <>
        <h1 className="text-center my-4 mt-5 pt-4">
          Today's Top Headlines -{" "}
          {capitalizeFirstLetter(props.category)}
        </h1>
        {errorCode === "apiKeyExhausted" || errorCode === "rateLimited" ? <div className="my-4 text-center"><h2>Oops! Server requests limit has been exhausted. Please try after some time.</h2></div> : loading && <Spinner />}
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchNewsData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
          endMessage={
            errorCode==="" ? !loading && <p className="my-3" style={{ textAlign: 'center' }}>
              <b>Yay! You have read all the news in {capitalizeFirstLetter(props.category)} category</b>
            </p>:errorCode === "" && <h4 className="text-center pt-5">Something went wrong 😰 Please try again later...</h4>}
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
  };

News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
  };

export default News