package mthree.com.finalproject.dao;

import mthree.com.finalproject.model.Favourite;

import java.util.List;

public interface FavouriteDao {

    List<Favourite> getAllFavourites(int userId);

    Favourite addFavourite(Favourite favourite);

    Favourite editFavourite(Favourite favourite);

    void deleteFavourite(int favouriteId);
}
