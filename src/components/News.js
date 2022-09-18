import React, { Component } from "react";
import NewsItem from ".//NewsItem";
import Spinner from "./Spinner";
import propTypes from 'prop-types'
// import InfiniteScroll from "react-infinite-scroll-component"
export class News extends Component {

static defaultProps={
  country:'in',
  pageSize:'10',
  category:'general'
}
static propTypes={
  country:propTypes.string,
  pageSize:propTypes.number,
  category:propTypes.string
}
capitalizeFirstLetter = (string)=> {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      page: 1
    }
    document.title=`Newsify-${this.capitalizeFirstLetter(this.props.category)}`
  }
  async updateNews(){
    const url =
      `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=114d9437f8ff44ef8f0ba90f674db481&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading:true})
    let data = await fetch(url);
    // `https://newsapi.org/v2/top-headlines?country=in&apiKey=029f0201a053447090881f4e6d408d80&page=1&pageSize=${this.props.pageSize}`;
    //   this.setState({loading:true})
    // let data = await fetch(url);
    let parsedData = await data.json();
    // console.log(parsedData);
    this.setState({
      articles: parsedData.articles,
      totalResults: parsedData.totalResults,
      loading:false
    })
  }
  async componentDidMount() {
    this.updateNews()
  }

  handleNextClick = async () => {
    this.setState({page:this.state.page+1})
    this.updateNews()
  }

  handlePrevClick = async () => {
    this.setState({page:this.state.page-1})
    this.updateNews()
  }

  render() {
    return (
      <div className="container my-3">
        <h2 className="text-center" style={{margin:'20px 0px',marginTop: '80px'}}>Newsify - Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h2>
        {this.state.loading && <Spinner />}
        
        <div className="row">
            {!this.state.loading && this.state.articles.map((element) => { 
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title.slice(0, 45) : ""}description={element.description ?
                  element.description.slice(0, 85) : ""}imageUrl={element.urlToImage}newsUrl={element.url}
                  author={element.author} date={element.publishedAt} source={element.source.name}
                />
              </div>
          })}
        </div>
        <div className="container d-flex justify-content-between my-3">
          <button
            disabled={this.state.page <= 1}
            type="button"
            className="btn btn-dark"
            onClick={this.handlePrevClick}
          >
            &larr; Previous
          </button>
          <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults / this.props.pageSize)}
            type="button"
            className="btn btn-dark"
            onClick={this.handleNextClick}
          >
            Next &rarr;
          </button>
        </div>
      </div>
    );
  }
}

export default News;