import React from 'react';
import {IMovie} from '../../types/IMovie';
import {Card} from 'antd';

interface MovieProps {
    movie: IMovie;
}

const Movie: React.FC<MovieProps> = ({movie}) => {
    return (
        <Card
            hoverable
            style={{width: 240}}
            cover={<img alt={movie.title} src={movie.imageUrl}/>}>
            <Card.Meta title={movie.title}/>
        </Card>
    );
};

export default Movie;
