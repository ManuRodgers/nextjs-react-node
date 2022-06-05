import React, { FC, memo, useCallback } from 'react';

import { Post, useAddReactionsMutation } from '@/store/features/post/post.api';

type ReactionButtonsProps = { post: Post };
const reactionEmoji: { [P in keyof Post['reactions']]: string } = {
  thumbsUp: '👍',
  wow: '😮',
  heart: '❤️',
  rocket: '🚀',
  coffee: '☕',
};
const ReactionButtons: FC<ReactionButtonsProps> = ({ post }): JSX.Element => {
  const [addReaction] = useAddReactionsMutation();
  const renderReactionButtons = useCallback(() => {
    return Object.entries(reactionEmoji).map(([name, emoji]) => {
      return (
        <button
          key={name + '-' + emoji}
          type='button'
          onClick={() => {
            const newValue =
              post.reactions[name as keyof Post['reactions']] + 1;
            addReaction({
              postId: post.id,
              reactions: { ...post.reactions, [name]: newValue },
            });
          }}
        >
          {emoji} {post.reactions[name as keyof Post['reactions']]}
        </button>
      );
    });
  }, [addReaction, post.id, post.reactions]);
  return <div>{renderReactionButtons()}</div>;
};
export default memo(ReactionButtons);
