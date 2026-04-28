export default class OrderModel {
  constructor(_userId, _orderAmount, _timestamp) {
    this.userId = _userId;
    this.orderAmount = _orderAmount;
    this.timestamp = _timestamp;
  }
}
