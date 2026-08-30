🛍️VibeCart

Dynamic Product Gallery

VibeCart is a simple, responsive product gallery developed using HTML, CSS, and JavaScript.

The project is based on the following use case:

Develop a product gallery with filter buttons. How would you show/hide products dynamically using JavaScript without reloading the page?

The application demonstrates dynamic product filtering and product visibility without requiring a page refresh.

Live Demo

Deployed Website:
https://vibecart-store.vercel.app/

Use Case

The main purpose of VibeCart is to allow users to browse products and dynamically control which products are displayed.

Users can:

Filter products by category.

Show or hide products.

Search for products.

Sort products.

View product details.

Manage products.

Add products to favourites.

Add products to a shopping bag.

All major interactions take place directly on the webpage without unnecessary page reloads.

Main Features

Category Filtering

Products can be filtered using category buttons such as:

All Products

Fashion

Tech

Home

Show / Hide Products

The Manage Products section provides a Show/Hide option for individual products. Hidden products are removed from the visible gallery and can be shown again whenever required.

Search

Users can search for products by name.

Sorting

Products can be sorted according to the available sorting options, including price and featured products.

Favourites

Users can mark products as favourites and view their favourite products.

Shopping Bag

Products can be added to a shopping bag, where users can manage quantities and view the total.

Product Details

Users can open a product to view additional information such as its name, category, rating, description, and price.

Product Management

The application provides product management functionality for adding and hiding/showing products.

Technologies Used

HTML5

CSS3

JavaScript

DOM Manipulation

Browser Local Storage

Vercel

How It Works

Products are displayed in a responsive gallery.

The user selects a category filter.

JavaScript checks the selected category against the products.

Matching products are displayed in the gallery.

Products that do not match the selected filter are hidden.

Users can also use the Show/Hide option to control individual product visibility.

These changes happen dynamically without reloading the webpage.

Project Structure

VibeCart/
├── index.html
├── style.css
├── script.js
└── README.md

Data Storage

VibeCart uses browser local storage to preserve product and application data between sessions.

Responsive Design

The interface is designed to work across desktop, tablet, and mobile screen sizes.

Deployment

VibeCart is deployed using Vercel.

Live Demo: https://vibecart-store.vercel.app/

Testing

The following functionality has been tested:

Category filtering

Show/Hide products

Product search

Product sorting

Product details

Favourites

Shopping bag

Product management

Responsive layout

Data persistence using local storage

Future Scope

Backend database integration

User authentication

Online checkout and payment

Admin dashboard

Advanced product filtering

Larger product catalogue support

Conclusion

VibeCart demonstrates a dynamic product gallery where JavaScript is used to filter, show, and hide products without reloading the webpage.

The project provides a simple and interactive shopping-gallery experience while demonstrating important front-end concepts such as event handling, DOM manipulation, filtering, and browser storage.

VibeCart — Dynamic Product Gallery
Live Demo: https://vibecart-store.vercel.app/