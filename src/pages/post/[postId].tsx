import { NextPage } from 'next';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { connect } from 'react-redux';

import PostAuthor from '@/components/PostAuthor';
import ReactionButtons from '@/components/ReactionButtons';
import TimeAgo from '@/components/TimeAgo';

import { AppState } from '@/store';
import {
  selectPostById,
  useGetPostsQuery,
} from '@/store/features/post/post.api';
import { getUsersAsync } from '@/store/features/user/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const PostDetailPage: NextPage = (): JSX.Element => {
  const { isLoading } = useGetPostsQuery();
  const router = useRouter();
  const { postId } = router.query as { postId: string };
  console.log('🚀 ~ file: [postId].tsx ~ line 19 ~ postId', typeof postId);
  const post = useAppSelector((state) => selectPostById(state, +postId));
  console.log('🚀 ~ file: [postId].tsx ~ line 20 ~ post', post);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }

  return (
    <article>
      <Link href='/post'>Go Back</Link>
      <h2>{post.title}</h2>
      <p>{post.body}</p>
      <p className='postCredit'>
        <Link href={`/post/edit/${post.id}`}>Edit Post</Link>
        <PostAuthor userId={post.userId} />
        <TimeAgo timestamp={post.date} />
      </p>
      <ReactionButtons post={post} />
    </article>
  );
};

// No need to wrap pages if App was wrapped
PostDetailPage.getInitialProps = () => {
  return {};
};

// export default memo(PostDetailPage);
export default connect((state: AppState) => state)(PostDetailPage);
