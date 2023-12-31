const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/",(req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let albums = [
    {
        _id: 1,
        name: "The Wall",
        band: "Pink Floyd",
        genre: "Rock",
        year: "1973",
        members: ["David Gilmour","Roger Waters","Nick Mason", "Richard Wright"],
        cover: "../images/wall.jpeg"
    },
    {
        _id: 2,
        name: "Led Zeppelin IV",
        band: "Led Zeppelin",
        genre: "Rock",
        year: "1971",
        members: ["John Bonham", "John Paul Jones", "Jimmy Page", "Robert Plant"],
        cover: "../images/IV.jpeg"
    },
    {
        _id: 3,
        name: "The Protomen",
        band: "The Protomen",
        genre: "Indie Rock",
        year: "2005",
        members: ["Raul Panther III","Murphy Weller","Commander B. Hawkins", "Sir Dr. Robert Bakker", "Shock Magnum", "Gambler Kirkdouglas", "Reanimator Lovejoy", "K.I.L.R.O.Y."],
        cover: "../images/protomen.jpeg"
    },
    {
        _id: 4,
        name: "Relaxer",
        band: "Alt-J",
        genre: "Pop",
        year: "2017",
        members: ["Joe Newman","Thom Sonny Green","Gus Unger-Hamilton"],
        cover: "../images/relaxer.jpeg"
    },
    {
        _id: 5,
        name: "Soul Punk",
        band: "Patrick Stump",
        genre: "Pop",
        year: "2011",
        members: ["Patrick Stump"],
        cover: "../images/punk.jpeg"
    },
    {
        _id: 6,
        name: "Vegas",
        band: "The Crystal Method",
        genre: "Electronic",
        year: "1997",
        members: ["Scott Kirkland","Ken Jordan"],
        cover: "../images/vegas.jpeg"
    },
];

app.get("/api/data", (req, res) => {
    res.json(albums);
});

app.get("api/data/:id", (req, res) => {
    const id = parseInt(req.params.id);

    const album = albums.find((al) => al.id === id);
    
    if (!album) {
        res.status(404).send("The album with the given id was not found.");
    }

    res.send(album);
});

app.post("/api/data", upload.single("cover"), (req, res) => {
    const result = validateAlbum(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const album = {
        _id: albums.length+1,
        name: req.body.name,
        band: req.body.band,
        genre: req.body.genre,
        year: req.body.year,
    };

    if (req.body.members) {
        album.members = req.body.members.split(",");
    }

    if (req.file) {
        album.cover = "images/" + req.file.filename;
    }

    albums.push(album);
    res.send(album);
});

app.put("/api/data/:id", upload.single("cover"), (req, res) => {
    const id = parseInt(req.params.id);
    const album = albums.find((al) => al._id === id);

    const result = validateAlbum(req.body);
    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    album.name = req.body.name;
    album.band = req.body.band;
    album.genre = req.body.genre;
    album.year = req.body.year;
    if (req.body.members) {
        album.members = req.body.members.split(",");
    }
    if (req.file) {
        album.cover = "images/" + req.file.filename;
    }

    res.send(album);
});

app.delete("/api/data/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const album = albums.find((al) => al._id === id);

    if (!album) {
        res.status(404).send("The album with the given id was not found.");
    }
    
    const index = albums.indexOf(album);
    albums.splice(index, 1);
    res.send(album);
});

const validateAlbum = (album) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(1).required(),
        band: Joi.string().min(1).required(),
        genre: Joi.string().min(3).required(),
        year: Joi.string().required(),
        members: Joi.allow(""),
    });
    return schema.validate(album);
};

app.listen(3000, () => {
    console.log("How can I help you?")
});