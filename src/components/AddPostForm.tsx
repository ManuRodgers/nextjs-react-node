import { useRouter } from 'next/router';
import React, { FC, memo, useCallback, useMemo, useState } from 'react';

import { addPostAsync, Status } from '@/store/features/post/post.slice';
import { selectUsers } from '@/store/features/user/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const AddPostForm: FC = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const users = useAppSelector(selectUsers);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [userId, setUserId] = useState<string>('');
  const [addPostAsyncStatus, setAddPostAsyncStatus] = useState<Status>('idle');
  const canSave = useMemo(
    () => [title, body, userId].every(Boolean) && addPostAsyncStatus === 'idle',
    [body, title, userId, addPostAsyncStatus]
  );

  const onSavePostClicked = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      if (canSave) {
        try {
          setAddPostAsyncStatus('pending');
          dispatch(
            addPostAsync({
              title,
              body,
              userId,
            })
          ).unwrap();
          setTitle('');
          setBody('');
          setUserId('');
          router.push('/post');
        } catch (err) {
          console.error('Error adding post', err);
        } finally {
          setAddPostAsyncStatus('idle');
        }
      }
    },
    [body, canSave, dispatch, router, title, userId]
  );
  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));
  return (
    <section>
      <h2>Add a New Post</h2>
      <form>
        <label htmlFor='postTitle'>Post Title:</label>
        <input
          type='text'
          id='postTitle'
          name='postTitle'
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
        />
        <label htmlFor='postAuthor'>Author:</label>
        <select
          id='postAuthor'
          value={userId}
          onChange={(e) => {
            setUserId(e.target.value);
          }}
        >
          <option value=''></option>
          {usersOptions}
        </select>
        <label htmlFor='postContent'>Body:</label>
        <textarea
          id='postBody'
          name='postBody'
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
          }}
        />
        <button type='button' onClick={onSavePostClicked} disabled={!canSave}>
          Save Post
        </button>
      </form>
    </section>
  );
};
export default memo(AddPostForm);
