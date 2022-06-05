import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import {
  selectPostById,
  useDeletePostMutation,
  useUpdatePostMutation,
} from '@/store/features/post/post.api';
import { getUsersAsync, selectUsers } from '@/store/features/user/user.slice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

const EditPostPage: NextPage = () => {
  const dispatch = useAppDispatch();
  const [updatePost, { isLoading: updatePostLoading, error: updatePostError }] =
    useUpdatePostMutation();
  const [deletePost, { isLoading: deletePostLoading, error: deletePostError }] =
    useDeletePostMutation();
  const router = useRouter();
  const { postId } = router.query as { postId: string };
  const post = useAppSelector((state) => selectPostById(state, postId));
  const users = useAppSelector(selectUsers);
  const [title, setTitle] = useState<string>(post?.title || '');
  const [body, setBody] = useState<string>(post?.body || '');
  const [userId, setUserId] = useState<string>(post?.userId.toString() || '');

  useEffect(() => {
    dispatch(getUsersAsync());
  }, [dispatch]);
  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
      setUserId(post.userId.toString());
    }
  }, [post]);
  const canUpdate = useMemo(
    () => [title, body, userId].every(Boolean) && !updatePostLoading,
    [title, body, userId, updatePostLoading]
  );
  const onUpdatePostClicked = useCallback(async () => {
    if (canUpdate) {
      try {
        await updatePost({
          id: +postId,
          userId: +userId,
          title,
          body,
        }).unwrap();
        setTitle('');
        setBody('');
        setUserId('');
        router.push(`/post/${postId}`);
      } catch {
        if (updatePostError) {
          if ('status' in updatePostError) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg =
              'error' in updatePostError
                ? updatePostError.error
                : JSON.stringify(updatePostError.data);
            return (
              <div>
                <div>An updatePostError has occurred:</div>
                <div>{errMsg}</div>
              </div>
            );
          } else {
            // you can access all properties of `SerializedError` here
            return <div>{updatePostError.message}</div>;
          }
        }
      }
    }
  }, [
    canUpdate,
    updatePost,
    postId,
    userId,
    title,
    body,
    router,
    updatePostError,
  ]);

  const canDelete = useMemo(
    () => [postId].every(Boolean) && !deletePostLoading,
    [deletePostLoading, postId]
  );

  const onDeletePostClicked = useCallback(async () => {
    if (canDelete) {
      try {
        await deletePost({ postId: +postId }).unwrap();
        router.push('/post');
      } catch {
        if (deletePostError) {
          if ('status' in deletePostError) {
            // you can access all properties of `FetchBaseQueryError` here
            const errMsg =
              'error' in deletePostError
                ? deletePostError.error
                : JSON.stringify(deletePostError.data);
            return (
              <div>
                <div>An deletePostError has occurred:</div>
                <div>{errMsg}</div>
              </div>
            );
          } else {
            // you can access all properties of `SerializedError` here
            return <div>{deletePostError.message}</div>;
          }
        }
      }
    }
  }, [canDelete, deletePost, deletePostError, postId, router]);

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
        <button
          type='button'
          onClick={onUpdatePostClicked}
          disabled={!canUpdate}
        >
          Update Post
        </button>
        <button
          type='button'
          onClick={onDeletePostClicked}
          disabled={!canDelete}
        >
          Delete Post
        </button>
      </form>
    </section>
  );
};

export default memo(EditPostPage);
