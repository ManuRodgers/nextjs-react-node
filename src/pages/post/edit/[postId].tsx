import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  deletePostAsync,
  getPostsAsync,
  selectPostById,
  selectPostStatus,
  Status,
  updatePostAsync,
} from '@/store/features/post/post.slice';
import { getUsersAsync, selectUsers } from '@/store/features/user/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const EditPostPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { postId } = router.query as { postId: string };
  const post = useAppSelector((state) => selectPostById(state, postId));
  const users = useAppSelector(selectUsers);
  const [title, setTitle] = useState<string>(post?.title || '');
  const [body, setBody] = useState<string>(post?.body || '');
  const [userId, setUserId] = useState<string>(post?.userId || '');
  const [updatePostAsyncStatus, setUpdatePostAsyncStatus] =
    useState<Status>('idle');
  const [deletePostAsyncStatus, setDeletePostAsyncStatus] =
    useState<Status>('idle');
  const postStatus = useAppSelector(selectPostStatus);
  useEffect(() => {
    if (postStatus === 'idle') {
      dispatch(getPostsAsync());
    }
  }, [dispatch, postStatus]);

  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setUserId(post.userId);
    }
  }, [post]);
  const canSave = useMemo(
    () =>
      [title, body, userId].every(Boolean) && updatePostAsyncStatus === 'idle',
    [body, title, userId, updatePostAsyncStatus]
  );

  const onSavePostClicked = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      if (canSave) {
        try {
          setUpdatePostAsyncStatus('pending');
          dispatch(
            updatePostAsync({
              id: postId,
              title,
              body,
              userId,
            })
          ).unwrap();
          setTitle('');
          setBody('');
          setUserId('');
          router.push(`/post/${postId}`);
        } catch (err) {
          console.error('Error updating post', err);
        } finally {
          setUpdatePostAsyncStatus('idle');
        }
      }
    },
    [body, canSave, dispatch, postId, router, title, userId]
  );

  const canDelete = useMemo(
    () => post && deletePostAsyncStatus === 'idle',
    [post, deletePostAsyncStatus]
  );
  const onDeletePostClicked = useCallback(
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.preventDefault();
      if (canDelete) {
        try {
          setDeletePostAsyncStatus('pending');
          dispatch(
            deletePostAsync({
              id: postId,
            })
          ).unwrap();
          setTitle('');
          setBody('');
          setUserId('');
          router.push('/post');
        } catch (err) {
          console.error('Error deleting post', err);
        } finally {
          setDeletePostAsyncStatus('idle');
        }
      }
    },
    [canDelete, dispatch, postId, router]
  );

  const usersOptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  if (!post) {
    return (
      <section>
        <h2>Post not found!</h2>
      </section>
    );
  }
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
        <button type='button' onClick={onDeletePostClicked}>
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default memo(EditPostPage);
