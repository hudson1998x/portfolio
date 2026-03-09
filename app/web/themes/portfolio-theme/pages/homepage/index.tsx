


// Requires:
// npm install @fortawesome/react-fontawesome @fortawesome/free-brands-svg-icons @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core

import React from 'react';
import './style.scss';
import { registerComponent } from '@components/registry';
import { ProfileCard } from './profile-card';



export const Homepage = () => {

    return (
        <div className='homepage'>
            <ProfileCard />
        </div>
    )
}