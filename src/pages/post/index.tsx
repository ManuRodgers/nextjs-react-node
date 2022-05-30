import { NextPage } from 'next';
import React, { memo, useEffect } from 'react';

import AddPostForm from '@/components/AddPostForm';
import PostExcerpt from '@/components/PostExcerpt';

import {
  getPostsAsync,
  selectPostError,
  selectPosts,
  selectPostStatus,
} from '@/store/features/post/post.slice';
import { getUsersAsync } from '@/store/features/user/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const PostPage: NextPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectPosts);
  const postStatus = useAppSelector(selectPostStatus);
  const postError = useAppSelector(selectPostError);
  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(getPostsAsync());
    }
  }, [dispatch, postStatus]);

  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);

  let content;
  if (postStatus === 'pending') {
    content = <p>Loading...</p>;
  } else if (postStatus === 'rejected') {
    content = <p>Error: {postError}</p>;
  } else if (postStatus === 'fulfilled') {
    const orderedPosts = posts
      .slice()
      .sort((a, b) => b.date.localeCompare(a.date));
    content = orderedPosts.map((post, index) => (
      <PostExcerpt key={post.id + index} post={post} />
    ));
  }

  return (
    <div>
      <AddPostForm />
      <h2>Posts</h2>
      {content}
    </div>
  );
};
export default memo(PostPage);
