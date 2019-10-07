import React, {Component} from 'react';
import {resume_data} from '../resume_data';
import './Main.css';

class Footer extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <footer>
                <div className="container">
                    <p className="float-right text-muted">
                        {resume_data.footer.name}
                    </p>
                    <div>
                        <a className="btn" href={resume_data.footer.github}>
                            <i className="fa fa-2x fa-github"></i></a>
                        <a className="btn" href={resume_data.footer.linkedin}>
                            <i className="fa fa-2x fa-linkedin"></i></a>
                    </div>
                </div>
            </footer>
        );
    }
}

export default Footer;