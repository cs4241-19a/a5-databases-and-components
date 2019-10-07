import React, {Component} from 'react';
import {resume_data} from '../resume_data';
import './Main.css';

class Experience extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (resume_data){
            var work = resume_data.experience.map(function(work){
                return <div className="mb-5" key={work.company}><h3>{work.company}</h3>
                    <p className="info">{work.title}<span> &bull;</span> <em className="date">{work.years}</em></p>
                    <p>{work.description}</p>
                </div>
            })
        }
        return (
            <section id="experience">
                <div className="row">
                    <div className="col-md-1 mx-auto">
                        <h1><span>Experience</span></h1>
                    </div>
                    <div className="col-md-8 mx-auto">
                            {work}
                    </div>
                </div>
            </section>
        );
    }
}

export default Experience;