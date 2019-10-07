import React from 'react';
import './App.css';
import Header from "./components/Header";
import Intro from "./components/Intro";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Footer from "./components/Footer";

function App() {
    return (
        <div>
            <Header/>
            <Intro/>
            <Education/>
            <Experience/>
            <Projects/>
            <Footer/>
        </div>
    );
}

export default App;
