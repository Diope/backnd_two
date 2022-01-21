import React from 'react'
import { Link } from 'react-router-dom';

interface Props {

}

export const Nav: React.FC<Props> = () => {
        return (
            <>
                <div>
                    <Link to="/">Home</Link>
                </div>
                <div>
                    <Link to="/register">Register</Link>
                </div>
                <div>
                    <Link to="/login">Login</Link>
                </div>
            </>
        );
}