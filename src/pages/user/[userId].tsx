import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo, useMemo } from 'react';

import { selectPostsByUserId } from '@/store/features/post/post.slice';
import { selectUserById } from '@/store/features/user/user.slice';
import { useAppSelector } from '@/store/hooks';

const UserDetailPage = () => {
  const router = useRouter();
  const { userId } = router.query as { userId: string };
  const user = useAppSelector((state) => selectUserById(state, userId));
  const postsForUser = useAppSelector((state) =>
    selectPostsByUserId(state, userId)
  );
  console.log(
    '🚀 ~ file: [userId].tsx ~ line 16 ~ UserDetailPage ~ postsForUser',
    postsForUser
  );
  const postTitles = useMemo(
    () =>
      postsForUser.map((post) => (
        <li key={post.id}>
          <Link href={`/post/${post.id}`}>{post.title}</Link>
        </li>
      )),
    [postsForUser]
  );
  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{postTitles}</ol>
    </section>
  );
};

export default memo(UserDetailPage);
