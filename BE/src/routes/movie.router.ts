import { Router } from 'express';
import * as service from '../controllers/movie.controller';
const router = Router();

router.get('/now-playing', service.getNowPlayingMovies);
router.get('/search/:movieName', service.searchMovieByName);
router.get('/:movieId', service.getMovieById);

export default router;
