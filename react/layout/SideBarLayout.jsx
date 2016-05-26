import React, { Component } from 'react';
import { Link } from 'react-router';

export default class SideBarLayout extends Component {
    getChildContext () {
        return { routes: this.props.routes };
    }

    render () {
        return (
            <div className="app sidebar-layout">
                <h1>SideBar Layout</h1>
                <div className="sidebar">{this.props.sidebar}</div>
                <div className="content">{this.props.content}</div>
            </div>
        );
    }
}

SideBarLayout.childContextTypes = {
    routes: React.PropTypes.array.isRequired
};
