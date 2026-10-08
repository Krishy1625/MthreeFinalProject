package mthree.com.finalproject.service;

import mthree.com.finalproject.dao.FavouriteDao;
import mthree.com.finalproject.model.Favourite;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FavouriteServiceImpl implements FavouriteService {
    private final FavouriteDao favouriteDao;

    public FavouriteServiceImpl(FavouriteDao favouriteDao) {
        this.favouriteDao = favouriteDao;
    }

    @Override
    public List<Favourite> getAllFavourites(int userId) {
        return favouriteDao.getAllFavourites(userId);
    }

    @Override
    public Favourite addFavourite(Favourite favourite) {
        if (favourite == null) {
            throw new IllegalArgumentException("Favourite details are required.");
        }

        if (favourite.getUserId() <= 0
                || favourite.getFromCurrencyId() <= 0
                || favourite.getToCurrencyId() <= 0) {
            throw new IllegalArgumentException("Valid user and currency IDs are required.");
        }

        return favouriteDao.addFavourite(favourite);
    }

    @Override
    public Favourite editFavourite(Favourite favourite) {
        if (favourite == null) {
            throw new IllegalArgumentException("Favourite details are required.");
        }

        if (favourite.getFavId() <= 0
                || favourite.getUserId() <= 0
                || favourite.getFromCurrencyId() <= 0
                || favourite.getToCurrencyId() <= 0) {
            throw new IllegalArgumentException("Valid favourite, user and currency IDs are required.");
        }

        return favouriteDao.editFavourite(favourite);
    }

    @Override
    public void deleteFavourite(int favouriteId) {
        if (favouriteId <= 0) {
            throw new IllegalArgumentException("A valid favourite ID is required.");
        }

        favouriteDao.deleteFavourite(favouriteId);
    }
}
