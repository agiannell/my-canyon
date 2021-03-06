module.exports = {
    getCanyons: async (req, res) => {
        const db = req.app.get('db');
        const canyons = await db.canyons.get_all_canyons();

        if (!canyons[0]) {
            return res.status(404).send(`No canyons to display`);
        }
        res.status(200).send(canyons);

    },

    getCanyon: async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');

        const result = await db.canyons.get_canyon({ id })
        const canyon = result[0];
        res.status(200).send(canyon);
    },

    getCanyonsByUserId: async (req, res) => {
        const { id } = req.params;
        const db = req.app.get('db');

        const canyons = await db.canyons.get_canyons_by_user({ user_id: id });

        if (!canyons[0]) {
            return res.status(404).send(`No Canyons to Display`);
        }

        res.status(200).send(canyons);
    },

    addCanyon: async (req, res) => {
        const {
            canyon_name,
            canyon_description,
            canyon_pic,
            canyon_state,
            zipcode
        } = req.body;
        let date = new Date();
        const { user_id } = req.session.user;

        const db = req.app.get('db');

        await db.canyons.add_canyon({
            canyon_name,
            canyon_description,
            canyon_pic,
            canyon_state,
            user_id,
            date,
            zipcode
        })
            .then(() => res.sendStatus(200))
            .catch(err => console.log(`Error: ${err.message}`));
    },

    deleteCanyon: (req, res) => {
        const { id } = req.params;
        req.app.get('db').canyons.delete_canyon({ id })
            .then(() => res.sendStatus(200))
            .catch(err => console.log(`Error: ${err.message}`));
    },

    editCanyon: async (req, res) => {
        const { canyon_pic, canyon_description } = req.body;
        const { user_id } = req.session.user;
        const { id } = req.params;

        const db = req.app.get('db');

        db.canyons.edit_canyon({ id, user_id, canyon_pic, canyon_description })
            .then(() => res.sendStatus(200))
            .catch(err => {
                res.status(500).send(err);
                console.log(`Error: ${err.message}`)
            });
    }
}