import React, { FC, memo, useCallback } from 'react';

import { Post, reactionAdded } from '@/store/features/post/post.slice';
import { useAppDispatch } from '@/store/hooks';

type ReactionButtonsProps = { post: Post };
const reactionEmoji: { [P in keyof Post['reactions']]: string } = {
  thumbsUp: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕',
};
const ReactionButtons: FC<ReactionButtonsProps> = ({ post }): JSX.Element => {
  const dispatch = useAppDispatch();
  const renderReactionButtons = useCallback(() => {
    return Object.entries(reactionEmoji).map(([name, emoji]) => {
      return (
        <button
          key={name + '-' + emoji}
          type='button'
          onClick={() => {
            dispatch(
              reactionAdded({
                postId: post.id,
                reaction: name as keyof Post['reactions'],
              })
            );
          }}
        >
          {emoji} {post.reactions[name as keyof Post['reactions']]}
        </button>
      );
    });
  }, [dispatch, post.id, post.reactions]);
  return <div>{renderReactionButtons()}</div>;
};
export default memo(ReactionButtons);
