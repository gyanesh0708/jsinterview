
const getTime = module.exports.getTime = () => {
    const date = new Date();
    var ISToffSet = 330; //IST is 5:30; i.e. 60*5+30 = 330 in minutes 
    offset = ISToffSet * 60 * 1000;
    var ISTTime = new Date(date.getTime() + offset);
    return ISTTime;

}
