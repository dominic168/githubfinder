import React, { useReducer } from 'react';
import axios from 'axios';
import GithubContext from './githubContext';
import GithubReducer from './githubreducer';
import {
  SEARCH_USERS,
  SET_LOADING,
  CLEAR_USERS,
  GET_USER,
  GET_REPOS
} from '../types';

const GithubState = props => {
  const initialState = {
    users: [],
    user: {},
    repos: [],
    loading: false
  };

  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Search users
  const searchUsers = async text => {
    setLoading();

    const res = await axios.get(
      `https://${process.env.REACT_APP_GITHUB_HOST}/search/users?q=${text}`
    );

    dispatch({
      type: SEARCH_USERS,
      payload: res.data.items
    });
  };

  // Get User
  const getSingleUser = async username => {
    setLoading();

    const res = await axios.get(
      `https://${process.env.REACT_APP_GITHUB_HOST}/users/${username}`
    );

    dispatch({
      type: GET_USER,
      payload: res.data
    });
  };

  //Get Repos
  const getUserRepos = async username => {
    setLoading(true);

    const res = await axios.get(
      `https://${process.env.REACT_APP_GITHUB_HOST}/users/${username}/repos?per_page=5&sort=created:asc`
    );

    dispatch({
      type: GET_REPOS,
      payload: res.data
    });
  };

  // Clear Users
  const clearUsers = () => dispatch({ type: CLEAR_USERS });

  //Set loading
  const setLoading = () => dispatch({ type: SET_LOADING });

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        user: state.user,
        repos: state.repos,
        loading: state.loading,
        searchUsers,
        clearUsers,
        getSingleUser,
        getUserRepos
      }}
    >
      {props.children}
    </GithubContext.Provider>
  );
};

export default GithubState;
