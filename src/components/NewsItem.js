import React from "react";
import imagePlaceholder from "./placeholderImage.jpg";
import moment from "moment";

const NewsItem = (props) => {
  let { title, description, imageUrl, newsUrl, author, date, sourceName } =
    props;
  return (
    <div className="my-3">
      <div className="card h-100" style={{ margin: "auto" }}>
        <span className="position-absolute top-0 start-50 translate-middle badge rounded-pill bg-danger">
          {sourceName}
        </span>
        <a href={newsUrl} target="_blank" rel="noreferrer">
          <img
            src={imageUrl ? imageUrl : imagePlaceholder}
            onError={(event) => {
              event.target.src = imagePlaceholder;
            }}
            className="card-img-top"
            alt="news"
          />
        </a>
        <div className="card-body d-flex flex-column">
          <a
            href={newsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none text-dark"
          >
            <h5 className="card-title">{title}</h5>
          </a>
          <p className="card-text">
            {description
              ? description
              : "Desccription is not available. For reading more about this news please click on Read more"}
          </p>
          {/* <p className="card-text"><i><small className="text-muted">by {author} on {new Date(date).toUTCString()}</small></i></p> */}
          <p className="card-text">
            <i>
              <small className="text-muted">
                {author && author.toLowerCase() !== "unknown"
                  ? "by " + author + " on "
                  : ""}
                {moment(new Date(date)).format("DD MMM YYYY hh:mm A")}
                {author && author.toLowerCase() !== "unknown"
                  ? ""
                  : " (Unknown Author)"}
              </small>
            </i>
          </p>
          <a
            href={newsUrl}
            className="btn btn-primary mt-auto"
            target="_blank"
            rel="noreferrer"
          >
            Read more...
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
