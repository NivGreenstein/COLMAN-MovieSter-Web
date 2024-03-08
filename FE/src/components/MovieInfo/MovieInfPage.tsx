import React, {useEffect, useMemo, useState} from 'react';
import {Layout, Row, Col, Rate, Typography, Divider} from 'antd';
import CommentList from '../Comments/CommentsList';
import {Comment} from '../../types/IComment';
import {IMovie} from '../../types/IMovie';
import {useParams} from 'react-router-dom';
import {fetchMovieById} from '../../services/movies.service';
import {getCommentsByMovieId} from '../../services/comments.service';
import {AddComment} from '../Comments/AddComment';
import {useSession} from '../../context/SessionContext';
import {RcFile} from "antd/es/upload/interface";

const {Content} = Layout;
const {Title, Paragraph} = Typography;

const MovieInfoPage: React.FC = () => {
    const {id} = useParams();
    const [movie, setMovie] = useState<IMovie | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const {loggedUser} = useSession();
    const [, setImage] = useState<RcFile | null>(null);
    const [imagePreview, setImagePreview] = useState('');

    useEffect(() => {
        if (id) {
            fetchMovieById(id).then((data) => setMovie(data));
            fetchComments();
        }
    }, [id]);

    const fetchComments = () => {
        if (!id) return;
        getCommentsByMovieId(id).then((data) => setComments(data ?? []));
    };

    const userExistingComment = useMemo(() => {
        return comments.find(({userId}) => userId === loggedUser?._id);
    }, [comments, loggedUser]);

    if (!movie) {
        return <div style={{width: '100%', height: 'auto', maxHeight: '100vh', maxWidth: '100vw'}}>Loading...</div>;
    }

    return (
        <Layout>
            <Content style={{padding: '2rem'}}>
                <Row gutter={16}>
                    <Col span={8}>
                        <img src={movie.posterUrl} alt={movie.title} style={{width: '100%', height: 'auto'}}/>
                    </Col>
                    <Col span={16}>
                        <Title level={2}>{movie.title}</Title>
                        <Row gutter={4}>
                            <Col span={4}>
                                <p>Official Rating:</p>
                                <Rate disabled value={movie.rating / 2}/>
                            </Col>
                            <Col span={4}>
                                <p>Users' Rating</p>
                                <Rate
                                    disabled
                                    value={
                                        comments.length ? comments.reduce((sum, comment) => comment.rating + sum, 0) / comments.length : 0
                                    }
                                />
                            </Col>
                        </Row>
                        <Paragraph>{movie.description}</Paragraph>
                        <Divider/>
                        <AddComment isDisabled={!!userExistingComment} movieId={movie.id}
                                    fetchComments={fetchComments} imagePreview={imagePreview}
                                    setImagePreview={setImagePreview} setImage={setImage}/>
                        <CommentList comments={comments} isMoviePage={true} setComments={setComments}
                                     setImagePreview={setImagePreview} imagePreview={imagePreview}/>
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

export default MovieInfoPage;
