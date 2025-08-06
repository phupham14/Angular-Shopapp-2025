import { Component } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';
import { OrderService } from '../../services/order.service';
import { OrderDTO } from '../../dtos/order/order.dto';
import { CartItemDTO } from '../../dtos/order/cart.item.dto';
import { environment } from '../../../environments/environment';
import { OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Form } from '@angular/forms';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  cartItems: { product: Product, quantity: number }[] = [];
    orderForm: FormGroup;
    couponCode: string = ''; // Mã giảm giá
    totalAmount: number = 0; // Tổng tiền
    orderData: OrderDTO = {
      user_id: 10,
      fullname: '',
      email: '',
      phone_number: '',
      address: '',
      note: '',
      total_money: 0,
      payment_method: 'cod',
      shipping_address: '',
      shipping_method: 'standard',
      coupon_code: '',
      cart_items: []
    }
  
    constructor(
      private cartService: CartService,
      private productService: ProductService,
      private orderService: OrderService,
      private fb: FormBuilder
    ) {
      // Tạo FormGroup và các FormControl tương ứng
      this.orderForm = this.fb.group({
        fullname: ['', Validators.required], // fullname là FormControl bắt buộc      
        email: ['', [Validators.email]], // Sử dụng Validators.email cho kiểm tra định dạng email
        phone_number: ['', [Validators.required, Validators.minLength(6)]], // phone_number bắt buộc và ít nhất 6 ký tự
        address: ['', [Validators.required, Validators.minLength(5)]], // address bắt buộc và ít nhất 5 ký tự
        note: [''],
        shipping_method: [''],
        payment_method: ['']
      });
    }
  
    ngOnInit(): void {    
      // Lấy danh sách sản phẩm từ giỏ hàng
      debugger
      const cart = this.cartService.getCart();
      const productIds = Array.from(cart.keys()); // Chuyển danh sách ID từ Map giỏ hàng    
  
      // Gọi service để lấy thông tin sản phẩm dựa trên danh sách ID
      debugger
      this.productService.getProductsByIds(productIds).subscribe({
        next: (products) => {            
          debugger
          // Lấy thông tin sản phẩm và số lượng từ danh sách sản phẩm và giỏ hàng
          this.cartItems = productIds.map((productId) => {
            debugger
            const product = products.find((p) => p.id === productId);
            if (product) {
              product.thumbnail = `${environment.apiBaseUrl}/products/images/${product.thumbnail}`;
            }          
            return {
              product: product!,
              quantity: cart.get(productId)!
            };
          });
          console.log('Success!');
        },
        complete: () => {
          debugger;
          this.calculateTotal()
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching detail:', error);
        }
      });        
    }

    placeOrder() {
    debugger
    if (this.orderForm.valid) {
      // Sử dụng toán tử spread (...) để sao chép giá trị từ form vào orderData
      this.orderData = {
        ...this.orderData,
        ...this.orderForm.value
      };
      this.orderData.cart_items = this.cartItems.map(cartItem => ({
        product_id: cartItem.product.id,
        quantity: cartItem.quantity
      }));
      // Dữ liệu hợp lệ, bạn có thể gửi đơn hàng đi
      this.orderService.placeOrder(this.orderData).subscribe({
        next: (response) => {
          debugger;
          console.log('Đặt hàng thành công');
        },
        complete: () => {
          debugger;
          this.calculateTotal();
          alert("Đặt hàng thành công");
        },
        error: (error: any) => {
          debugger;
          console.error('Lỗi khi đặt hàng:', error);
        },
      });
    } else {
      // Hiển thị thông báo lỗi hoặc xử lý khác
      alert('Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.');
    }        
  }

    // Hàm tính tổng tiền
    calculateTotal(): void {
        this.totalAmount = this.cartItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    }
  
    // Hàm xử lý việc áp dụng mã giảm giá
    applyCoupon(): void {
        // Viết mã xử lý áp dụng mã giảm giá ở đây
        // Cập nhật giá trị totalAmount dựa trên mã giảm giá nếu áp dụng
    }

}
