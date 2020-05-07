import React from 'react'
import {Link} from "react-router-dom";
import "../styles/mangainfo.css";

class MangaInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      chapters : [], title: "", released: 1920, 
      status : 0, views : 200, chapterLength: 500, genres : [],
      imageURL: "", description: ""
    };
  }
  
  async componentDidMount() {
   const res = await fetch(
   `/manga/${this.props.match.params.manga}`,
   {method:"POST"}
   );
   const {chapters, description, imageURL, title, released, status, views, chapterLength, genres} = await res.json();
   this.setState({chapters, title, imageURL, description, released, status, views, chapterLength, genres});
  
  }

  render() {
    return (
      <main id="mangaInfo">
        <div id="mangaSummaryContainer">
          <img src={`https://cdn.mangaeden.com/mangasimg/${this.state.imageURL}`} />
          <p id="mangaSummary"> <h3>{this.state.title}</h3>{this.state.description}</p>
        </div>
        <br />

        <section id="chapters">
          <h3 id="chaptersHeading">Chapters:</h3>
          {this.state.chapters.map( (m) => {
            return <Link to={`/manga/${this.props.match.params.manga}/chapter/${m[3]}`}>Chapter {m[0]} {m[2]} <br/></Link>
           })}
        </section>
        
        {/* 
        {this.state.released}
        <br />
        Status : {this.state.status}
        <br />
        {this.state.views}
        <br />
        {this.state.chapterLength}
        <br />
        {this.state.genres[0]}
        
        <br />
        */}
      </main>
    )
  }
}
export default MangaInfo;