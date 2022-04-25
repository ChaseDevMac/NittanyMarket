<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ChaseDevMac/NittanyMarket">
    <img src="images/nittanymarket.png" alt="Logo" height="160">
  </a>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About NittanyMarket</a>
      <ul>
        <li><a href="#tech-stack">Tech Stack</a></li>
        <li><a href="#design-decisions">Design Decisions</a></li>
      </ul>
    </li>
    <li>
      <a href="#functionality">Functionality</a>
      <ul>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#core-features">Core Features</a></li>
        <li><a href="#extra-features">Extra Features</a></li>
      </ul>
    </li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

NittanyMarket is an eBay-like E-commerce platform for the fictional school Nittany State University (NSU) -- its faculty, staff, students, and local businesses. NSU reached out to Penn State to enlist computer science students to design and implement a prototype for the platform.


### Tech Stack

* [Express.js](https://expressjs.com): Backend web framework built on Node.js to handle all NittanyMarket business logic
* [Bootstrap](https://getbootstrap.com): CSS framework for quick front end development
* [MariaDB](https://mariadb.com): RDBMS to handle all NittanyMarket data 
* [Redis](https://redis.io): in-memory database to manage user session data

### Design Decisions

* Model-View-Controller design pattern
* RESTful API
* [Sequelize](https://sequelize.org) ORM abstraction layer for MariaDB for cleaner, more maintainable code

## Functionality

### Overview
* Visiters can browse the website through the category hierarchy or searching all of NittanyMarket (without being signed in)
* Once a visiter wants to add an item to their cart, they must first login or register
* Once logged in/registered users can add/remove items from their cart, view their account details, and change their password
* If a user wishes to checkout, they must first finish setting up their account by providing a billing and home address and a credit card
* Users can then place an order, review the product associated with that order, and/or rate the seller of the product
* If a user wants to create their own product listing, they must first get approval from the admin by submitting a seller application
* Sellers are also able to edit or remove product listings. If removed, no one but the seller can see the listing

### Core Features
* Login and registration
* View user account information and change password
* Explore the marketplace, filtering through the category hierarchy
* Place an order

### Extra Features
* Create a product listing
* Review a listing and its seller/owner once ordered
* Manage items in shopping cart
* Search the marketplace's listings

<!-- CONTACT -->
## Contact

Chase McFarlane - [@ChaseDevMac](https://linkedin.com/ChaseDevMac) - ChaseDevMac@protonmail.com


