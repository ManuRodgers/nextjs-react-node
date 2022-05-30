import { NextPage } from 'next';
import Link from 'next/link';
import { memo } from 'react';

import { selectUsers } from '@/store/features/user/user.slice';
import { useAppSelector } from '@/store/hooks';

const UserPage: NextPage = () => {
  const users = useAppSelector(selectUsers);

  const renderedUsers = users.map((user) => (
    <li key={user.id}>
      <Link href={`/user/${user.id}`}>{user.name}</Link>
    </li>
  ));
  return (
    <section>
      <h2>Users</h2>
      <ul>{renderedUsers}</ul>
    </section>
  );
};

export default memo(UserPage);
