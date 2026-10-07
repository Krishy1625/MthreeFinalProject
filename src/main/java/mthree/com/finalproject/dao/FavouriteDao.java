package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.Favourite;

import java.util.List;

public interface FavouriteDao {

    List<Favourite> getAllFavourites(int userId);

    Favourite addFavourite(Favourite favourite);

    int deleteFavourite(int favouriteId, int userId);
}
