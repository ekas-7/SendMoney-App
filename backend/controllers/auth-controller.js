
export const sayHello = (req, res) => {
    try {
        res.status(200).json({ msg: "Hello world" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
