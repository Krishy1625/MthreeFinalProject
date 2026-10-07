package mthree.com.finalproject.controller;

import mthree.com.finalproject.dao.CurrencyDao;
import mthree.com.finalproject.dao.FavouriteDao;
import mthree.com.finalproject.dao.UserDao;
import mthree.com.finalproject.model.Currency;
import mthree.com.finalproject.model.Favourite;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.Locale;

@RestController
@RequestMapping("/api/users/{userId}/favourites")
public class FavouriteController {

    private final FavouriteDao favouriteDao;
    private final CurrencyDao currencyDao;
    private final UserDao userDao;

    public FavouriteController(FavouriteDao favouriteDao, CurrencyDao currencyDao, UserDao userDao) {
        this.favouriteDao = favouriteDao;
        this.currencyDao = currencyDao;
        this.userDao = userDao;
    }

    @GetMapping
    public ResponseEntity<?> getFavourites(@PathVariable int userId) {
        if (!userExists(userId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(favouriteDao.getAllFavourites(userId));
    }

    @PostMapping
    public ResponseEntity<?> addFavourite(
            @PathVariable int userId,
            @Valid @RequestBody FavouriteRequest request) {
        if (!userExists(userId)) {
            return ResponseEntity.notFound().build();
        }

        Currency fromCurrency;
        Currency toCurrency;
        try {
            fromCurrency = currencyDao.findCurrencyByCode(normalizeCode(request.getFromCurrency()));
            toCurrency = currencyDao.findCurrencyByCode(normalizeCode(request.getToCurrency()));
        } catch (EmptyResultDataAccessException exception) {
            return ResponseEntity.badRequest().body(new ApiError("Select valid currencies."));
        }

        Favourite favourite = new Favourite();
        favourite.setUserId(userId);
        favourite.setFromCurrencyId(fromCurrency.getCurrencyId());
        favourite.setToCurrencyId(toCurrency.getCurrencyId());

        try {
            favouriteDao.addFavourite(favourite);
        } catch (DuplicateKeyException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("That currency pair is already a favourite."));
        }

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @DeleteMapping("/{favouriteId}")
    public ResponseEntity<Void> deleteFavourite(
            @PathVariable int userId,
            @PathVariable int favouriteId) {
        if (!userExists(userId) || favouriteDao.deleteFavourite(favouriteId, userId) == 0) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.noContent().build();
    }

    private boolean userExists(int userId) {
        try {
            userDao.findUserById(userId);
            return true;
        } catch (EmptyResultDataAccessException exception) {
            return false;
        }
    }

    private String normalizeCode(String code) {
        return code.trim().toUpperCase(Locale.ROOT);
    }

    public static class FavouriteRequest {
        @NotBlank
        @Size(max = 3)
        private String fromCurrency;

        @NotBlank
        @Size(max = 3)
        private String toCurrency;

        public String getFromCurrency() {
            return fromCurrency;
        }

        public void setFromCurrency(String fromCurrency) {
            this.fromCurrency = fromCurrency;
        }

        public String getToCurrency() {
            return toCurrency;
        }

        public void setToCurrency(String toCurrency) {
            this.toCurrency = toCurrency;
        }
    }

    public static class ApiError {
        private final String message;

        public ApiError(String message) {
            this.message = message;
        }

        public String getMessage() {
            return message;
        }
    }
}
