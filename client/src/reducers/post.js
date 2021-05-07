import { GET_POSTS, POST_ERROR } from "../action/types";

const initialState = {
  posts: [],
  post: null,
  loading: false,
  error: {},
};

export default function post(state = initialState, action) {
  const { type, payload } = action;
  switch (type) {
    case GET_POSTS: {
      return {
        ...state,
        post: payload,
        loading: false,
      };
    }
    case POST_ERROR: {
      return {
        ...state,
        error: payload,
        loading: false,
      };
    }
    default: {
      return state;
    }
  }
}
