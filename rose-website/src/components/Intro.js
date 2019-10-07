import React, {Component} from 'react';
import {resume_data} from '../resume_data';
import './Main.css';

class Intro extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <section className="p" id="about">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h3 className="text-center">{resume_data.intro.title}</h3>
                            <br/>
                            <p className="mb-5">{resume_data.intro.text}</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Intro;