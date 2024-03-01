const fetchMovieById = async (id) => {
    try {
        const response = await fetch(`/api/movies/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetching movie by ID failed", error);
    }
};

export { fetchMovieById };
