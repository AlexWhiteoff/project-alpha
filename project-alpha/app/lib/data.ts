export const fetchTracks = () => {
    return fetch("./data.json")
        .then((response) => response.json())
        .catch((err) => console.log(err));
};
