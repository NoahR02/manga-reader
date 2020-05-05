import React, { Component } from 'react'

class Chapter extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      images: []
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
  }

  render() {
    return (
      <main id="chapter" style={{display:"flex",flexDirection:"column"}}>
        {this.state.images.reverse().map((i) => <img loading="lazy" src={`https://cdn.mangaeden.com/mangasimg/${i[1]}`} />)}
      </main>
    )
  }
}
export default Chapter;