import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { OrderResponse } from 'src/app/responses/order/order.response';
import { environment } from '../../../environments/environment';
import { OrderDetail } from 'src/app/models/order.detail';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-order-confirmed',
  templateUrl: './order-confirmed.component.html',
  styleUrls: ['./order-confirmed.component.scss'],
})
export class OrderConfirmedComponent implements OnInit {
  totalAmount: number = 0;
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [],
  };

  constructor(
    private orderService: OrderService,
    private userService: UserService,
    private cartService: CartService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    debugger;
    const orderId = Number(this.route.snapshot.paramMap.get('id'));
    console.log('Order ID từ URL:', orderId);

    this.getOrderDetails(orderId);
  }

  getOrderDetails(orderId: number): void {
    // Kiểm tra đăng nhập
    debugger;
    const user = this.userService.getUserResponseFromLocalStorage();
    if (!user) {
      alert('Vui lòng đăng nhập để xem đơn hàng.');
      this.router.navigate(['/login']);
      return;
    }

    debugger;
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        console.log('API trả về:', response);

        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user?.id || 0;
        this.orderResponse.fullname = response?.fullName || '';
        this.orderResponse.email = response?.email || '';
        this.orderResponse.phone_number = response?.phoneNumber || '';
        this.orderResponse.address = response?.address || '';
        this.orderResponse.note = response?.note || '';
        this.orderResponse.order_date = new Date(response.orderDate);

        if (
          Array.isArray(response.shippingDate) &&
          response.shippingDate.length === 3
        ) {
          this.orderResponse.shipping_date = new Date(
            response.shippingDate[0],
            response.shippingDate[1] - 1,
            response.shippingDate[2]
          );
        }

        this.orderResponse.order_details = Array.isArray(response.orderDetails)
          ? response.orderDetails.map((order_detail: any) => {
              const product = order_detail.product || {};
              product.thumbnail = product.thumbnail
                ? `${environment.apiBaseUrl}/products/images/${product.thumbnail}`
                : `${environment.apiBaseUrl}/products/images/Tiramisu_1426.jpeg`;

              return {
                quantity: order_detail.numberOfProducts, // map sang quantity
                price:
                  product.price ||
                  order_detail.totalPrice / order_detail.numberOfProducts, // lấy giá
                product: {
                  id: product.id,
                  name: product.name,
                  thumbnail: product.thumbnail,
                },
              };
            })
          : [];

        this.orderResponse.payment_method = response?.paymentMethod || '';
        this.orderResponse.shipping_method = response?.shippingMethod || '';
        this.orderResponse.status = response.status || '';
        this.orderResponse.total_money = response.totalMoney || 0;

        // Gán vào totalAmount để hiển thị tổng
        debugger
        this.totalAmount = response.orderDetails.reduce(
          (sum: number, od: any) => sum + od.totalPrice,
          0
        );

      },
      error: (error: any) => {
        console.error('Lỗi khi lấy đơn hàng:', error);
      },
    });
  }

  backToHome(): void {
    alert('Xác nhận đơn hàng thành công. Mời quý khách tiếp tục mua hàng');
    //let status = "PROCESSING"
    this.router.navigate(['/']);
    this.cartService.clearCart();
  }
}
