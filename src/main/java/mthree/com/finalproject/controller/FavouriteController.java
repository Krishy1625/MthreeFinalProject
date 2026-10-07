package mthree.com.finalproject.controller;

import mthree.com.finalproject.model.Favourite;
import mthree.com.finalproject.service.FavouriteService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/favourites")
public class FavouriteController {

    private final FavouriteService favouriteService;

    public FavouriteController(FavouriteService favouriteService) {
        this.favouriteService = favouriteService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getAllFavourites(@PathVariable int userId) {
        try {
            List<Favourite> favourites = favouriteService.getAllFavourites(userId);
            return ResponseEntity.ok(favourites);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(new ApiError(exception.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> addFavourite(@Valid @RequestBody Favourite favourite) {
        try {
            Favourite addedFavourite = favouriteService.addFavourite(favourite);
            return ResponseEntity.status(HttpStatus.CREATED).body(addedFavourite);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(new ApiError(exception.getMessage()));
        } catch (DuplicateKeyException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("That currency pair is already a favourite."));
        }
    }

    @DeleteMapping("/{favouriteId}")
    public ResponseEntity<Void> deleteFavourite(@PathVariable int favouriteId) {
        favouriteService.deleteFavourite(favouriteId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<?> editFavourite(@Valid @RequestBody Favourite favourite) {
        try {
            Favourite updatedFavourite = favouriteService.editFavourite(favourite);
            return ResponseEntity.ok(updatedFavourite);
        } catch (IllegalArgumentException exception) {
            return ResponseEntity.badRequest().body(new ApiError(exception.getMessage()));
        } catch (EmptyResultDataAccessException exception) {
            return ResponseEntity.notFound().build();
        } catch (DuplicateKeyException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(new ApiError("That currency pair is already a favourite."));
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
