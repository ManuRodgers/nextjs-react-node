import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
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

const postsAdapter = createEntityAdapter<Post>({
  sortComparer: (a, b) => b.date.localeCompare(a.date),
});

export type Status = 'idle' | 'pending' | 'fulfilled' | 'rejected';

export type PostState = {
  status: Status;
  error: string | undefined;
};

const initialState = postsAdapter.getInitialState<PostState>({
  status: 'idle',
  error: undefined,
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reactionAdded: (
      state: typeof initialState,
      {
        payload: { postId, reaction },
      }: PayloadAction<{ postId: string; reaction: keyof Post['reactions'] }>
    ) => {
      const existingPost = state.entities[postId];
      if (existingPost) {
        existingPost.reactions[reaction]++;
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
          postsAdapter.upsertMany(state, loadedPosts);
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
        postsAdapter.addOne(state, newPost);
      })
      .addCase(updatePostAsync.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Update could not complete');
          console.log(action.payload);
          return;
        }
        const { id, body, title, userId } = action.payload;
        const existingPost = state.entities[id];
        console.log(
          '🚀 ~ file: post.slice.ts ~ line 117 ~ .addCase ~ existingPost',
          existingPost
        );
        if (existingPost) {
          existingPost.body = body;
          existingPost.title = title;
          existingPost.userId = userId;
          postsAdapter.upsertOne(state, existingPost);
        }
      })
      .addCase(deletePostAsync.fulfilled, (state, action) => {
        if (!action.payload?.id) {
          console.log('Delete could not complete');
          console.log(action.payload);
          return;
        }
        const { id } = action.payload;
        postsAdapter.removeOne(state, id);
      });
  },
});

// actions
export const { reactionAdded } = postsSlice.actions;

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
export const {
  selectAll: selectPosts,
  selectIds: selectPostIds,
  selectById: selectPostById,
} = postsAdapter.getSelectors((state: AppState) => state.post);
export const selectPostsByUserId = createSelector(
  [selectPosts, (state: AppState, userId: string) => userId],
  (posts, userId) =>
    posts.filter((post) => post.userId.toString() === userId.toString())
);
export const selectPostStatus = (state: AppState) => state.post.status;
export const selectPostError = (state: AppState) => state.post.error;
// reducer
const postReducer = postsSlice.reducer;
export default postReducer;
