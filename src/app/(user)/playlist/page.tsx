
const PlaylistPage = async () => {
    await new Promise(resolve => setTimeout(resolve, 3000))
    return (
        <div>
            <h1>Playlist Page</h1>
        </div>
    );
}

export default PlaylistPage;
