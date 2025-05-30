import './App.css';
import React, {useState} from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from './components/Navbar'
import News from './components/News'
import LoadingBar from "react-top-loading-bar";

  const App = ()=> {
    const news_type = 'top-headlines';
    const pageSize = 10;
    const country = 'us';
    const [progress, setProgress] = useState(0);
    // const apiKey = process.env.REACT_APP_NEWS_API;
    return (
      <>
        <LoadingBar color='#23C9FF' progress={progress}
          onLoaderFinished={() => setProgress(0)} />
        <Router>
        <Navbar progress={progress}/>
          <Routes>
            <Route exact path='/' element={<News setProgress={setProgress} key="general" pageSize={pageSize} country={country} category={'general'} news_type={news_type} />}></Route>
            <Route exact path='/business' element={<News setProgress={setProgress} key="business" pageSize={pageSize} country={country} category={'business'} news_type={news_type} />}></Route>
            <Route exact path='/health' element={<News setProgress={setProgress} key="health" pageSize={pageSize} country={country} category={'health'} news_type={news_type} />}></Route>
            <Route exact path='/entertainment' element={<News setProgress={setProgress} key="entertainment" pageSize={pageSize} country={country} category={'entertainment'} news_type={news_type} />}></Route>
            <Route exact path='/sports' element={<News setProgress={setProgress} key="sports" pageSize={pageSize} country={country} category={'sports'} news_type={news_type} />}></Route>
            <Route exact path='/science' element={<News setProgress={setProgress} key="science" pageSize={pageSize} country={country} category={'science'} news_type={news_type} />}></Route>
            <Route exact path='/technology' element={<News setProgress={setProgress} key="technology" pageSize={pageSize} country={country} category={'technology'} news_type={news_type} />}></Route>
          </Routes>
        </Router>
      </>
    )
}

export default App
