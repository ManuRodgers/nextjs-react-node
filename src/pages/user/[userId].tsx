import Link from 'next/link';
import { useRouter } from 'next/router';
import { memo } from 'react';

import { useGetPostsByUserIdQuery } from '@/store/features/post/post.api';
import { selectUserById } from '@/store/features/user/user.slice';
import { useAppSelector } from '@/store/hooks';

const UserDetailPage = () => {
  const router = useRouter();
  const { userId } = router.query as unknown as { userId: number };
  const user = useAppSelector((state) =>
    selectUserById(state, userId.toString())
  );
  const {
    data: postsForUser,
    isLoading,
    isSuccess,
    error,
  } = useGetPostsByUserIdQuery({ userId });

  let content;
  if (isLoading) {
    content = <p>Loading...</p>;
  } else if (isSuccess) {
    const { ids, entities } = postsForUser;
    content = ids.map((id) => (
      <li key={id}>
        <Link href={`/post/${id}`}>{entities[id]?.title}</Link>
      </li>
    ));
  } else if (error) {
    if ('status' in error) {
      // you can access all properties of `FetchBaseQueryError` here
      const errMsg =
        'error' in error ? error.error : JSON.stringify(error.data);
      content = (
        <div>
          <div>An error has occurred:</div>
          <div>{errMsg}</div>
        </div>
      );
    } else {
      // you can access all properties of `SerializedError` here
      content = <div>{error.message}</div>;
    }
  }
  return (
    <section>
      <h2>{user?.name}</h2>
      <ol>{content}</ol>
    </section>
  );
};

export default memo(UserDetailPage);
