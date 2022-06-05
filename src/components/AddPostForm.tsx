import React, { FC, memo, useCallback, useMemo, useState } from 'react';

import { useAddNewPostMutation } from '@/store/features/post/post.api';
import { selectUsers } from '@/store/features/user/user.slice';
import { useAppSelector } from '@/store/hooks';

const AddPostForm: FC = (): JSX.Element => {
  const [addNewPost, { isLoading, error }] = useAddNewPostMutation();
  const users = useAppSelector(selectUsers);
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [userId, setUserId] = useState<string>('');

  const canSave = useMemo(
    () => [title, body, userId].every(Boolean) && !isLoading,
    [title, body, userId, isLoading]
  );

  const onSavePostClicked = useCallback(async () => {
    if (canSave) {
      try {
        // add invalidateTags later on
        await addNewPost({ userId: +userId, title, body }).unwrap();
        setTitle('');
        setBody('');
        setUserId('');
      } catch {
        if (error) {
          if ('status' in error) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg =
              'error' in error ? error.error : JSON.stringify(error.data);
            return (
              <div>
                <div>An error has occurred:</div>
                <div>{errMsg}</div>
              </div>
            );
          } else {
            // you can access all properties of `SerializedError` here
            return <div>{error.message}</div>;
          }
        }
      }
    }
  }, [addNewPost, body, canSave, error, title, userId]);

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
