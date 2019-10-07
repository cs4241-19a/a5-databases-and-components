import React, {Component} from 'react';
import {resume_data} from '../resume_data';
import './Main.css';

class Education extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        if (resume_data) {
            var education = resume_data.education.map(function (education) {
                return <div className="mb-5" key={education.school}><h3>{education.school}</h3>
                    <p className="info">{education.degree} <span>&bull; </span><em
                        className="date">{education.graduated}</em></p></div>
            })
        }

        return (
            <section id="education">
                <div className="row">
                    <div className="col-md-1 mx-auto">
                        <h1><span>Education</span></h1>
                    </div>

                    <div className="col-md-8 mx-auto">
                        {education}
                    </div>
                </div>
            </section>
        );
    }
}

export default Education;