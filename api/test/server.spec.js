//import server from '../server'
import graphql from 'graphql'
import todo from '../models/ToDo'
const todoType = todo.type;

describe('Server', () => {
    it('should return true',()=>{
        expect(true).to.equal(true)
    })
    // it('Should have an id field of type String', () => {
    //     console.log(todoType)
    //     expect(todoType.getFields()).to.have.property('id')
    //     expect(todoType.getFields().id.type).to.deep.equals(graphql.GraphQLString)
    // })
})
//graphql-tools moch testing https://github.com/apollographql/graphql-tools/blob/master/src/test/testMocking.ts
