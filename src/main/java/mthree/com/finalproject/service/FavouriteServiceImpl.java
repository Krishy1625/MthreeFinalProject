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
        return favouriteDao.addFavourite(favourite);
    }

    @Override
    public Favourite editFavourite(Favourite favourite) {
        return favouriteDao.editFavourite(favourite);
    }

    @Override
    public void deleteFavourite(int favouriteId) {
        favouriteDao.deleteFavourite(favouriteId);
    }
}
