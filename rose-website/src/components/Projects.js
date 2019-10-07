import React, {Component} from 'react';
import {resume_data} from '../resume_data';
import './Main.css';

class Projects extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        if (resume_data){
            var projects = resume_data.projects.map(function(project){
                return <div className="col-xl-3 col-md-6 mb-4">
                    <div className="card border-0 shadow">
                        <img src={project.url} className="card-img-top" alt="..." />
                        <div className="card-body text-center">
                            <h5 className="card-title mb-0">{project.title}</h5>
                            <div className="card-text text-black-50">{project.description}</div>
                        </div>
                    </div>
                </div>
            })
        }
        return (
            <section id="projects">
                <div>
                    <header className="text-center py-3 mb-3">
                        <div className="container">
                            <h1 className="font-weight-light">Projects</h1>
                        </div>
                    </header>
                    <div className="container">
                        <div className="row">
                            {projects}
                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default Projects;