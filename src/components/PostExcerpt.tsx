import Link from 'next/link';
import React, { FC, memo } from 'react';

import PostAuthor from '@/components/PostAuthor';
import ReactionButtons from '@/components/ReactionButtons';
import TimeAgo from '@/components/TimeAgo';

import { Post } from '@/store/features/post/post.slice';

type PostExcerptProps = { post: Post };

const PostExcerpt: FC<PostExcerptProps> = ({ post }): JSX.Element => {
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
