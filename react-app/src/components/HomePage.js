import React from 'react';
import SimpleImageSlider from "react-simple-image-slider";
import '../css/Footer.css'
import img1 from '../assets/cow1.jpg';
import img2 from '../assets/cow2.jpg';
import img3 from '../assets/cow3.jpg';

function Home() {
    const images = [
        { url: img1 },
        { url: img2 },
        { url: img3 },
    ];

    return (
        <div className='home'>
            <h1>Informacioni sistem farme Šarulja</h1>
            <SimpleImageSlider
                width={896}
                height={504}
                images={images}
            />
        </div>
    );
}

export default Home;