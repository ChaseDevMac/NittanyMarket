CREATE TABLE Carts (
  cart_id UUID,
  email VARCHAR(255) NOT NULL UNIQUE,

  PRIMARY KEY (cart_id),
  FOREIGN KEY (email) REFERENCES Users
);

CREATE TABLE CartItems (
  cart_id UUID,
  listing_id INT NOT NULL,
  seller_email VARCHAR(255) NOT NULL,
  quantity INT NOT NULL,

  PRIMARY KEY (cart_id, listing_id),
  FOREIGN KEY (cart_id) REFERENCES Carts (cart_id),
  FOREIGN KEY (seller_email, listing_id) REFERENCES ProductListings (seller_email, listing_id)
);
