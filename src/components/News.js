import React, { Component } from 'react';
import NewsItem from './NewsItem';
import Spinner from './Spinner';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroll-component';

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
  
  constructor(props) {
    super(props);
    console.log("news component ka constructor hu main");
    this.state = {
      articles: [],
      loading: false,
      page: 1,
      totalArticles: 0
    }
    document.title = this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1) + " News";
  }

  async updateNews(){
    this.props.setProgress(40);

    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    this.setState({loading : true})
    let data = await fetch(url);
    this.props.setProgress(60);
    let parsedData = await data.json();
    this.setState({ articles: parsedData.articles, totalArticles: parsedData.totalResults, loading: false })
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.props.setProgress(10);
    this.props.setProgress(20);

    this.updateNews()
  }
  
  fetchMoreData = async () => {
    this.setState({
      page: this.state.page+1
    })
    let url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${this.props.apiKey}&page=${this.state.page}&pageSize=${this.props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json();
    this.setState({ 
      articles: this.state.articles.concat(parsedData.articles), 
      totalArticles: parsedData.totalResults
    })
  }


  render() {
    return (
      <>
        <h1 className='text-center'>Know it all News - Top Headlines</h1>
        {this.state.loading && <Spinner/>}
        
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.articles.totalArticles}
          
          loader={<Spinner/>}
        >
        <div className="container">

        <div className="row">
          {this.state.articles.map((element) => {


            return <div className="col-md-4" key={element.url}>
              <NewsItem title={element.title} description={element.description} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt}/>
            </div>

          })}

        </div>
        </div>
        </InfiniteScroll>
      </>
    )
  }
}

export default News;
