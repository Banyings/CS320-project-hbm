import React from 'react';
import {Link} from 'react-router-dom';

export default function Navbar(){
return(
    <nav>
        <Link to= "/"> Home</Link>
        <span> </span>
        <span></span>
        <Link to= "/page2"> Page2</Link>
    </nav>
)
}