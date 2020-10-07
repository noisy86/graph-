import React from "react";
import { render } from "react-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  useQuery,
  gql,
  useMutation
} from "@apollo/client";

import ItemForm from "./edit_add"

const client = new ApolloClient({
  uri: 'http://localhost:3005/graphql',
  cache: new InMemoryCache()
})

const MOVIES_NAMES = gql`
  query moviesQuery {
    movies {
      name
      genre
      id
    }
  }
`;

const ADD_MOVIE = gql`
  mutation AddMovie( $name: String!, $genre: String!, $directorId: ID) {
    addMovie(name: $name, genre:$genre, directorId:$directorId) {
      id
      name
      genre
      directorId
    }
  }
`;

const DELETE_MOVIE = gql`
  mutation DeleteMovie($id: ID!){
    deleteMovie(id: $id){
      id
    }
  }
`;

const UPDATE_MOVIE = gql`
  mutation($id: ID!, $name: String!, $genre: String!, $directorId: ID){
    updateMovie(id: $id, name: $name, genre: $genre, directorId: $directorId){
      name,
      genre
    }
  }
`

function AddMovie() {
  let input_name;
  let input_genre;
  const [addMovie, { data }] = useMutation(ADD_MOVIE, {
        update(cache, { data: { addMovie } }) {
          cache.modify({
            fields: {
              movies(existingMovies = []) {
                const newMovieRef = cache.writeFragment({
                  data: addMovie,
                  fragment: gql`
                    fragment NewMovie on Movies {
                      name
                      genre
                    }
                  `
                });
                return [...existingMovies, newMovieRef];
              }
            }
          });
        }
      }
  );

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addMovie({ variables: { name: input_name.value, genre: input_genre.value } });
          input_name.value = '';
          input_genre.value = '';
        }}
      >
        <input
          ref={node => {
            input_name = node;
          }}
        />
        <input
          ref={node => {
            input_genre = node;
          }}
        />
        <button type="submit">Add Todo</button>
      </form>
    </div>
  );
}



// function UpdateMovie(k) {
//   const { loading, error, data } = useQuery(MOVIES_NAMES);
//   const [updateMovie] = useMutation(UPDATE_MOVIE);
//
//
//   if (loading) return <p>Loading...</p>;
//  if (error) return <p>Error :(</p>;
//    // return data.movies.map(( { id, name, genre } ) => {
//    //   console.log({id});
//    // })
// console.log(k);
//  // return data.movies.map(({ id, name, genre  }) => {
//  //   let input_name;
//  //   let input_genre;
//  //
//  //   return (
//  //     <div key={id}>
//  //       <p>{id}</p>
//  //       <form
//  //         onSubmit={e => {
//  //           e.preventDefault();
//  //           updateMovie({ variables: { id, name: input_name.value, genre: input_genre.value } });
//  //           input_name.value = '';
//  //           input_genre.value = '';
//  //         }}
//  //       >
//  //         <input
//  //           ref={node => {
//  //             input_name = node;
//  //           }}
//  //         />
//  //         <input
//  //           ref={node => {
//  //             input_genre = node;
//  //           }}
//  //         />
//  //         <button type="submit">Update Todo</button>
//  //       </form>
//  //     </div>
//  //   );
//  // });
//
// }

  // return (
  //   <div>
  //     <form
  //       onSubmit={e => {
  //         e.preventDefault();
  //         updateMovie({ variables: { name: input_name.value, genre: input_genre.value } });
  //         input_name.value = '';
  //         input_genre.value = '';
  //       }}
  //     >
  //       <input
  //         ref={node => {
  //           input_name = node;
  //         }}
  //       />
  //       <input
  //         ref={node => {
  //           input_genre = node;
  //         }}
  //       />
  //       <button type="submit">Add Todo</button>
  //     </form>
  //   </div>
  // );




function GetMovies() {

  // function UpdateMovie(name){
  //   console.log(name);
  // }
  const { loading, error, data } = useQuery(MOVIES_NAMES);
  const [deleteMovie] = useMutation(DELETE_MOVIE);
  // const [updateMovie] = useMutation(UPDATE_MOVIE);
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

// const uodateCache = (client) => {
//   const data = client.readQuery{(
//     queryL GET_MOVIES,
//     variables: {
//       isPublick
//     });
//     const newData = {
//       movies: data.movies.filter((t) => t.id !== item.id)
//     }
//     }


  return data.movies.map(({ name, genre, id }) => (
    <div key={name}>
      <p>
        {name}: {genre}
        <button  onClick={() => {
        deleteMovie({ variables: { id: id } });
        // window.location.reload();
      }}>X</button>
      <button className={id} onClick={() => UpdateMovie({id})}> edit </button>

      </p>
    </div>
  ));
}



// function TEST1(e) {
//    const [deleteMovie, { loading: deleting, error: deleteError }] = useMutation(DELETE_MOVIE);
  // const updateCache = (client) => {
  //       const data = client.readQuery({
  //         query: MOVIES_NAMES,
  //         variables: {
  //           isPublic,
  //         }
  //       });
  //       const newData = {
  //         todos: data.todos.filter((t) => t.id !== item.id)
  //       }
  //       client.writeQuery({
  //         query: FETCH_TODOS,
  //         variables: {
  //           isPublic,
  //         },
  //         data: newData
  //       });
  //     }
      // const remove = () => {
      //   if (deleting) return;
      //   deleteMovie({
      //     variables: { id: e.currentTarget.id },
      //     // update: updateCache
      //   });
      // };
  //     return (
  //       <View style={styles.deleteButton}>
  //         <Icon
  //           name="delete"
  //           size={26}
  //           onPress={remove}
  //           disabled={deleting}
  //           color={"#BC0000"}
  //         />
  //       </View>
  //     );
  // alert(e.currentTarget.id );
// }

function UpdateMovie(k) {
  let input_id;
  let input_name;
  let input_genre;
  const [updateMovie, { data }] = useMutation(UPDATE_MOVIE);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          updateMovie({ variables: {  id: input_id.value, name: input_name.value, genre: input_genre.value } });
          input_id.value = k;
          input_name.value = '';
          input_genre.value = '';
        }}
      >
      <input
      // className  = 'mam';
        ref={node => {
          input_id= node;
        }}

      />
      <input
        ref={node => {
          input_name = node;
        }}
      />
      <input
        ref={node => {
          input_genre = node;
        }}
      />
        <button type="submit">Edit Movie</button>
      </form>
    </div>
  );
}



function App() {
  return (
    <ApolloProvider client={client}>
      <div>
        <h2>My first Apollo app <span  role="img" aria-label='rocket'>🚀</span></h2>
        <GetMovies />
        <AddMovie />
        <UpdateMovie />
      </div>
      </ApolloProvider>
  );
}


render(<App />, document.getElementById('root'));
