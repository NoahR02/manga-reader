import React from "react";
import "../styles/search.css";
import { Link } from "react-router-dom";
class Search extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      query: "",
      queryResults: [],
      open:false
    };
  }
  
  renderSearch = () => {
    return this.state.queryResults
    .map( (m) => <li><Link to={`/manga/${m._id}`}>{m.title}</Link></li>);
  }
  
  
  queryOnChange = async (e) => {
    this.setState({query: e.target.value});
    
    let query = e.target.value;
    if (!query.replace(/\s/g, '').length) {
      query = "A";
    }
    
    try {
      const res = await fetch(`/manga/query/${query}`, { method:"POST", headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }});
      const manga = await res.json();
      this.setState({queryResults: manga});
      } catch(e) {
        console.log(e.message);
      }
  }
  
  
  render() {
    return (
      <div id="search" onClick={(e) => {
        if(e.target.id !== ("inputManga" || "searchManga") ) this.setState({open:false})
      }}>
        <input placeholder="Search Manga..." autoComplete="off" id="inputManga" type="text" onClick={()=> this.setState({open:true})}  onChange={(e) => this.queryOnChange(e)} />
        <ul id="searchManga" style={this.state.open ? {display:"flex"} : {display:"none"}}>
        {this.renderSearch()}
        </ul>
      </div>
    )
  }
}
export default Search;