module.exports = function (app) {
    // Routes 
    // 1. At the root path, send a simple hello world message to the browser
    app.get("/", function (req, res) {
        res.send("Hello world");
    });

    // 2. At the "/all" path, display every entry in the animals collection
    app.get("/all", function (req, res) {
        // Query: In our database, go to the animals collection, then "find" everything
        db.scraper.find({}, function (error, found) {
            // Log any errors if the server encounters one
            if (error) {
                console.log(error);
            }
            // Otherwise, send the result of this query to the browser
            else {
                res.json(found);
            }
        });
    });

    // 4. At the "/weight" path, display every entry in the animals collection, sorted by weight
    app.get("/??", function (req, res) {
        // Query: In our database, go to the animals collection, then "find" everything,
        // but this time, sort it by weight (-1 means descending order)
        db.scraper.find(), function (error, found) {
            // Log any errors if the server encounters one
            if (error) {
                console.log(error);
            }
            // Otherwise, send the result of this query to the browser
            else {
                res.json(found);
            }
        }
    });
};