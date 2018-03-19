import Sequelize from 'sequelize'
/*
const connection = mysql.createConnection({
    host: 'wtm-lnx-2.m2', //use wtm-lnx-2.m2
    user: 'u_kdanikowski', // use u_kdanikowski
    password: 'Ud0b0K0MGd4k7TM6', //use Ud0b0K0MGd4k7TM6
    database: 'x_kevinsdb_test', //use x_kevinsdb_test
    port: 3306 //use 3306
})
 */
/* DB NOTES AND SCHEMAS
votes of one language into anther - save success of translation 1-5
option for multiple languages, option to see what it translated it into
will need to put a throttle on translator
languages that spin it backwards
additional spinning = add thesaurus

 */
const Conn = new Sequelize('x_kevinsdb_test', 'u_kdanikowski', 'Ud0b0K0MGd4k7TM6', {
    host: 'wtm-lnx-2.m2',
    dialect: 'mysql',
    port: 3306,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
})
const userNameList = ['tina', 'dave', 'peter', 'rosali', 'edgar', 'pricilla', 'dominic', 'heather']
const User = Conn.define('user',{
    name: {
        type: Sequelize.STRING
    }
})
const ToDo = Conn.define('todo', {
    task: {
        type: Sequelize.STRING,
        allowNull: true
    },
    finished: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
        defaultValue: false
    }
})

/*   Relations   */
User.hasMany(ToDo)
ToDo.belongsTo(User)
//doing joins https://lorenstewart.me/2016/09/12/sequelize-table-associations-joins/

// Conn.sync({force: true}).then(()=>{ //forces tables to be overwritten
//     userNameList.map(name => {
//         console.log('going to create user ', name)
//         return User.create({
//             name: name
//         }).then(user => {
//             return user.createTodo({ //createTodo generated from 'todo' name, autocapitalized T.
//                 task: `This task is ${user.name}\'s`
//             })
//         })
//     })
// })


export default Conn
