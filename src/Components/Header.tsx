import React, { FC } from 'react';
import Logo from './logo.svg'

const Header :FC = () => {
    return (
        <div className="header">
            <div className="headerLeft">
                <img src={Logo} alt="Cannot find the image"/>
                <h2>Typescript Rekognition</h2>
            </div>
            <div className="headerRight">
                <a href="">Get Started</a>
            </div>
        </div>
    )
}

export default Header;