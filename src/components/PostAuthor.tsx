import React, { FC, memo } from 'react';

import { selectUsers } from '@/store/features/user/user.slice';
import { useAppSelector } from '@/store/hooks';

type PostAuthorProps = { userId: number };

const PostAuthor: FC<PostAuthorProps> = ({ userId }): JSX.Element => {
  const users = useAppSelector(selectUsers);

  const author = users.find((user) => +user.id === +userId);

  return <span>by {author ? author.name : 'Unknown author'}</span>;
};
export default memo(PostAuthor);
