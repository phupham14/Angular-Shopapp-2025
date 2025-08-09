import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { CartService } from 'src/app/services/cart.service';
import { CategoryService } from 'src/app/services/category.service';
import { Product } from '../../models/product';
import { ProductImage } from 'src/app/models/product.image';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  styleUrls: ['./detail-product.component.scss'],
})
export class DetailProductComponent implements OnInit {
  product?: Product;
  productId: number = 0;
  currentImageIndex: number = 0;
  quantity: number = 1;
  isLoggedIn: boolean = false;

  constructor(
    private userService: UserService,
    private productService: ProductService,
    private cartService: CartService,
    private activatedRoute: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router // private activatedRoute: ActivatedRoute,
  ) {}
  ngOnInit() {
    // Kiểm tra trạng thái đăng nhập
    const token = localStorage.getItem('token'); // hoặc dùng AuthService.isLoggedIn()
    this.isLoggedIn = !!token;
    // Lấy productId từ URL
    debugger;
    const idParam = this.activatedRoute.snapshot.paramMap.get('id');
    console.log('Received id:', idParam);
    //this.cartService.clearCart();
    //const idParam = 2 //fake tạm 1 giá trị
    if (idParam !== null) {
      this.productId = +idParam;
    }
    if (!isNaN(this.productId)) {
      this.productService.getDetailProduct(this.productId).subscribe({
        next: (response: any) => {
          // Lấy danh sách ảnh sản phẩm và thay đổi URL
          debugger;
          response.id = idParam; // ép đảm bảo có id
          if (response.product_images && response.product_images.length > 0) {
            response.product_images.forEach((product_image: ProductImage) => {
              product_image.image_url = `${environment.apiBaseUrl}/products/images/${product_image.image_url}`;
            });
          } else {
            // Gán ảnh mặc định nếu không có ảnh nào
            response.product_images = [
              {
                id: -1, // hoặc null, tùy schema
                image_url: `${environment.apiBaseUrl}/products/images/Tiramisu_1426.jpeg`, // ảnh mặc định
                product_id: response.id,
              },
            ];
          }
          debugger;
          this.product = response;
          // Bắt đầu với ảnh đầu tiên
          this.showImage(0);
        },
        complete: () => {
          debugger;
        },
        error: (error: any) => {
          debugger;
          console.error('Error fetching detail:', error);
        },
      });
    } else {
      console.error('Invalid productId:', idParam);
    }
  }

  showImage(index: number): void {
    debugger;
    if (
      this.product &&
      this.product.product_images &&
      this.product.product_images.length > 0
    ) {
      // Đảm bảo index nằm trong khoảng hợp lệ
      if (index < 0) {
        index = 0;
      } else if (index >= this.product.product_images.length) {
        index = this.product.product_images.length - 1;
      }
      // Gán index hiện tại và cập nhật ảnh hiển thị
      this.currentImageIndex = index;
    }
  }

  thumbnailClick(index: number) {
    debugger;
    // Gọi khi một thumbnail được bấm
    this.currentImageIndex = index; // Cập nhật currentImageIndex
  }

  nextImage(): void {
    debugger;
    this.showImage(this.currentImageIndex + 1);
  }

  previousImage(): void {
    debugger;
    this.showImage(this.currentImageIndex - 1);
  }

  addToCart(): void {
    // Lấy user từ UserService
    const user = this.userService.getUserResponseFromLocalStorage();
    const isLoggedIn = user !== null;

    if (!isLoggedIn) {
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.');
      this.router.navigate(['/login']);
      return;
    }

    // Kiểm tra sản phẩm và số lượng
    if (!this.product) {
      console.error('Không có sản phẩm để thêm vào giỏ hàng.');
      alert('Lỗi: Không tìm thấy sản phẩm.');
      return;
    }

    if (this.quantity < 1) {
      alert('Vui lòng chọn số lượng hợp lệ.');
      return;
    }

    // Gọi service để thêm sản phẩm vào giỏ hàng
    this.cartService.addToCart(this.product.id, this.quantity);
    console.log(
      `Thêm sản phẩm ${this.product.name} với số lượng ${this.quantity} vào giỏ hàng.`
    );
    alert(`Đã thêm "${this.product.name}" vào giỏ hàng.`);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  buyNow(): void {
    this.router.navigate(['/orders']);
  }
}
