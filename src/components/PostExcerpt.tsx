import { EntityId } from '@reduxjs/toolkit';
import Link from 'next/link';
import React, { FC, memo } from 'react';

import PostAuthor from '@/components/PostAuthor';
import ReactionButtons from '@/components/ReactionButtons';
import TimeAgo from '@/components/TimeAgo';

import { selectPostById } from '@/store/features/post/post.slice';
import { useAppSelector } from '@/store/hooks';

type PostExcerptProps = { postId: EntityId };

const PostExcerpt: FC<PostExcerptProps> = ({ postId }): JSX.Element => {
  const post = useAppSelector((state) => selectPostById(state, postId));
  if (!post) {
    return <></>;
  }
  return (
    <article>
      <h3>{post.title}</h3>
      <p>{post.body.substring(0, 100)}</p>
      <p>
        <Link href={`/post/${post.id}`}>View Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
};
export default memo(PostExcerpt);
