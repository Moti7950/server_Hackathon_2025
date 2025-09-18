export function ping(req, res, next) {
    console.log("Hi from ping");
    res.status(200).send("pong");
    next()
}
