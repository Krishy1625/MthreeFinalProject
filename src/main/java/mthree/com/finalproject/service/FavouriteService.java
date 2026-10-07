package mthree.com.finalproject.service;

import mthree.com.finalproject.model.Favourite;

import java.util.List;

public interface FavouriteService {
    List<Favourite> getAllFavourites(int userId);

    Favourite addFavourite(Favourite favourite);

    Favourite editFavourite(Favourite favourite);

    void deleteFavourite(int favouriteId);
}
