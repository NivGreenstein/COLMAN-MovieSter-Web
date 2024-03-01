import React, {useEffect, useState} from 'react';
import {Layout, Row, Col, Rate, Typography, Divider} from 'antd';
import CommentList from '../Comments/CommentsList';
import {Comment} from '../../types/IComment';
import {IMovie} from '../../types/IMovie';
import {useParams} from "react-router-dom";
import {fetchMovieById} from "../../services/movies.service";


const {Content} = Layout;
const {Title} = Typography;


const MovieInfoPage: React.FC = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState<IMovie | null>(null);

    useEffect(() => {
        if (id) {
            fetchMovieById(id).then(setMovie);
        }
    }, [id]);

    if (!movie) {
        return <div>Loading...</div>;
    }
    return (
        <Layout>
            <Content style={{padding: '2rem'}}>
                <Row gutter={16}>
                    <Col span={8}>
                        <img src={movie.imageUrl} alt={movie.title} style={{width: '100%', height: 'auto'}}/>
                    </Col>
                    <Col span={16}>
                        <Title level={2}>{movie.title}</Title>
                        <Rate disabled defaultValue={5}/> {/* Replace `5` with `movie.rating` from your data */}
                        <Divider/>
                        <CommentList comments={comments} isMoviePage={true}/>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default MovieInfoPage;
