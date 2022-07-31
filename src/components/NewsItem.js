import React from 'react'
import imagePlaceholder from './placeholderImage.jpg'

const NewsItem = (props)=> {
    let {title,description, imageUrl, newsUrl, author, date, sourceName} = props;
    return (
      <div className='my-3'>
        <div className="card h-100" style={{margin: 'auto'}}>
        <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger">{sourceName}</span>
        <img src={imageUrl?imageUrl:imagePlaceholder} onError={(event) => {event.target.src = imagePlaceholder}} className='card-img-top' alt="news" />
        <div className="card-body d-flex flex-column">
            <h5 className="card-title">{title}</h5>
            <p className="card-text">{description?description:"Desccription is not available. For reading more aboy this news please proceed by clicking on Read more"}</p>
            <p className="card-text"><i><small className="text-muted">by {author} on {new Date(date).toUTCString()}</small></i></p>
            <a href={newsUrl} className="btn btn-primary mt-auto" target='_blank' rel="noreferrer">Read more...</a>
        </div>
        </div>
        </div>
    )
}

export default NewsItem
