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
    const pageSize=6
    const apiKey=process.env.REACT_APP_NEWS_API;
    const country = 'us';
    const [progress, setProgress] = useState(0);
    return (
      <>
        <LoadingBar color='#23C9FF' progress={progress}
          onLoaderFinished={() => setProgress(0)} />
        <Router>
        <Navbar progress={progress}/>
          <Routes>
            <Route exact path='/' element={<News setProgress={setProgress} key="general" apiKey={apiKey} pageSize={pageSize} country={country} category={'general'}/>}></Route>
            <Route exact path='/business' element={<News setProgress={setProgress} key="business" apiKey={apiKey} pageSize={pageSize} country={country} category={'business'}/>}></Route>
            <Route exact path='/health' element={<News setProgress={setProgress} key="health" apiKey={apiKey} pageSize={pageSize} country={country} category={'health'}/>}></Route>
            <Route exact path='/entertainment' element={<News setProgress={setProgress} key="entertainment" apiKey={apiKey} pageSize={pageSize} country={country} category={'entertainment'}/>}></Route>
            <Route exact path='/sports' element={<News setProgress={setProgress} key="sports" apiKey={apiKey} pageSize={pageSize} country={country} category={'sports'}/>}></Route>
            <Route exact path='/science' element={<News setProgress={setProgress} key="science" apiKey={apiKey} pageSize={pageSize} country={country} category={'science'}/>}></Route>
            <Route exact path='/technology' element={<News setProgress={setProgress} key="technology" apiKey={apiKey} pageSize={pageSize} country={country} category={'technology'}/>}></Route>
          </Routes>
        </Router>
      </>
    )
}

export default App
