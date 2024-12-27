import os from "os";

export default function handler(req, res) {
    const username = os.userInfo().username;

    res.status(200).json({ username });
}
