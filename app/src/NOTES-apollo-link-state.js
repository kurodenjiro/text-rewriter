//components/TodoApp.js
import { graphql } from 'react-apollo'

class TodoApp extends React.Component {
    render () { ... }
}

const withTodos = graphql(todosQuery, {
    props: ({ data }) => ({
        //addin loading?
        todos: data ? data.allTodoes : []
    })
})

const withAddTodo = graphql(addTodoMutation, {
    props: ({ mutate })  => ({
        addTodo: (text) => mutate({ variables: { text } })
    })
})

const withToggleTodo = graphql(toggleTodoMutation, {
    props: ({ mutate })  => ({
        toggleTodo: (id, complete) => mutate({ variables: { id, complete } })
    })
})

export default withTodos(withAddTodo(withToggleTodo(TodoApp)))

/* see link https://medium.com/google-developer-experts/graphql-and-the-amazing-apollo-client-fe57e162a70c for great solution of returning defaults maybe */
