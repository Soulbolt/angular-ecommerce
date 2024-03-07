import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  storage: Storage = sessionStorage;

  constructor() {
    // Read data from storage
    let data = JSON.parse(this.storage.getItem('cartItems'));

    if (data != null) {
      this.cartItems = data;

      // compute totals based on the data that is read from storage
      this.computeCartTotals();
    }
  }

  addToCart(theCartItem: CartItem) {
    // Check if we already have the item in our cart.
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined;

    if (this.cartItems.length > 0) {
      // Find the itme in the cart based on item id.
      existingCartItem = this.cartItems.find(
        (tempCartItem) => tempCartItem.id === theCartItem.id,
      );
      // Check if we found it
      alreadyExistsInCart = existingCartItem != undefined;
    }

    if (alreadyExistsInCart) {
      // Increase the quantity
      existingCartItem.quantity++;
    } else {
      // Add item to array
      this.cartItems.push(theCartItem);
    }
    // Compute cart total price and total quantity
    this.computeCartTotals();
  }

  /**
   * Decrements the quantity of a given cart item and updates the cart totals if necessary.
   *
   * This function decrements the quantity of the specified cart item. If the quantity becomes 0, the item is removed from the cart.
   * After updating the quantity or removing the item, the function triggers a recalculation of the cart totals.
   *
   * @param {CartItem} cartItem - The cart item for which the quantity should be decremented.
   * @return {void} This function does not return a value.
   */
  decrementQuantity(cartItem: CartItem) {
    const cartItemIndex = this.cartItems.findIndex(
      (item) => item.id === cartItem.id,
    );
    if (cartItemIndex >= 0) {
      const currentItem = this.cartItems[cartItemIndex];
      if (currentItem.quantity > 1) {
        currentItem.quantity--;
        this.computeCartTotals();
      } else {
        this.cartItems.splice(cartItemIndex, 1);
        this.computeCartTotals();
      }
    }
  }

  remove(cartItem: CartItem) {
    const cartItemIndex = this.cartItems.findIndex(
      (item) => item.id === cartItem.id,
    );

    if (cartItemIndex >= 0) {
      this.cartItems.splice(cartItemIndex, 1);
      this.computeCartTotals();
    }
  }

  computeCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems) {
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // Publish the new values... all subscribers will receive the new data;
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // Log cart data for debugging purposes
    this.logCartData(totalPriceValue, totalQuantityValue);

    // Persist cart data
    this.persistCartItems();
  }

  persistCartItems() {
    this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
  }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of shopping cart:');
    for (let tempCartItem of this.cartItems) {
      const subTotalPrice = tempCartItem.quantity * tempCartItem.unitPrice;
      console.log(
        `name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`,
      );
    }
    console.log(
      `totalPrice: ${totalPriceValue.toFixed(2)}, totalQuantity=${totalQuantityValue}`,
    );
    console.log('----');
  }
}
