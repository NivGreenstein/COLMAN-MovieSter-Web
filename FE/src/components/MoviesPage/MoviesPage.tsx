import React, {useState} from 'react';
import {Layout, Input, Row, Col, Avatar, Button} from 'antd';
import Movie from '../MoviesPage/MovieTab';
import {IMovie} from '../../types/IMovie';
import {useNavigate} from 'react-router-dom';

const {Header, Content} = Layout;
const {Search} = Input;

const MovieListPage: React.FC = () => {
    const navigate = useNavigate();
    // const [movies, setMovies] = useState<IMovie[]>([]);


    const movies: IMovie[] = [
        {
            id: 1,
            title: 'The Shawshank Redemption',
            imageUrl: 'https://via.placeholder.com/200x300?text=The+Shawshank+Redemption'
        },
        {id: 2, title: 'The Godfather', imageUrl: 'https://via.placeholder.com/200x300?text=The+Godfather'},
        {id: 3, title: 'The Dark Knight', imageUrl: 'https://via.placeholder.com/200x300?text=The+Dark+Knight'},
        {id: 4, title: '12 Angry Men', imageUrl: 'https://via.placeholder.com/200x300?text=12+Angry+Men'},
        // Add more movies as needed
    ];

    const handleSearch = (value: string) => {
    };

    const goToProfile = () => {
        navigate('/profile');
    };

    const handleLogout = () => {
    };

    return (
        <Layout style={{minHeight: '100vh', minWidth: '100vw'}}>
            <Header style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <Button type="primary" onClick={handleLogout}>Log out</Button>
                <Search
                    placeholder="Search movies"
                    onSearch={handleSearch}
                    enterButton
                    size="large"
                    style={{
                        borderRadius: '25px',
                        overflow: 'hidden',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                        width: '600px'
                    }}
                />
                <Avatar size="large" onClick={goToProfile} /* src={yourProfileImageUrl} */ />
            </Header>
            <Content style={{padding: '50px'}}>
                <Row gutter={[16, 16]}>
                    {movies.map(movie => (
                        <Col key={movie.id} xs={24} sm={12} md={8} lg={6} xl={4}>
                            <Movie movie={movie}/>
                        </Col>
                    ))}
                </Row>
            </Content>
        </Layout>
    );
};

export default MovieListPage;
