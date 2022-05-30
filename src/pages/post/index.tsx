import { NextPage } from 'next';
import React, { memo, useEffect } from 'react';

import AddPostForm from '@/components/AddPostForm';
import PostExcerpt from '@/components/PostExcerpt';

import {
  getPostsAsync,
  selectPostError,
  selectPostIds,
  selectPostStatus,
} from '@/store/features/post/post.slice';
import { getUsersAsync } from '@/store/features/user/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const PostPage: NextPage = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const orderedPostIds = useAppSelector((state) => selectPostIds(state));
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
    content = content = orderedPostIds.map((postId) => (
      <PostExcerpt key={postId} postId={postId} />
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
