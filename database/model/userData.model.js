module.exports = (sequelize, Sequelize) => {
    const userdata = sequelize.define("userdata", {
        randAlphabet: {
            type: Sequelize.STRING
        }
    });
    return userdata;
};