import { graphql } from 'graphql';
import schema from '../Schema';

//Need to be written from test file to match current schema
//All below written by Kevin Danikowski
describe('Schema', ()=> {
    describe('ToDos', () => {
        it('should query all with args', () => {
            const todoQuery = '{ToDos { id task finished }}'
            return graphql(schema, todoQuery).then(results => {
                const todos = results.data.ToDos
                expect(todos).to.not.be.empty;
                expect(todos[0]).to.have.property('id').and.be.a('string')
                expect(todos[0]).to.have.property('task').and.be.a('string')
                expect(todos[0]).to.have.property('finished').and.be.a('boolean')
            })
        })
        it('should have Users with args', () => {
            const todoQuery = '{ToDos {id user{id name}}}'
            return graphql(schema, todoQuery).then(results => {
                const todoOne = results.data.ToDos[0]
                expect(todoOne).to.have.property('user').and.not.be.null;
                expect(todoOne.user).to.have.property('id').and.be.a('string')
                expect(todoOne.user).to.have.property('name').and.be.a('string')
            })
        })
    })
    describe('Users', () => {
        it('should query all with args', () => {
            const userQuery = '{Users { id name }}'
            return graphql(schema, userQuery).then(results => {
                const users = results.data.Users
                expect(users).to.not.be.empty;
                expect(users[0]).to.have.property('id').and.be.a('string')
                expect(users[0]).to.have.property('name').and.be.a('string')
            })
        })
        it('should have Users with args', () => {
            const userQuery = '{Users { id name todos { id task finished }}}'
            return graphql(schema, userQuery).then(results => {
                const userOne = results.data.Users[0]
                expect(userOne).to.have.property('todos').and.be.an('array').and.not.be.null;
                expect(userOne.todos[0]).to.have.property('id').and.be.a('string')
                expect(userOne.todos[0]).to.have.property('task').and.be.a('string')
                expect(userOne.todos[0]).to.have.property('finished').and.be.a('boolean')
            })
        })
        it('should create a User with proper response', () => {
            const newUserName = 'peterpan'
            const userMutation = `mutation{createUser(name: \"${newUserName}\"){id name}}`
            return graphql(schema, userMutation).then(results => {
                const newUser = results.data.createUser;
                expect(newUser).to.exist;
                expect(newUser).to.have.property('id')
                expect(newUser).to.have.property('name').and.equal(newUserName)
            })
        })
    })
})

// Casual Data Generator https://github.com/boo1ean/casual
