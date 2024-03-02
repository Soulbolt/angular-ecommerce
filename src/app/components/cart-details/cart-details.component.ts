import { Component, OnInit } from '@angular/core';
import { CartItem } from '../../common/cart-item';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrl: './cart-details.component.css',
})
export class CartDetailsComponent implements OnInit {
  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails() {
    // Get a handle ot the cart items
    this.cartItems = this.cartService.cartItems;

    // Subscribe to cart totalPrrice
    this.cartService.totalPrice.subscribe((data) => (this.totalPrice = data));

    // Subscribe to cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      (data) => (this.totalQuantity = data),
    );

    // Compute cart total Price and Quantity
    this.cartService.computeCartTotals();
  }

  /**
   * Increment the quantity of a cart item.
   *
   * @param {CartItem} cartItem - the cart item to increment the quantity of
   * @return {void}
   */
  incrementQuantity(cartItem: CartItem) {
    this.cartService.addToCart(cartItem);
  }
}
