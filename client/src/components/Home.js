import React from 'react'
import "../styles/home.css";
import Search from './Search';

export default class Home extends React.Component {
  render() {
    return (
      <main id="home">
        <Search />
      </main>
    )
  }
}
