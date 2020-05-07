import React, { Component } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import "../styles/chapter.css";
import {Link} from "react-router-dom";

class Chapter extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      chapters: []
    };
  }
  
  async componentDidMount() {
    const {manga, chapter} = this.props.match.params;
    const res = await fetch(
      `/manga/${manga}/chapter/${chapter}`,
      {method:"POST"}
      );
      const images = await res.json();
      this.setState({images});
      
    const chapterRes = await fetch(
      `/manga/${manga}`,
      { method: "POST" }
    );
    const {chapters} = await chapterRes.json();
    this.setState({ chapters: chapters.reverse() });  
  }
      
  renderImages = () => {
    return this.state.images
    .reverse()
    .map((i) => {
      return(
        <React.Fragment>
          <LazyLoadImage
          alt={"image.alt"}
          height={"100vh"}
          width={"100vw"}
          src={`https://cdn.mangaeden.com/mangasimg/${i[1]}`} // use normal <img> attributes as props
           />
        </React.Fragment>
        );
    });
  }
  

  render() {
    return (
      <main ref={this.imagesRef} id="chapter">
        <div id="toolbar">
          <Link>Previous</Link>
          <select>
            {this.state.chapters.map( (chapter) => {
              return <option>{chapter[0]}</option>
            })}
          </select>
          <Link>Next</Link>
        </div>
        {this.renderImages()}
      </main>
    )
  }
}
export default Chapter;