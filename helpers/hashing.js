const bcrypt = require('bcrypt');
// const saltRounds = 10;
const yourPassword = "someRandomPasswordHere";

function generate_hash_sync(password){
    var saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
}

function compare_password_sync(password, hash){
    return bcrypt.compareSync(password, hash);
}
hash = generate_hash_sync('oefjwifodksmcosd');
console.log(generate_hash_sync('oefjwifodksmcosd'))
console.log(compare_password_sync('oefjwifodksmcosd', hash))

module.exports = {generate_hash_sync: generate_hash_sync , compare_password_sync: compare_password_sync};