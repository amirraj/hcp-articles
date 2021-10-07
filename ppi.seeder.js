const async = require('async');
const _USER = require('./database_large.json');
const {ct_db} = require('./src/config/database');
const dotenv = require('dotenv');


async function init(){
    
    const HcpArticlesModel = require('./src/server/hcp-articles.model.js');
    dotenv.config();

    async function ppiDbStructureSeeder() {
        await ct_db.query(`CREATE SCHEMA IF NOT EXISTS ${process.env.POSTGRES_PPI_SCHEMA}`);
        await ct_db.sync({ force: true });
    }

    function ppiDbDummyDataSeeder() {
        HcpArticlesModel.destroy({ truncate: { cascade: true } }).then(() => {
            HcpArticlesModel.bulkCreate(_USER)
                .then(users => {
                    console.log(`successful adding users.`);
                })
                .catch(err => {
                    console.log(err);
                })
        });
    }

    async.waterfall([
        ppiDbStructureSeeder,
        ppiDbDummyDataSeeder], function (err) {
        if (err) console.error(err);
        else console.info('DB seed completed!');
        process.exit();
    });
}

init();
