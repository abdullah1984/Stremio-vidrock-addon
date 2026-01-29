const { addonBuilder, serveHTTP } = require('stremio-addon-sdk');

const manifest = {
    id: 'community.vidrock.addon',
    version: '1.0.0',
    name: 'VidRock Addon',
    description: 'Watch movies and series from VidRock.net directly in Stremio',
    resources: ['stream'],
    types: ['movie', 'series'],
    idPrefixes: ['tt'], // IMDB IDs
    catalogs: []
};

const builder = new addonBuilder(manifest);

builder.defineStreamHandler((args) => {
    const { type, id } = args;
    console.log('Request for stream:', type, id);

    let streams = [];

    if (type === 'movie') {
        // id is usually IMDB ID like tt1234567
        streams.push({
            title: 'VidRock Player',
            externalUrl: `https://vidrock.net/movie/${id}`
        });
    } else if (type === 'series') {
        // id is usually IMDB ID with season and episode: tt1234567:1:1
        const parts = id.split(':');
        const imdbId = parts[0];
        const season = parts[1];
        const episode = parts[2];
        
        streams.push({
            title: 'VidRock Player',
            externalUrl: `https://vidrock.net/tv/${imdbId}/${season}/${episode}`
        });
    }

    return Promise.resolve({ streams });
});

serveHTTP(builder.getInterface(), { port: 7000 });
console.log('Addon is running at http://localhost:7000/manifest.json');
