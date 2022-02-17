import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';

export class News extends Component {

  static defaultProps={
    country: 'in',
    pageSize: 8,
    category: 'general'

  }
  
  static propTypes={
    country: PropTypes.string,
    pageSize: PropTypes.number
  }
  
  constructor() {
    super();
    console.log("news component ka constructor hu main");
    this.state = {
      articles: [],
      loading: false,
      page: 1
    }
  }

  async updateNews(){
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=92e3ca062a004949bf979366d92cd8a2&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading : true})
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({ articles: parsedData.articles, totalArticles: parsedData.totalResults, loading: false })
  }

  async componentDidMount() {
    this.updateNews()
  }
  handlePrevClick = async () => {
      await this.setState({
      page: this.state.page-1
    })

    this.updateNews();
  }
  handleNextClick = async () => {
    await this.setState({
      page: this.state.page+1
    })

    this.updateNews();
  }
  
  render() {
    return (
      <div className='container my-3'>
        <h1 className='text-center'>Know it all News - Top Headlines</h1>
        {this.state.loading && <Spinner/>}
        <div className="row">
          {!this.state.loading && this.state.articles.map((element) => {


            return <div className="col-md-4" key={element.url}>
              <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt}/>
            </div>

          })}

        </div>
        <div className="container d-flex justify-content-between">
          <button type="button" disabled={this.state.page===1} className="btn btn-dark mx-2" onClick={this.handlePrevClick}>&larr; Previous page</button>
          <button type="button" disabled={this.state.page +1 > Math.ceil(this.state.totalArticles/this.props.pageSize)} className="btn mx-2 btn-dark" onClick={this.handleNextClick}>Next page &rarr;</button>
        </div>
      </div>
    )
  }
}

export default News;
