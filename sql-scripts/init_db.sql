DROP DATABASE IF EXISTS nittanymarket;
CREATE DATABASE IF NOT EXISTS nittanymarket;
USE nittanymarket;

CREATE TABLE Users (
  email     VARCHAR(255),
  password  VARCHAR(50),

  PRIMARY KEY (email)
);

CREATE TABLE ZipcodeInfo (
  zipcode     INT,
  city        VARCHAR(255),
  state_id    CHAR(2),
  population  INT,
  density     DECIMAL(10,2),
  country     VARCHAR(255),
  timezone    VARCHAR(255),

  PRIMARY KEY (zipcode)
);

CREATE TABLE Addresses (
  addr_id         CHAR(32),
  zipcode         INT,
  street_num      INT,
  street_name     VARCHAR(255),

  PRIMARY KEY(addr_id),
  FOREIGN KEY (zipcode) REFERENCES ZipcodeInfo (zipcode)
);

CREATE TABLE Buyers (
  email           VARCHAR(255),
  first_name      VARCHAR(50),
  last_name       VARCHAR(50),
  gender          VARCHAR(30),
  age             INT,
  home_addr_id    CHAR(32),
  billing_addr_id CHAR(32),

  PRIMARY KEY (email),
  FOREIGN KEY (email) REFERENCES Users (email),
  FOREIGN KEY (home_addr_id) REFERENCES Addresses (addr_id),
  FOREIGN KEY (billing_addr_id) REFERENCES Addresses (addr_id)
);

CREATE TABLE CreditCards (
  ccn           CHAR(19),
  ccv           INT,
  exp_month     INT,
  exp_year      INT,
  brand         VARCHAR(20),
  owner         VARCHAR(255),

  PRIMARY KEY (ccn),
  FOREIGN KEY (owner) REFERENCES Users (email)
);

CREATE TABLE Sellers (
  email           VARCHAR(255),
  routing_num     CHAR(11),
  account_num     INT,
  balance         DECIMAL(10,2),

  PRIMARY KEY (email),
  FOREIGN KEY (email) REFERENCES Users (email)
);

CREATE TABLE LocalVendors (
  email                   VARCHAR(255),
  busi_name               VARCHAR(255),
  busi_addr_id            CHAR(32),
  customer_service_num    CHAR(10),

  PRIMARY KEY (email),
  FOREIGN KEY (email) REFERENCES Sellers (email),
  FOREIGN KEY (busi_addr_id) REFERENCES Addresses (addr_id)
);

CREATE TABLE Categories (
  cate_name     VARCHAR(255),
  parent_cate   VARCHAR(255) DEFAULT NULL,

  PRIMARY KEY (cate_name),
  FOREIGN KEY (parent_cate) REFERENCES Categories (cate_name)
);

CREATE TABLE ProductListings (
  seller_email    VARCHAR(255),
  listing_id      INT,
  category        VARCHAR(255),
  title           VARCHAR(255),
  product_name    VARCHAR(255),
  product_desc    TEXT,
  price           VARCHAR(25),
  quantity        INT,

  PRIMARY KEY (seller_email, listing_id),
  FOREIGN KEY (seller_email) REFERENCES Sellers (email),
  FOREIGN KEY (category) REFERENCES Categories (cate_name)
);

CREATE TABLE Orders (
  transaction_id    INT,
  seller_email      VARCHAR(255),
  listing_id        INT,
  buyer_email       VARCHAR(255),
  order_date        VARCHAR(8),
  quantity          INT,
  payment           INT,

  PRIMARY KEY (transaction_id),
  FOREIGN KEY (seller_email, listing_id) REFERENCES ProductListings (seller_email, listing_id),
  FOREIGN KEY (buyer_email) REFERENCES Buyers (email)
);

CREATE TABLE Reviews (
  buyer_email     VARCHAR(255),
  seller_email    VARCHAR(255),
  listing_id      INT,
  review_desc     TEXT,

  PRIMARY KEY (buyer_email, seller_email, listing_id),
  FOREIGN KEY (buyer_email) REFERENCES Buyers (email),
  FOREIGN KEY (seller_email, listing_id) REFERENCES ProductListings (seller_email, listing_id)
);

CREATE TABLE Ratings (
  buyer_email     VARCHAR(255),
  seller_email    VARCHAR(255),
  rate_date       VARCHAR(8),
  rating          INT(1),
  rating_desc     TEXT,

  PRIMARY KEY (buyer_email, seller_email, rate_date),
  FOREIGN KEY (buyer_email) REFERENCES Buyers (email),
  FOREIGN KEY (seller_email) REFERENCES Sellers (email)
);
