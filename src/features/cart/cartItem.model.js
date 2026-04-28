export default class CartItemModel {
  constructor(_id, _userId, _productId, _quantity) {
    this.id = _id;
    this.userId = _userId;
    this.productId = _productId;
    this.quantity = _quantity;
  }

  //add product to cart
  // static addToCart(userId, productId, quantity){
  //     const newCartItem =  new CartItemModel(
  //         cartItems.length+1,
  //         userId,
  //         productId,
  //         quantity
  //     );
  //     cartItems.push(newCartItem);
  // }

  //get cart (get all cart items)
  // static getCart(userId){
  //     const cartItemsBtUserId = cartItems.filter((cartItem) => cartItem.userId == userId );
  //     console.log(`cartItems ${cartItemsBtUserId}`);
  //     return cartItemsBtUserId;
  // }

  //delete cart item
  // static deleteCartItem(id, userId){
  //     //check if cart item exists and userId exist
  //     const cartItemIndex = cartItems.findIndex((cartItem) => cartItem.id == id && cartItem.userId == userId);
  //     if(cartItemIndex == -1){
  //         return "product not found in cart items";
  //     }
  //     cartItems.splice(cartItemIndex,1);
  // }
}

// const cartItems = [
//     new CartItemModel(1, 2, 1, 1),  // new cartItemModel(id, userId, productId, quantity),
//     new CartItemModel(2, 2, 3, 1)
// ];
