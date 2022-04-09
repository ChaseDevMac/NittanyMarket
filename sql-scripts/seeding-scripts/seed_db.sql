\! echo "Seeding All Tables..."
\! echo ""

\! echo "Seeding Users..."
SOURCE seeding-scripts/users.sql
\! echo "Seeding ZipcodeInfo..."
SOURCE seeding-scripts/zipcodeinfo.sql
\! echo "Seeding Addresses..."
SOURCE seeding-scripts/addresses.sql
\! echo "Seeding Buyers..."
SOURCE seeding-scripts/buyers.sql
\! echo "Seeding CreditCards..."
SOURCE seeding-scripts/creditcards.sql
\! echo "Seeding Sellers..."
SOURCE seeding-scripts/sellers.sql
\! echo "Seeding Categories..."
SOURCE seeding-scripts/categories.sql
\! echo "Seeding ProductListings..."
SOURCE seeding-scripts/productlistings.sql
\! echo "Seeding Orders..."
SOURCE seeding-scripts/orders.sql
\! echo "Seeding Ratings..."
SOURCE seeding-scripts/ratings.sql
\! echo "Seeding Reviews..."
SOURCE seeding-scripts/reviews.sql
