package mthree.com.finalproject.controller;

import mthree.com.finalproject.model.Favourite;
import mthree.com.finalproject.service.FavouriteService;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/favourites")
public class FavouriteController {

    private final FavouriteService favouriteService;

    public FavouriteController(FavouriteService favouriteService) {
        this.favouriteService = favouriteService;
    }

    @GetMapping("/user/{userId}")
    public List<Favourite> getAllFavourites(@PathVariable int userId) {
        return favouriteService.getAllFavourites(userId);
    }

    @PostMapping
    public ResponseEntity<?> addFavourite(@RequestBody Favourite favourite) {
        try {
            Favourite addedFavourite = favouriteService.addFavourite(favourite);
            return ResponseEntity.status(HttpStatus.CREATED).body(addedFavourite);
        } catch (DuplicateKeyException exception) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body("This currency pair is already a favourite.");
        }
    }

    @DeleteMapping("/{favouriteId}")
    public ResponseEntity<Void> deleteFavourite(@PathVariable int favouriteId) {
        favouriteService.deleteFavourite(favouriteId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping
    public ResponseEntity<Favourite> editFavourite(@RequestBody Favourite favourite) {
        Favourite updatedFavourite = favouriteService.editFavourite(favourite);
        return ResponseEntity.ok(updatedFavourite);
    }
}
