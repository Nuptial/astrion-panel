import { Button } from 'antd';
import { HeartFilled, HeartOutlined } from '@ant-design/icons';
import clsx from 'clsx';
import type { KeyboardEvent } from 'react';
import { toggleFavorite, selectIsProductFavorite } from '@/store/slices/favoritesSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

type FavoriteButtonProps = {
  productId: string;
  size?: 'small' | 'middle';
};

const FavoriteButton = ({ productId, size = 'middle' }: FavoriteButtonProps) => {
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((state) => selectIsProductFavorite(state, productId));

  const handleToggleFavorite = () => {
    dispatch(toggleFavorite(productId));
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleToggleFavorite();
    }
  };

  return (
    <Button
      size={size}
      onClick={handleToggleFavorite}
      onKeyDown={handleKeyDown}
      type={isFavorite ? 'primary' : 'default'}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      icon={
        isFavorite ? (
          <HeartFilled className="text-red-500" />
        ) : (
          <HeartOutlined className="text-slate-600" />
        )
      }
      className={clsx('flex items-center gap-2')}
    >
      {isFavorite ? 'Favorited' : 'Favorite'}
    </Button>
  );
};

export default FavoriteButton;

