import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/services/order.service';
import { OrderResponse } from 'src/app/responses/order/order.response';
import { environment } from '../../../environments/environment';
import { OrderDetail } from 'src/app/models/order.detail';

@Component({
  selector: 'app-order-confirmed',
  templateUrl: './order-confirmed.component.html',
  styleUrls: ['./order-confirmed.component.scss']
})
export class OrderConfirmedComponent implements OnInit {
  orderResponse: OrderResponse = {
    id: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0, // Hoặc bất kỳ giá trị số nào bạn muốn
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [] // Một mảng rỗng
  };  
  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    const orderId = 20; // Thay bằng ID của đơn hàng bạn muốn lấy.
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        debugger
        console.log('API response:', response); // Kiểm tra dữ liệu

        debugger
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user?.id || 0;
        this.orderResponse.fullname = response.fullName || '';
        this.orderResponse.email = response.email || '';
        this.orderResponse.phone_number = response.phoneNumber || '';
        this.orderResponse.address = response.address || '';
        this.orderResponse.note = response.note || '';

        this.orderResponse.order_date = new Date(response.orderDate);

        // Chuyển mảng [year, month, day] thành Date object
        if (Array.isArray(response.shippingDate) && response.shippingDate.length === 3) {
          this.orderResponse.shipping_date = new Date(
            response.shippingDate[0],
            response.shippingDate[1] - 1,
            response.shippingDate[2]
          );
        }

        // Gán orderDetails nếu là mảng
        this.orderResponse.order_details = Array.isArray(response.orderDetails)
          ? response.orderDetails.map((order_detail: OrderDetail) => {
              if (order_detail.product?.thumbnail) {
                order_detail.product.thumbnail = `${environment.apiBaseUrl}/products/images/${order_detail.product.thumbnail}`;
              }
              return order_detail;
            })
          : [];

        this.orderResponse.payment_method = response.paymentMethod || '';
        this.orderResponse.shipping_method = response.shippingMethod || '';
        this.orderResponse.status = response.status || '';
        this.orderResponse.total_money = response.totalMoney || 0;
      },
      error: (error: any) => {
        console.error('Error fetching detail:', error);
      }
    });
  }

}

