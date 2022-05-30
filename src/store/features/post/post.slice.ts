import {
  createAsyncThunk,
  createSlice,
  nanoid,
  PayloadAction,
} from '@reduxjs/toolkit';
import axios from 'axios';
import { sub } from 'date-fns';
import { HYDRATE } from 'next-redux-wrapper';

import { AppState } from '@/store';
const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts';
export type Post = {
  userId: string;
  id: string;
  title: string;
  body: string;
  date: string;
  reactions: {
    thumbsUp: number;
    wow: number;
    heart: number;
    rocket: number;
    coffee: number;
  };
};

export type Status = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export type PostState = {
  posts: Post[];
  currentPost: Post | null;
  status: Status;
  error: string | undefined;
};

const initialState: PostState = {
  posts: [],
  currentPost: null,
  status: 'idle',
  error: undefined,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    postAdded: {
      reducer: (
        state: PostState,
        { payload }: PayloadAction<{ post: Post }>
      ) => {
        state.posts.push(payload.post);
      },
      prepare: (post: Pick<Post, 'userId' | 'id' | 'title' | 'body'>) => {
        return {
          payload: {
            post: {
              ...post,
              id: nanoid(),
              date: new Date().toISOString(),
              reactions: {
                thumbsUp: 0,
                wow: 0,
                heart: 0,
                rocket: 0,
                coffee: 0,
              },
            },
          },
        };
      },
    },
    reactionAdded: (
      state: PostState,
      {
        payload: { postId, reaction },
      }: PayloadAction<{ postId: string; reaction: keyof Post['reactions'] }>
    ) => {
      const post = state.posts.find((post) => post.id === postId);
      if (post) {
        post.reactions[reaction]++;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(HYDRATE, () => {
        // SSR hydration
      })
      .addCase(getPostsAsync.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(
        getPostsAsync.fulfilled,
        (state, action: { payload: Omit<Post, 'reactions' | 'date'>[] }) => {
          state.status = 'fulfilled';
          let min = 1;
          const loadedPosts = action.payload.map(
            (post: typeof action.payload[0]) => ({
              ...post,
              reactions: {
                thumbsUp: 0,
                wow: 0,
                heart: 0,
                rocket: 0,
                coffee: 0,
              },
              date: sub(new Date(), { minutes: min++ }).toISOString(),
            })
          );
          const finalPosts = loadedPosts.filter((loadedPost) => {
            const isPostExists = state.posts.find(
              (post) => post.id === loadedPost.id
            );
            return !isPostExists;
          });
          state.posts = state.posts.concat(finalPosts);
        }
      )
      .addCase(getPostsAsync.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message;
      })
      .addCase(addPostAsync.fulfilled, (state, action) => {
        const newPost: Post = {
          ...action.payload,
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        };
        postsSlice.caseReducers.postAdded(state, {
          payload: { post: newPost },
          type: 'posts/postAdded',
        });
      })
      .addCase(updatePostAsync.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const unchangedPosts = state.posts.filter((post) => post.id !== id);
        const updatedPost: Post = {
          ...state.posts.filter((post) => post.id === id)[0],
          ...action.payload,
        };
        state.posts = unchangedPosts.concat(updatedPost);
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        const unchangedPosts = state.posts.filter((post) => post.id !== id);
        state.posts = unchangedPosts;
      });
  },
});

// actions
export const { postAdded, reactionAdded } = postsSlice.actions;

// async actions
export const getPostsAsync = createAsyncThunk(
  'posts/getPostsAsync',
  async () => {
    const response = await axios(POSTS_URL);
    return response.data;
  }
);
export type AddPostAsyncInput = Pick<Post, 'userId' | 'title' | 'body'>;
export type AddPostAsyncOutput = Pick<Post, 'userId' | 'id' | 'title' | 'body'>;
export const addPostAsync = createAsyncThunk<
  AddPostAsyncOutput,
  AddPostAsyncInput
>('posts/addPostAsync', async ({ userId, title, body }) => {
  const response = await axios.post(POSTS_URL, { title, body, userId });
  return response.data;
});

export type UpdatePostAsyncInput = Pick<
  Post,
  'userId' | 'title' | 'body' | 'id'
>;
export type UpdatePostAsyncOutput = Pick<
  Post,
  'userId' | 'id' | 'title' | 'body'
>;
export const updatePostAsync = createAsyncThunk<
  UpdatePostAsyncOutput,
  UpdatePostAsyncInput
>('posts/updatePostAsync', async ({ userId, title, body, id }) => {
  try {
    const response = await axios.put(`${POSTS_URL}/${id}`, {
      title,
      body,
      userId,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
});
export type DeletePostAsyncInput = Pick<Post, 'id'>;
export type DeletePostAsyncOutput = Pick<
  Post,
  'userId' | 'id' | 'title' | 'body'
>;
export const deletePostAsync = createAsyncThunk<
  DeletePostAsyncOutput,
  DeletePostAsyncInput
>('posts/deletePostAsync', async ({ id }) => {
  try {
    const response = await axios.delete(`${POSTS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
});
// selectors
export const selectCurrentPost = (state: AppState) => state.post.currentPost;
export const selectPosts = (state: AppState) => state.post.posts;
export const selectPostById = (state: AppState, postId: string) =>
  state.post.posts.find((post) => post.id.toString() === postId.toString());
export const selectPostStatus = (state: AppState) => state.post.status;
export const selectPostError = (state: AppState) => state.post.error;
// reducer
const postReducer = postsSlice.reducer;
export default postReducer;
