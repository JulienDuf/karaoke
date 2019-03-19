setInterval(() => {
    fetch("https://api.csparadise.live/song").catch((err) => console.log(err));
}, 30 * 1000);
