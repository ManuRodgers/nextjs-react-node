import { NextPage } from 'next';
import React, { memo, useEffect } from 'react';

import AddPostForm from '@/components/AddPostForm';
import PostExcerpt from '@/components/PostExcerpt';

import {
  selectPostIds,
  useGetPostsQuery,
} from '@/store/features/post/post.api';
import { getUsersAsync } from '@/store/features/user/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const PostPage: NextPage = (): JSX.Element => {
  const { isLoading, isSuccess, error } = useGetPostsQuery();

  const dispatch = useAppDispatch();
  const orderedPostIds = useAppSelector((state) => selectPostIds(state));
  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (error) {
    content = <p>Error</p>;
  } else if (isSuccess) {
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
