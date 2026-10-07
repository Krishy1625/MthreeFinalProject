import FavouritePairs from '../components/FavouritePairs.jsx';

export default function Favourites({ user }) {
  return <FavouritePairs userId={user.userId} title="Your favourite currency pairs" />;
}
