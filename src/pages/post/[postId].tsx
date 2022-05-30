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
  getPostsAsync,
  selectPostById,
  selectPostStatus,
} from '@/store/features/post/post.slice';
import { getUsersAsync } from '@/store/features/user/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const PostDetailPage: NextPage = (): JSX.Element => {
  const router = useRouter();
  const { postId } = router.query as { postId: string };
  const post = useAppSelector((state) => selectPostById(state, postId));
  const dispatch = useAppDispatch();
  const postStatus = useAppSelector(selectPostStatus);
  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(getPostsAsync());
    }
  }, [dispatch, postStatus]);

  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);

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
