import { createEntityAdapter, createSelector } from '@reduxjs/toolkit';
import { sub } from 'date-fns';

import { AppState } from '@/store';
import { baseApi } from '@/store/api';

export type Post = {
  userId: number;
  id: number;
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

const initialState = postsAdapter.getInitialState();

export const postApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<typeof initialState, void>({
      query: () => '/posts',
      transformResponse: (response: Post[]) => {
        let min = 1;
        const loadedPosts = response.map((post) => {
          if (!post?.date) {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          if (!post?.reactions) {
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          }
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => {
        return result
          ? [
              { type: 'Post', id: 'LIST' },
              ...result.ids.map((id) => ({ type: 'Post' as const, id })),
            ]
          : [{ type: 'Post' as const, id: 'LIST' }];
      },
    }),
    getPostsByUserId: builder.query<typeof initialState, Pick<Post, 'userId'>>({
      query: ({ userId }) => `/posts/?userId=${userId}`,
      transformResponse: (response: Post[]) => {
        let min = 1;
        const loadedPosts = response.map((post) => {
          if (!post?.date) {
            post.date = sub(new Date(), { minutes: min++ }).toISOString();
          }
          if (!post?.reactions) {
            post.reactions = {
              thumbsUp: 0,
              wow: 0,
              heart: 0,
              rocket: 0,
              coffee: 0,
            };
          }
          return post;
        });
        return postsAdapter.setAll(initialState, loadedPosts);
      },
      providesTags: (result) => {
        return result
          ? [...result.ids.map((id) => ({ type: 'Post' as const, id }))]
          : [];
      },
    }),
    addNewPost: builder.mutation<
      typeof initialState,
      Pick<Post, 'userId' | 'title' | 'body'>
    >({
      query: ({ userId, body, title }) => ({
        url: `/posts`,
        method: 'POST',
        body: {
          userId,
          title,
          body,
          date: new Date().toISOString(),
          reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
          },
        },
      }),
      invalidatesTags: [{ type: 'Post', id: 'LIST' }],
    }),
    updatePost: builder.mutation<
      typeof initialState,
      Pick<Post, 'userId' | 'body' | 'title' | 'id'>
    >({
      query: (updatedPost) => ({
        url: `/posts/${updatedPost.id}`,
        method: 'PUT',
        body: {
          ...updatedPost,
          date: new Date().toISOString(),
        },
      }),
      invalidatesTags: (result, error, args) => [{ type: 'Post', id: args.id }],
    }),
    deletePost: builder.mutation<typeof initialState, { postId: number }>({
      query: ({ postId }) => ({
        url: `/posts/${postId}`,
        method: 'DELETE',
        body: { id: postId },
      }),
      invalidatesTags: (result, error, args) => [
        { type: 'Post', id: args.postId },
      ],
    }),
    addReactions: builder.mutation<
      typeof initialState,
      { postId: number; reactions: Post['reactions'] } // indexed access type
    >({
      query: ({ postId, reactions }) => ({
        url: `/posts/${postId}`,
        method: 'PATCH',
        // In a real app, we'd probably need to base this on user ID somehow
        // so that a user can't do the same reaction more than once
        body: { reactions },
      }),
      // optimistically update the post's reactions
      onQueryStarted: async (
        { postId, reactions },
        { dispatch, queryFulfilled }
      ) => {
        const patchCollection = dispatch(
          postApi.util.updateQueryData('getPosts', undefined, (draft) => {
            // The draft is immer-wrapped and can be "mutated" directly like in createSlice
            const post = draft.entities[postId];
            if (post) {
              post.reactions = reactions;
            }
          })
        );
        try {
          await queryFulfilled;
        } catch {
          // If the query failed, we need to revert the patch
          console.log('optimistic update failed');
          patchCollection.undo();
        }
      },
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetPostsQuery,
  useGetPostsByUserIdQuery,
  useAddNewPostMutation,
  useUpdatePostMutation,
  useDeletePostMutation,
  useAddReactionsMutation,
} = postApi;

export const selectPostsResult = postApi.endpoints.getPosts.select();

const selectPostsData = createSelector(
  selectPostsResult,
  (result) => result.data
);

export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors<AppState>(
  (state) => selectPostsData(state) || initialState
);
